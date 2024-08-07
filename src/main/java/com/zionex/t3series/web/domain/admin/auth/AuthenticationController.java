package com.zionex.t3series.web.domain.admin.auth;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.domain.admin.account.PasswordPolicy;
import com.zionex.t3series.web.security.authentication.AuthenticationInfo;
import com.zionex.t3series.web.security.authentication.AuthenticationManager;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final PasswordPolicy passwordPolicy;

    @GetMapping("/auth-info")
    public AuthenticationInfo getAuthenticationInfo(HttpServletRequest request) {
        return authenticationManager.getAuthenticationInfo();
    }

    @GetMapping("/password-rule")
    public String getPasswordRule() {
        return passwordPolicy.getPasswordRules();
    }

}
