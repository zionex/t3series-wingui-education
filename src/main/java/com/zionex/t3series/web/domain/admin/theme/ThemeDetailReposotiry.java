package com.zionex.t3series.web.domain.admin.theme;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface ThemeDetailReposotiry extends JpaRepository<ThemeDetail, String> {

    List<ThemeDetail> findByThemeCd(String themeCd);

    List<ThemeDetail> findByThemeCdAndCategory(String themeCd, String category);

    ThemeDetail findByThemeCdAndReferCd(String themeCd, String referCd);

}
