package com.zionex.t3series.web.domain.admin.theme;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ThemeDetailService {

    private final ThemeDetailReposotiry themeDetailReposotiry;
    private final ThemeDetailQueryRepository themeDetailQueryRepository;

    private static final String CATEGORY = "category";
    private static final String PALETTE = "palette";
    private static final String VARIABLE = "variable";
    private static final String COMMON = "COMMON";

    public List<ThemeDetail> getThemeDetails(String themeCd, String category, String propType) {
        return themeDetailQueryRepository.getThemeDetails(themeCd, category, propType);
    }

    public List<ThemeDetail> getThemeBasePallete(String themeCd) {
        return themeDetailReposotiry.findByThemeCdAndCategory(themeCd, PALETTE + "-base");
    }

    public List<ThemeDetail> getCategory() {
        return themeDetailQueryRepository.getCategory();
    }
    
    public List<ThemeDetail> getThemeCd() {
        return themeDetailQueryRepository.getThemeCd();
    }

    public Map<String, Object> getThemes(String themeCd) {
        List<ThemeDetail> themeDetails = themeDetailQueryRepository.getThemes(themeCd);

        Map<String, Object> themes = new HashMap<>();
        Map<String, Object> bycategory = new HashMap<>();

        List<String> categories = themeDetails.stream().map(detail -> detail.getCategory())
                .collect(Collectors.toList());
        Map<String, String> referValues = themeDetails
                .stream()
                .collect(Collectors.toMap(ThemeDetail::getReferCd, ThemeDetail::getPropValue));

        themeDetails.forEach(themeDetail -> {
            String propValue = themeDetail.getPropValue();
            if (propValue.startsWith("--")) {
                themeDetail.setPropValue(referValues.get(propValue));
            }
            ;
        });

        categories.forEach(category -> {
            bycategory.put(category, themeDetails
                    .stream()
                    .filter(detail -> detail.getCategory().equals(category))
                    .collect(Collectors.groupingBy(ThemeDetail::getPropType,
                            Collectors.toMap(ThemeDetail::getPropKey, ThemeDetail::getPropValue))));
        });

        themes.put(CATEGORY, bycategory);
        themes.put(VARIABLE, themeDetails
                .stream()
                // .filter(detail -> !detail.getCategory().equals(PALETTE))
                .collect(Collectors.toMap(ThemeDetail::getReferCd, ThemeDetail::getPropValue)));

        return themes;
    }

    public void saveThemeDetails(List<ThemeDetail> themeDetails) {
        themeDetails.forEach(detail -> {
            ThemeDetail existsTheme = themeDetailReposotiry.findByThemeCdAndReferCd(detail.getThemeCd(),detail.getReferCd());
            if (existsTheme != null) {
                detail.setId(existsTheme.getId());
                detail.setDefaultYn(existsTheme.getDefaultYn());
            } else {
                //REFER_CD컬럼 생성
                detail.setReferCd("--" + detail.getCategory() + "-" + detail.getPropType() + "-" + detail.getPropKey());
            }

            if (!detail.getCommonYn()) { // 공통언체크(COMMON delete/ System,Dark insert)
                themeDetailQueryRepository.deleteThemeDetails(COMMON, detail.getCategory(), detail.getPropType(), detail.getPropKey());// COMMON삭제
            } else { // 공통체크(COMMON insert/ System,Dark delete)
                themeDetailQueryRepository.deleteThemeDetails(null, detail.getCategory(), detail.getPropType(), detail.getPropKey());
            }
            
        });

        themeDetailReposotiry.saveAll(themeDetails);
    }

    public void copyThemeDetails(String themeCd, String copyThemCd) {
        List<ThemeDetail> themeDetails = getThemeDetails(copyThemCd, null, null);
        themeDetails
                .stream()
                .map(detail -> {
                    detail.setId(null);
                    detail.setThemeCd(themeCd);
                    detail.setDefaultYn(false);
                    return detail;
                }).collect(Collectors.toList());

        themeDetailReposotiry.saveAll(themeDetails);
    }

    public void deleteThemeDetails(String themeCd, String category, String propType, String propkey) {

        if(COMMON.equals(themeCd)) {
            themeDetailQueryRepository.deleteThemeDetails(COMMON, category, propType, propkey);
        } else {
            themeDetailQueryRepository.deleteThemeDetails(null, category, propType, propkey);
        }
    }
}
