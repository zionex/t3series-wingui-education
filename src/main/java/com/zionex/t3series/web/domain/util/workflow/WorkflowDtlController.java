package com.zionex.t3series.web.domain.util.workflow;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.util.ResponseEntityUtil;
import com.zionex.t3series.web.util.ResponseEntityUtil.ResponseMessage;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class WorkflowDtlController {

    private final WorkflowDtlService workflowDtlService;
    
    @GetMapping("/workflow/details")
    public List<WorkflowDtl> getWorkflowDetails(@RequestParam("workflow-id") String workflowId) {
        return workflowDtlService.getWorkflowDetails(workflowId);
    }

    @PostMapping("/workflow/detail/save")
    public ResponseEntity<ResponseMessage> saveWorkFlowDetails(@RequestBody List<WorkflowDtl> workflowDtls, HttpServletRequest request) {
        workflowDtlService.saveWorkflowDetails(workflowDtls);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved workflow detail(s)"));
    }

    @PostMapping("/workflow/details/delete")
    public ResponseEntity<ResponseMessage> deleteWorkFlowDetails(@RequestBody List<WorkflowDtl> workflowDtls, HttpServletRequest request) {
        workflowDtlService.deleteWorkflowDetails(workflowDtls);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted workflow detail(s)"));
    }

}
