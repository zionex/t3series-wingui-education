package com.zionex.t3series.web.security.authentication;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.zionex.t3series.ApplicationProperties.Authentication;
import com.zionex.t3series.web.domain.admin.user.User;

@Component
public final class LoginPolicy {

    private Authentication.LoginPolicy policy;

    public void setPolicy(Authentication.LoginPolicy policy) {
        this.policy = policy;
    }

    public boolean checkFailureCount(User user) {
        if (policy == null) {
            return true;
        }

        Integer failureCount = user.getLoginFailCount();
        if (failureCount == null) {
            failureCount = 0;
        }

        int maxFailureCount = policy.getMaxFailureCount();
        return maxFailureCount > 0 && failureCount < maxFailureCount;
    }

    public boolean isViolateLongTermUnvisitedDays(LocalDateTime latestAccessDttm) {
        int longTermUnvisitedDays = policy.getLongTermUnvisitedDays();
        if (longTermUnvisitedDays <= 0) {
            return false;
        }

        return isExceedDays(latestAccessDttm, longTermUnvisitedDays);
    }

    public boolean isViolateMaxPasswordDays(LocalDateTime passwordModifyDttm) {
        int maxPasswordDays = policy.getMaxPasswordDays();
        if (maxPasswordDays <= 0) {
            return false;
        }

        return isExceedDays(passwordModifyDttm, maxPasswordDays);
    }

    public boolean isExceedDays(LocalDateTime date, int maxDays) {
        LocalDateTime now = LocalDateTime.now();

        Duration duration = Duration.between(date, now);
        return maxDays <= duration.toDays();
    }

}
