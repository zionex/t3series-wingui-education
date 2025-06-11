package com.zionex.t3series.web.domain.snop.flxreport;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

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
public class FlxReportController {

    private final FlxReportService flxReportservice;
    private final QueryHandler queryHandler;
    
    @GetMapping("/flxreport/flxreport")
    public List<FlxReportMst> getFlxReportList(@RequestParam(value = "aggrId") String aggrId, @RequestParam(value = "reportName") String reportName,
     @RequestParam(value = "type") String type, @RequestParam(value = "useYn", required = false, defaultValue = "") String useYn) throws Exception {
        return flxReportservice.getFlxReportList(aggrId, reportName, type, useYn);
    }

    @GetMapping("/flxreport/conditionItems")
    public List<Map<String, Object>> getConditionItems(@RequestParam(value = "query") String query) throws Exception {
        return flxReportservice.getConditionItems(query);
    }

    @GetMapping("/flxreport/flxReportConditionSql")
    public List<Map<String, Object>> flxReportConditionSql(@RequestBody Map<String, Object> params, @RequestParam(value = "procNm") String procNm, HttpServletRequest request) throws Exception {
        return queryHandler.getList(procNm, params);
    }

   @PostMapping("/flxreport/saveflxreport")
    public ResponseEntity<ResponseMessage> saveFlxReport(@RequestBody FlxReportMst flxReportMst) {
        flxReportservice.saveFlxReportMst(flxReportMst);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved FlxReportMst"));
    }

    @PostMapping("/flxreport/deleteflxreport")
    public ResponseEntity<ResponseMessage> deleteFlxReport(@RequestBody List<FlxReportMst> flxReportMst) {
        flxReportservice.deleteFlxReport(flxReportMst);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted FlxReportMst"));
    }
}
