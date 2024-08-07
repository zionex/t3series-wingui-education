package com.zionex.t3series.web.domain.admin.log;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.domain.admin.user.User;
import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.security.jwt.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ViewExecutionController {

    private final String DATE_PATTERN = "yyyyMMdd";

    private final ViewExecutionService viewExecutionService;

    private final UserService userService;
    private final ApplicationEventPublisher publisher;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/system/logs/view-execution")
    public Page<ViewExecution> getViewExecutionLog(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam("startDate") @DateTimeFormat(pattern = DATE_PATTERN) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = DATE_PATTERN) LocalDate endDate,
            @RequestParam(value = "menuCd", required = false) String menuCd,
            @RequestParam(value = "menuNm", required = false) String menuNm,
            @RequestParam(value = "username", required = false) String username) {
        return viewExecutionService.getViewExecutionLog(size, page, startDate, endDate, menuCd, menuNm, username);
    }

    @PostMapping("/system/logs/view-execution")
    public void saveViewExecutionLog(@RequestParam("menuCd") String menuCd, @RequestParam("actionCd") String actionCd, HttpServletRequest request) {
        try {
            String sessionId = jwtTokenProvider.getTokenId(request);

            String username = userService.getUserDetails().getUsername();
            User user = userService.getUser(username);

            ViewExecution viewExecution = new ViewExecution();
            viewExecution.setId(sessionId);
            viewExecution.setUser(user);
            viewExecution.setViewCd(menuCd);
            viewExecution.setUserIp(getUserIp(request));
            viewExecution.setUserBrowser(getUserBrowser(request));
            viewExecution.setExecutionDttm(LocalDateTime.now());
            viewExecution.setModifyDttm(LocalDateTime.now());

            // 비동기 메시지 처리
            publisher.publishEvent(new ViewExecutionEvent(viewExecution));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String getUserIp(HttpServletRequest request) {
        String ip = request.getHeader("X-FORWARDED-FOR");
        if (StringUtils.isEmpty(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }

        if (StringUtils.isEmpty(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }

        if (StringUtils.isEmpty(ip)) {
            ip = request.getRemoteAddr();
        }

        return ip;
    }

    private String getUserBrowser(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        if (userAgent == null) {
            return "";
        }

        if (userAgent.contains("Trident")) {
            return "Internet Explorer";
        } else if (userAgent.contains("Chrome")) {
            return "Chrome";
        } else if (userAgent.contains("Opera")) {
            return "Opera";
        } else if (userAgent.contains("iPhone") && userAgent.contains("Mobile")) {
            return "iPhone";
        } else if (userAgent.contains("Android") && userAgent.contains("Mobile")) {
            return "Android";
        } else {
            return "Firefox";
        }
    }

}
