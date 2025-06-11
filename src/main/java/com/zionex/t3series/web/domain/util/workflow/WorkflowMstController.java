package com.zionex.t3series.web.domain.util.workflow;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.util.data.ResponseEntityUtil;
import com.zionex.t3series.web.util.data.ResponseEntityUtil.ResponseMessage;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class WorkflowMstController {

    private final WorkflowMstService workflowMstService;
    private final WorkflowDtlService workflowDtlService;
    private final UserService userService;
    
    @GetMapping("/workflow")
    public List<WorkflowMst> getWorkflowIds() {
        UserDetails userDetail = userService.getUserDetails();
        String username = (userDetail == null) ? "" : userDetail.getUsername();
        return workflowMstService.getWorkflowIds(username);
    }

    @PostMapping("/workflow/save")
    public ResponseEntity<ResponseMessage> saveWorkFlow(@RequestParam("workflow-name") String workflowNm, @RequestParam(value = "workflow-id", required = false) String workflowId, HttpServletRequest request) {
        workflowMstService.saveWorkflow(workflowId, workflowNm);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved workflow"));
    }

    @PostMapping("/workflow/delete")
    public ResponseEntity<ResponseMessage> deleteWorkFlow(@RequestParam("workflow-id") String workflowId, HttpServletRequest request) {
        workflowMstService.deleteWorkflow(workflowId);
        workflowDtlService.deleteAllWorkflowDetails(workflowId);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted workflow"));
    }

}
