package com.zionex.t3series.web.domain.admin.menu.badge;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface BadgeRepository extends JpaRepository<Badge, String> {

    List<Badge> findByExpiredDttmAfter(LocalDateTime expiredDttm);

    @Transactional
    void deleteByMenuIdIn(List<String> menuIds);

}
