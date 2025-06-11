package com.zionex.t3series.web.security.authentication;

import static com.zionex.t3series.web.constant.ApplicationConstants.CONTENT_TYPE_JSON;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.UUID;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3series.web.domain.admin.account.AccountManager;
import com.zionex.t3series.web.domain.admin.log.SystemAccess;
import com.zionex.t3series.web.domain.admin.log.SystemAccessService;
import com.zionex.t3series.web.domain.admin.user.User;
import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.security.jwt.JwtTokenProvider;

import lombok.extern.java.Log;

@Log
public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserService userService;

    @Autowired
    private AccountManager accountManager;

    @Autowired
    private SystemAccessService systemAccessService;

    public AuthenticationFilter(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        super(authenticationManager);
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
        String username = request.getParameter(SPRING_SECURITY_FORM_USERNAME_KEY);
        String password = request.getParameter(SPRING_SECURITY_FORM_PASSWORD_KEY);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);

        return authenticationManager.authenticate(authenticationToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        UserDetails userDetails = (UserDetails) authResult.getPrincipal();
        String username = userDetails.getUsername();

        User user = userService.getUser(username);
        String uuid = UUID.randomUUID().toString().replace("-", "");

        String jwtToken = jwtTokenProvider.createToken(userDetails, uuid);
        if (jwtToken != null) {
            AuthenticationInfo authenticationInfo = AuthenticationInfo.builder()
                    .token(jwtToken)
                    .userId(user.getId())
                    .username(username)
                    .displayName(user.getDisplayName())
                    .uniqueValue(user.getUniqueValue())
                    .systemAdmin(accountManager.isSystemAdmin(username))
                    .passwordExpired(user.getPasswordExpired())
                    .build();

            response.setContentType(CONTENT_TYPE_JSON);

            ObjectMapper mapper = new ObjectMapper();
            PrintWriter writer = response.getWriter();

            mapper.writeValue(writer, authenticationInfo);
            writer.flush();
            writer.close();

            user.setJti(uuid);
            userService.afterAuthSuccess(user);

            SystemAccess systemAccessLog = new SystemAccess();
            systemAccessLog.setId(uuid);
            systemAccessLog.setUser(user);

            systemAccessService.addSystemAccessLog(systemAccessLog, request);
        }

    }

    @Override
    public void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        String userId = request.getParameter("username");
        String errorCode;
        String errorMessage;

        if (exception instanceof UsernameNotFoundException) {
            errorCode = "MSG_LOGIN_FAIL";
            errorMessage = "The username or password you entered is incorrect.";
        } else if (exception instanceof BadCredentialsException) {
            errorCode = "MSG_LOGIN_FAIL";
            userService.incLoginFailCount(userId);
            errorMessage = "The username or password you entered is incorrect.";
        } else if (exception instanceof LockedException) {
            errorCode = "MSG_LOGIN_FAIL_01";
            errorMessage = "User account is locked, Contact the Administrator";
        } else if (exception instanceof DisabledException) {
            errorCode = "MSG_LOGIN_FAIL_02";
            errorMessage = "User account is Disabled, Contact the Administrator";
        } else {
            errorCode = "MSG_LOGIN_FAIL_03";
            errorMessage = "Internal error occurred";
        }

        log.severe("login fails : " + errorMessage);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        PrintWriter writer = response.getWriter();
        writer.println(errorCode);
        writer.flush();
        writer.close();
    }

}
