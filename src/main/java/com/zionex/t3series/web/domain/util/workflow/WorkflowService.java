package com.zionex.t3series.web.domain.util.workflow;

import java.util.List;

import com.zionex.t3series.web.domain.admin.lang.LangPackService;
import com.zionex.t3series.web.util.data.ResponseEntityUtil;
import com.zionex.t3series.web.util.data.ResponseEntityUtil.ResponseMessage;

import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkflowService {

    private final WorkflowRepository workflowRepository;
    private final LangPackService langPackService;

    public List<Workflow> getWorkflows() {
        return workflowRepository.findByDelYn(false);
    }

    public Workflow getWorkflow(String id) {
        return workflowRepository.findByIdAndDelYn(id, false);
    }

    public ResponseEntity<ResponseMessage> saveWorkflow(Workflow workflow) {
        String resultMsg = langPackService.getLanguageValue("MSG_0001");

        // boolean existId = workflowRepository.existsByIdAndDelYn(workflow.getId(),
        // workflow.getDelYn());
        // if (existId) {
        // resultMsg =
        // langPackService.getLanguageValue("MP_VALIDATION_TYPE_DUPLICATE_ID");
        // } else {
        // workflowRepository.save(workflow);
        // }
        workflowRepository.save(workflow);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), resultMsg));
    }

}
