package com.zionex.t3series.web.oron;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.persistence.ParameterMode;
import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.domain.common.CommonService;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.util.crosstab.PivotUtil;
import com.zionex.t3series.web.util.interceptor.ExecPermission;
import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class OrnOtherPlanController {

    private final CommonService commonService;

    @ExecPermission(menuCd = "UI_PK_ORN_PACK_OTHER_PLAN", type = ServiceConstants.PERMISSION_TYPE_READ)
    @PostMapping("/pk/simulation/otherplan/q1")
    public Map<String, Object> getData6(@RequestBody Map<String, Object> params, HttpServletRequest request)
            throws Exception {

        List<Map<String, Object>> dataList = commonService.getData("SP_UI_PK_ORN_PACK_ORDER_MGMT_Q1", params);

        String headerColumn = "REQ_DT";
        String[] groupCds = { "ITEM_CD" };
        String[] dataColumns = { "ORD_QTY" };
        String[] measureNms = {};
        String[] additionalHeaderColumns = {};

        return PivotUtil.pivotData(dataList, headerColumn, groupCds, dataColumns, measureNms, additionalHeaderColumns);
    }

    @ExecPermission(menuCd = "UI_PK_ORN_PACK_OTHER_PLAN", type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("/pk/simulation/otherplan/r1")
    public Map<String, Object> reflectData1(@RequestBody List<Map<String, Object>> changes, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();

        for (Map<String, Object> params : changes) {
            Map<String, Object> param = new HashMap<>();
            param.put("P_PLANT_CD", new Object[] { params.get("P_PLANT_CD"), String.class, ParameterMode.IN });
            param.put("P_ITEM_CD", new Object[] { params.get("P_ITEM_CD"), String.class, ParameterMode.IN });
            param.put("P_ORD_WK", new Object[] { params.get("P_ORD_WK"), String.class, ParameterMode.IN });
            param.put("P_ORD_SEQ", new Object[] { params.get("P_ORD_SEQ"), String.class, ParameterMode.IN });
            param.put("P_REQ_DT", new Object[] { params.get("P_REQ_DT"), String.class, ParameterMode.IN });
            param.put("P_ORD_QTY", new Object[] { QueryHandler.getBigDecimal(params.get("P_ORD_QTY")), BigDecimal.class, ParameterMode.IN });
            param.put("P_DESCRIP", new Object[] { params.get("P_DESCRIP"), String.class, ParameterMode.IN });
            param.put("P_USER_ID", new Object[] { params.get("P_USER_ID"), String.class, ParameterMode.IN });

            resultMap = commonService.saveData("SP_PK_ORN_DELIVY_PLAN_APLY", param);
        }
        return resultMap;
    }

}
