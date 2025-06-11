package com.zionex.t3series.web.domain.util.workflow;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.util.data.ResponseEntityUtil.ResponseMessage;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class WorkflowController {

    private final WorkflowService workflowService;

    @GetMapping("/workflows")
    public List<Workflow> getWorkflows() {
        return workflowService.getWorkflows();
    }

    @GetMapping("/workflow/view")
    public Workflow getWorkflow(@RequestParam(value = "id", defaultValue = "") String params) {
        return workflowService.getWorkflow(params);
    }

    @PostMapping("/workflows")
    public ResponseEntity<ResponseMessage> saveWorkflow(@RequestBody Workflow workflow) {
        return workflowService.saveWorkflow(workflow);
    }

}
