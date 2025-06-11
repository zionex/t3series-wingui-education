package com.zionex.t3series.web.domain.snop.dashboardfact;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.util.data.ResponseEntityUtil;
import com.zionex.t3series.web.util.data.ResponseEntityUtil.ResponseMessage;
import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class FactController {

    private final FactService factservice;
    private final QueryHandler queryHandler;

    @GetMapping("/snop/dashboardfact/fact")
    public Map<String, Object> getFactList(@RequestParam(value = "aggrId", required = false) String viewId,
    @RequestParam(value = "whereStr", required = false, defaultValue = "") String whereStr) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        result.put("columns", factservice.getFactColumns(viewId));
        result.put("data", factservice.getFactData(viewId, whereStr));

        return result;
    }

    @GetMapping("/dashboardfact/getAggrSqlList")
    public Map<String, Object> getAggrSqlList(@RequestParam(value = "aggrId", required = false) String aggrId
        , @RequestParam(value = "procNm", required = false) String procNm) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        result.put("columns", factservice.getFactColumns(aggrId));
        result.put("data", queryHandler.getList(procNm,null));

        return result;
    }

    @GetMapping("/dashboardfact/aggrmstlist")
    public List<AggrMst> getAggMstList(@RequestParam(value = "aggrId", required = false, defaultValue = "") String aggrId,
        @RequestParam(value = "aggrName", required = false, defaultValue = "") String aggrName,
        @RequestParam(value = "id", required = false, defaultValue = "") String id) throws Exception {
        return factservice.getAggMstList(aggrId, aggrName, id);
    }

    @GetMapping("/dashboardfact/aggrfilddesc")
    public List<FactFieldDesc> getAggFieldDesc(@RequestParam(value = "aggrId", required = false) String aggrId) throws Exception {
        return factservice.getFactColumns(aggrId);
    }

    @PostMapping("/dashboardfact/loadProc")
    public List<Map<String, Object>> getColumnDef(@RequestParam(value = "procNm", required = false) String procNm) throws Exception {
        return factservice.getColumnDef(procNm);
    }

    @PostMapping("/dashboardfact/saveAggrMst")
    public ResponseEntity<ResponseMessage> saveAggrMst(@RequestBody AggrMst aggrMst) {
        factservice.saveAggrMst(aggrMst);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved AggrMst"));
    }

    @PostMapping("/dashboardfact/deleteAggrMst")
    public ResponseEntity<ResponseMessage> deleteAggrMst(@RequestBody List<AggrMst> aggrMst) {
        factservice.deleteAggrMst(aggrMst);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted AggrMst"));
    }

    @PostMapping("/dashboardfact/saveFieldDesc")
    public ResponseEntity<ResponseMessage> saveFieldDesc(@RequestBody List<FactFieldDesc> factFieldDesc) {
        factservice.saveFieldDesc(factFieldDesc);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved FactFieldDesc"));
    }

    @PostMapping("/dashboardfact/deleteFieldDesc")
    public ResponseEntity<ResponseMessage> deleteFieldDesc(@RequestBody List<FactFieldDesc> factFieldDesc) {
        factservice.deleteFieldDesc(factFieldDesc);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted FactFieldDesc"));
    }
}
