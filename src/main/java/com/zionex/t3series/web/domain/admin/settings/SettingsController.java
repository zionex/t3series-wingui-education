package com.zionex.t3series.web.domain.admin.settings;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.zionex.t3series.ApplicationProperties;
import com.zionex.t3series.web.domain.admin.lang.LangPackService;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SettingsController {

    private final ApplicationProperties applicationProperties;
    private final LangPackService langPackService;

    @GetMapping(value = {"/system/settings", "/system/settings/{config}"})
    public SettingsData getSettings(@PathVariable(value = "config", required = false) String config) {
        if (StringUtils.equals(config, "languages")) {
            return SettingsData.builder()
                    .languages(applicationProperties.getLanguages())
                    .build();
        }

        Map<String, String> authentication = new HashMap<>();
        authentication.put("loginUrl", applicationProperties.getAuthentication().getLoginUrl());
        authentication.put("defaultUrl", applicationProperties.getAuthentication().getDefaultUrl());

        return SettingsData.builder()
                .langpackVersion(langPackService.getLangPackVersion())
                .languages(applicationProperties.getLanguages())
                .authentication(authentication)
                .corporation(applicationProperties.getCorporation())
                .offset(applicationProperties.getOffset())
                .build();
    }

}

@Data
@Builder
@JsonInclude(Include.NON_NULL)
class SettingsData {

    private String langpackVersion;
    private List<String> languages;
    private Map<String, String> authentication;
    private String corporation;
    private String offset;

}
