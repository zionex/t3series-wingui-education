package com.zionex.t3series.web.domain.snop.flxreport;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class FlxReportService {
    private final FlxReportQueryRepository flxreportqueryrepository;
    private final FlxReportMstRepository flxreportmstrepository;

    public List<FlxReportMst> getFlxReportList(String aggrId, String reportName, String type, String useYn) throws Exception {
        return flxreportqueryrepository.getFlxReportList(aggrId, reportName, type, useYn);
    }

    public List<Map<String, Object>> getConditionItems(String query) throws Exception {
        List<Map<String, Object>> resultList = new ArrayList<>();
        List<Object[]> itemList = flxreportqueryrepository.getConditionItems(query);
        itemList.forEach(data -> {
            Map<String, Object> object = new HashMap<>();
            object.put("CODE", data[0]);
            object.put("NAME", data[1]);

            resultList.add(object);
        });
        return resultList;
    }

    public void saveFlxReportMst(FlxReportMst flxReportMst) {
        flxreportmstrepository.save(flxReportMst);
    }

    public void deleteFlxReport(List<FlxReportMst> flxReportMst) {
        flxreportmstrepository.deleteAll(flxReportMst);
    }
}
