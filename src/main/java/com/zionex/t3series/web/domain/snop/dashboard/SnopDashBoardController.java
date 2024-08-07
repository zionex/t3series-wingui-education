package com.zionex.t3series.web.domain.snop.dashboard;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SnopDashBoardController {

    private final QueryHandler queryHandler;

    @GetMapping("/dashboard/data")
    public Map<String, Object> getData(@RequestParam("viewId") String viewId) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        Map<String, Object> param = new HashMap<>();
        param.put("P_VIEW_ID", viewId);

        result.put("columns", queryHandler.getList("SP_SA_DASHBOARD_FIELD_Q", param));
        result.put("data", queryHandler.getList("SP_SA_DASHBOARD_STD_Q", param));

        return result;
    }

}
