package com.zionex.t3series.web.domain.util.workflow;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface WorkflowDtlRepository extends JpaRepository<WorkflowDtl, String> {

    List<WorkflowDtl> findByWorkflowIdOrderByWorkSeq(String WorkflowId);

    @Transactional
    void deleteByWorkflowId(String workflowId);

}
