package com.zionex.t3series.web.domain.admin.theme;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ThemeMasterService {

    private final ThemeMasterRepository themeMasterRepository;
    private final ThemeDetailService themeDetailService;

    public List<ThemeMaster> getThemeMasters() {
        return themeMasterRepository.findByUseYnAndThemeCdNot(true, "COMMON");
    }

    public void saveThemeMaster(ThemeMaster themeMaster) {
        themeMasterRepository.save(themeMaster);
    }

    @Transactional
    public void saveThemeMaster(String themeCd, String copyThemCd) {
        ThemeMaster themeMaster = new ThemeMaster(themeCd);
        themeMasterRepository.save(themeMaster);

        if (copyThemCd == null) {
            return;
        }
        themeDetailService.copyThemeDetails(themeCd, copyThemCd);
    }

}
