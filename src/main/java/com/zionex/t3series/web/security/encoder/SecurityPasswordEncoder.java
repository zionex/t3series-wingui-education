package com.zionex.t3series.web.security.encoder;

import com.zionex.t3series.util.SecurityUtils;

import org.springframework.security.crypto.password.PasswordEncoder;

public class SecurityPasswordEncoder implements PasswordEncoder {

    @Override
    public String encode(CharSequence rawPassword) {
        return rawPassword.toString();
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return SecurityUtils.checkPassword(rawPassword.toString(), encodedPassword);
    }

}
