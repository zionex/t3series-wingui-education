package com.zionex.t3series.web.domain.util.dashboard;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface DashboardRepository extends JpaRepository<Dashboard, String> {

    Optional<Dashboard> findById(String id);

    List<Dashboard> findByMenuCd(String menuCd);

    @Transactional
    void deleteById(String id);

}
