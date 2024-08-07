package com.zionex.t3series.web.domain.admin.log;

import java.time.LocalDateTime;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SystemAccessService {

    private final SystemAccessRepository systemAccessRepository;
    private final SystemAccessQueryRepository systemAccessQueryRepository;

    public Page<SystemAccess> getSystemAccessLog(String displayName, LocalDateTime accessDttmFrom, LocalDateTime accessDttmTo, int page, int size) {
        return systemAccessQueryRepository.getSystemAccessLog(displayName, accessDttmFrom, accessDttmTo, PageRequest.of(page, size));
    }

    public void saveSystemAccessLog(SystemAccess systemAccessLog) {
        systemAccessRepository.save(systemAccessLog);
    }

    public SystemAccess getSystemAccessLogById(String id) {
        return systemAccessRepository.findById(id).orElse(null);
    }

    public SystemAccess getLatestSystemAccessLog(String userId) {
        return systemAccessQueryRepository.getLatestSystemAccessLog(userId);
    }

    public void logSystemLogout(String sessionId) {
        SystemAccess systemAccess = getSystemAccessLogById(sessionId);
        if (systemAccess != null) {
            systemAccess.setLogoutDttm(LocalDateTime.now());
            saveSystemAccessLog(systemAccess);
        }
    }

    public void addSystemAccessLog(SystemAccess systemAccessLog, HttpServletRequest request) {
        systemAccessLog.setAccessIp(getAccessIP(request));
        systemAccessLog.setAccessDttm(LocalDateTime.now());

        saveSystemAccessLog(systemAccessLog);
    }

    private String getAccessIP(HttpServletRequest request) {
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

}
