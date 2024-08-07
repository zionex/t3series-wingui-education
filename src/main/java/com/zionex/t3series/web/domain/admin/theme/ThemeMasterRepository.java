package com.zionex.t3series.web.domain.admin.theme;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface ThemeMasterRepository extends JpaRepository<ThemeMaster, String> {

    List<ThemeMaster> findByUseYnTrue();

    List<ThemeMaster> findByUseYnAndThemeCdNot(Boolean useYn, String ThemeCd);

}
