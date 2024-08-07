package com.zionex.t3series.web.domain.admin.theme;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.util.ResponseEntityUtil;
import com.zionex.t3series.web.util.ResponseEntityUtil.ResponseMessage;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ThemeController {

    private final ThemeMasterService themeMasterService;
    private final ThemeDetailService themeDetailService;

    private static final String THEME_CD = "theme-cd";

    @GetMapping("/themes/{theme-cd}")
    public Map<String, Object> getThemes(@PathVariable(THEME_CD) String themeCd) {
        return themeDetailService.getThemes(themeCd);
    }
    
    @GetMapping("/system/themes")
    public List<ThemeMaster> getThemeMasters() {
        return themeMasterService.getThemeMasters();
    }
    
    @GetMapping("/system/themes/{theme-cd}")
    public List<ThemeDetail> getThemeDetails(@PathVariable(THEME_CD) String themeCd, @RequestParam(value = "category", required = false) String category, @RequestParam(value = "prop-type", required = false) String propType) {
        return themeDetailService.getThemeDetails(themeCd, category, propType);
    }
    
    @GetMapping("/system/themes/{theme-cd}/base")
    public List<ThemeDetail> getThemeBasePallete(@PathVariable(THEME_CD) String themeCd) {
        return themeDetailService.getThemeBasePallete(themeCd);
    }
    @PostMapping("/themes/category")
    public List<ThemeDetail> getCategory() {
        return themeDetailService.getCategory();
    }
    @PostMapping("/themes/themeCd")
    public List<ThemeDetail> getThemeCd() {
        return themeDetailService.getThemeCd();
    }

    @PostMapping("/system/themes")
    public ResponseEntity<ResponseMessage> saveThemeMaster(@RequestParam(THEME_CD) String themeCd, @RequestParam(value = "copy-theme-cd", required = false) String copyThemeCd) {
        themeMasterService.saveThemeMaster(themeCd, copyThemeCd);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved Theme master"));
    }
    
    @PostMapping("/system/themes/{theme-cd}")
    public ResponseEntity<ResponseMessage> saveThemeDetails(@RequestBody List<ThemeDetail> themeDetails) {
        themeDetailService.saveThemeDetails(themeDetails);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved Theme details"));
    }

    @PostMapping("/system/themes/delete")
    public ResponseEntity<ResponseMessage> deleteThemeDetail(@RequestBody List<ThemeDetail> themeDetails) {
        themeDetails.forEach(detail -> {
            themeDetailService.deleteThemeDetails(detail.getThemeCd(), detail.getCategory(), detail.getPropType(), detail.getPropKey());
        });
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted Theme details"));
    }

}
