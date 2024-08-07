package com.zionex.t3series.web.security.authentication;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;

import com.zionex.t3series.web.domain.admin.log.SystemAccessService;
import com.zionex.t3series.web.domain.admin.user.User;
import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.security.jwt.JwtTokenProvider;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomLogoutHandler implements LogoutHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @Autowired
    private SystemAccessService systemAccessService;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
            Claims claims = jwtTokenProvider.parseClaims(jwtTokenProvider.resolveToken(request));
            if (claims != null) {
                User user = userService.getUser(claims.getSubject());
                if (user.getJti().equals(claims.getId())) {
                    user.setJti(null);
                    userService.saveUser(user);
                }
                systemAccessService.logSystemLogout(claims.getId());

                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth != null) {
                    new SecurityContextLogoutHandler().logout(request, response, auth);
                }
            }
    }
    
}
