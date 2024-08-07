package com.zionex.t3series.web.domain.admin.auth;

import java.io.PrintWriter;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.RequestContextUtils;

import com.zionex.t3series.web.domain.admin.log.SystemAccess;
import com.zionex.t3series.web.domain.admin.log.SystemAccessService;
import com.zionex.t3series.web.domain.admin.user.User;
import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.security.authentication.UserDetailService;
import com.zionex.t3series.web.security.jwt.JwtTokenProvider;

@Service
public class SsoService {

    public static void ssoLogin(String username, HttpServletRequest request, HttpServletResponse response) throws Exception {
        String contextPath = request.getContextPath();
        contextPath = StringUtils.isEmpty(contextPath) ? "/" : contextPath + "/";

        ApplicationContext applicationContext = RequestContextUtils.findWebApplicationContext(request);

        UserDetailService userDetailService = (UserDetailService) applicationContext.getBean("userDetailService");
        UserService userService = (UserService) applicationContext.getBean("userService");
        JwtTokenProvider jwtTokenProvider = (JwtTokenProvider) applicationContext.getBean("jwtTokenProvider");

        SystemAccessService systemAccessService = (SystemAccessService) applicationContext.getBean("systemAccessService");

        User user = userService.getUser(username);
        if (!StringUtils.isEmpty(user.getId())) {
            UserDetails userDetails = userDetailService.loadUserByUsername(username);
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, userDetails.getPassword(), userDetails.getAuthorities());

            SecurityContext securityContext = SecurityContextHolder.getContext();
            securityContext.setAuthentication(authentication);

            String uuid = UUID.randomUUID().toString().replace("-", "");
            String jwtToken = jwtTokenProvider.createToken(userDetails, uuid);
            if (jwtToken != null) {
                response.setContentType("text/html; charset=UTF-8");
                PrintWriter writer = response.getWriter();
                writer.println("<script>");
                writer.println("sessionStorage.setItem('token', '" + jwtToken + "');");
                writer.println("location.href='"+ contextPath +"';");
                writer.println("</script>");
                writer.flush();
                writer.close();

                user.setJti(uuid);
                userService.afterAuthSuccess(user);

                SystemAccess systemAccessLog = new SystemAccess();
                systemAccessLog.setId(uuid);
                systemAccessLog.setUser(user);
    
                systemAccessService.addSystemAccessLog(systemAccessLog, request);
            } else {
                response.sendRedirect(contextPath);
            }
        } else {
            response.sendRedirect(contextPath);
        }
    }

}
