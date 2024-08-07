package com.zionex.t3series.web.domain.util.workflow;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface WorkflowMstRepository extends JpaRepository<WorkflowMst, String> {

    @Transactional
    void deleteById(String id);

}
