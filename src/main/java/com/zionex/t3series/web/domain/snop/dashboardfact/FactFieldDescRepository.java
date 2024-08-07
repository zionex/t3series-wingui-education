package com.zionex.t3series.web.domain.snop.dashboardfact;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface FactFieldDescRepository extends JpaRepository<FactFieldDesc, String> {

   @Transactional
    void deleteByAggrId(String aggrId);

}