package com.zionex.t3series.web.domain.admin.menu.manual;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface ManualRepository extends JpaRepository<Manual, String> {

    List<Manual> findByUseYnTrue();

    @Transactional
    void deleteByMenuCdIn(List<String> menuCds);

}
