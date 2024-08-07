package com.zionex.t3series.web.domain.util.workflow;

import java.util.List;

import com.zionex.t3series.web.domain.admin.user.UserService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkflowMstService {

    private final WorkflowMstQueryRepository workflowMstQueryRepository;
    private final WorkflowMstRepository workflowMstRepository;
    private final UserService userService;

    public List<WorkflowMst> getWorkflowIds(String username) {
        boolean isAdmin = userService.checkAdmin(username);
        return workflowMstQueryRepository.getWorkflowMsts(username, isAdmin);
    }

    public void saveWorkflow(String workflowId, String workflowNm) {
        WorkflowMst workflowMst = new WorkflowMst(workflowNm);
        if(workflowId != null) {
            workflowMst.setId(workflowId);
        }
        workflowMstRepository.save(workflowMst);
    }

    @Transactional
    public void deleteWorkflow(String id) {
        workflowMstRepository.deleteById(id);
    }

}
