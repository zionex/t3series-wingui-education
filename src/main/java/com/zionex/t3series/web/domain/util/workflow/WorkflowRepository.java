package com.zionex.t3series.web.domain.util.workflow;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkflowRepository extends JpaRepository<Workflow, String> {

    Workflow findByIdAndDelYn(String id, Boolean delYn);

    boolean existsByIdAndDelYn(String id, Boolean delYn);

    List<Workflow> findByDelYn(Boolean delYn);

}
