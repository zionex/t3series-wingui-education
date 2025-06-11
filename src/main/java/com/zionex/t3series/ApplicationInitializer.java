package com.zionex.t3series;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.zionex.t3series.ApplicationProperties.Authentication;
import com.zionex.t3series.ApplicationProperties.Authentication.Account;
import com.zionex.t3series.web.domain.admin.account.AccountManager;
import com.zionex.t3series.web.domain.admin.account.PasswordPolicy;
import com.zionex.t3series.web.domain.admin.lang.LangPackService;
import com.zionex.t3series.web.security.authentication.LoginPolicy;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ApplicationInitializer implements ApplicationRunner {

    private final ApplicationProperties applicationProperties;
    private final AccountManager accountManager;

    private final PasswordPolicy passwordPolicy;
    private final LoginPolicy loginPolicy;

    private final LangPackService langPackService;

    @Override
    public void run(ApplicationArguments args) {
        makePlatformConfiguration();
        accountManager.init(applicationProperties.getAuthentication());
    }

    public void makePlatformConfiguration() {
        List<String> languages = applicationProperties.getLanguages();
        if (languages != null) {
            for (String language : languages) {
                langPackService.getCachedLangPacks(language);
            }
        }

        Authentication authentication = applicationProperties.getAuthentication();
        if (authentication != null) {
            Authentication.PasswordPolicy password = authentication.getPasswordPolicy();
            if (password != null) {
                passwordPolicy.setPolicy(password);
            }

            Authentication.LoginPolicy login = authentication.getLoginPolicy();
            if (login != null) {
                loginPolicy.setPolicy(login);
            }

            Account account = authentication.getAccount();
            if (account != null) {
                account.getSystemAdmins().forEach(sa -> accountManager.addSystemAdmin(sa));
            }
        }

        String timezoneOffset = ZonedDateTime.now(ZoneId.systemDefault()).getOffset().getId();
        applicationProperties.setOffset("UTC" + (timezoneOffset.equals("Z") ? "+00:00" : timezoneOffset));
    }

}
