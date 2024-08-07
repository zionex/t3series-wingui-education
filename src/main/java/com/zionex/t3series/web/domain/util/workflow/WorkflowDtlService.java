package com.zionex.t3series.web.domain.util.workflow;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkflowDtlService {

    private final WorkflowDtlRepository workflowDtlRepository;

    public List<WorkflowDtl> getWorkflowDetails(String workflowId) {
        return workflowDtlRepository.findByWorkflowIdOrderByWorkSeq(workflowId);
    }

    public void saveWorkflowDetails(List<WorkflowDtl> workflowDtls) {
        for (int i = 0; i < workflowDtls.size(); i++) {
            WorkflowDtl workflowDtl = workflowDtls.get(i);
            workflowDtlRepository.save(workflowDtl);
        }
    }

    @Transactional
    public void deleteAllWorkflowDetails(String workflowId) {
        workflowDtlRepository.deleteByWorkflowId(workflowId);
    }

    public void deleteWorkflowDetails(List<WorkflowDtl> workflowDtls) {
        for (int i = 0; i < workflowDtls.size(); i++) {
            WorkflowDtl workflowDtl = workflowDtls.get(i);
            workflowDtlRepository.delete(workflowDtl);
        }
    }

}
