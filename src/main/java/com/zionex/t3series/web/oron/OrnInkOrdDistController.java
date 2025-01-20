package com.zionex.t3series.web.oron;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.ParameterMode;
import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.domain.common.CommonService;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.util.interceptor.ExecPermission;
import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class OrnInkOrdDistController {

    private final CommonService commonService;
    private final QueryHandler queryHandler;

    @ExecPermission(menuCd = "UI_PK_ORN_PACK_INK_ORD_DIST", type = ServiceConstants.PERMISSION_TYPE_READ)
    @PostMapping("/pk/ordermgmt/inkorddist/q1")
    public List<Map<String, Object>> getData1(@RequestBody Map<String, Object> params, HttpServletRequest request)
            throws Exception {
        return commonService.getData("SP_UI_PK_ORN_INK_ORD_DIST_Q1", params);
    }

    @ExecPermission(menuCd = "UI_PK_ORN_PACK_INK_ORD_DIST", type = ServiceConstants.PERMISSION_TYPE_READ)
    @PostMapping("/pk/ordermgmt/inkorddistcombo/lookup")
    public List<Map<String, Object>> getGridComboData(@RequestBody Map<String, Object> params,
            HttpServletRequest request) throws Exception {
        return commonService.getData("SP_UI_PK_ORN_GRID_COMBO_Q", params);
    }

    @ExecPermission(menuCd = "UI_PK_ORN_PACK_INK_ORD_DIST", type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("/pk/ordermgmt/inkorddist/s1")
    public Map<String, Object> saveData1(@RequestBody List<Map<String, Object>> changes, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();

        for (Map<String, Object> params : changes) {
            Map<String, Object> param = new HashMap<>();
            param.put("P_PLANT_CD", new Object[] { params.get("PLANT_CD"), String.class, ParameterMode.IN });
            param.put("P_MAT_CD", new Object[] { params.get("INK_CD"), String.class, ParameterMode.IN });
            param.put("P_VENDOR_CD", new Object[] { params.get("VENDOR_CD"), String.class, ParameterMode.IN });
            param.put("P_DLV_REQ_DT", new Object[] { params.get("GR_REQ_DT"), String.class, ParameterMode.IN });
            param.put("P_DLV_REQ_TIME", new Object[] { params.get("GR_REQ_TIME"), Integer.class, ParameterMode.IN });
            param.put("P_REQ_QTY", new Object[] { QueryHandler.getBigDecimal(params.get("PURC_QTY")), BigDecimal.class,
                    ParameterMode.IN });
            param.put("P_REQ_UOM_CD", new Object[] { params.get("REQ_UOM_CD"), String.class, ParameterMode.IN });
            param.put("P_USER_ID", new Object[] { params.get("USER_ID"), String.class, ParameterMode.IN });

            resultMap = commonService.saveData("SP_UI_PK_ORN_INK_ORD_DIST_S1", param);
        }
        return resultMap;
    }

    @ExecPermission(menuCd = "UI_PK_ORN_PACK_INK_ORD_DIST", type = ServiceConstants.PERMISSION_TYPE_READ)
    @PostMapping("/pk/ordermgmt/inkorddistpopup/q1")
    public List<Map<String, Object>> getPopupData1(@RequestBody Map<String, Object> params,
            HttpServletRequest request) throws Exception {
        return commonService.getData("SP_UI_PK_ORN_INK_ORD_DIST_POP_Q1", params);
    }

    @ExecPermission(menuCd = "UI_PK_ORN_PACK_INK_ORD_DIST", type = ServiceConstants.PERMISSION_TYPE_READ)
    @PostMapping("/pk/ordermgmt/inkorddistpopup/q2")
    public List<Map<String, Object>> getPopupData2(@RequestBody Map<String, Object> params,
            HttpServletRequest request) throws Exception {
        return commonService.getData("SP_UI_PK_ORN_INK_ORD_DIST_POP_Q2", params);
    }

    @ExecPermission(menuCd = "UI_PK_ORN_PACK_INK_ORD_DIST", type = ServiceConstants.PERMISSION_TYPE_READ)
    @PostMapping("/pk/ordermgmt/inkorddistpopup/q3")
    public List<Map<String, Object>> getPopupData3(@RequestBody Map<String, Object> params,
            HttpServletRequest request) throws Exception {
        return commonService.getData("SP_UI_PK_ORN_INK_ORD_DIST_POP_Q3", params);
    }
    
    @ExecPermission(menuCd = "UI_PK_ORN_PACK_INK_ORD_DIST", type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("/pk/ordermgmt/inkorddistpopup/s1")
    public Map<String, Object> saveData(@RequestBody List<Map<String, Object>> changes, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();

        for (Map<String, Object> params : changes) {
            Map<String, Object> param = new HashMap<>();
            param.put("P_DEL_YN", new Object[] { params.get("DEL_YN"), String.class, ParameterMode.IN });
            param.put("P_PLANT_CD", new Object[] { params.get("PLANT_CD"), String.class, ParameterMode.IN });
            param.put("P_PURC_DT", new Object[] { params.get("PURC_DT"), String.class, ParameterMode.IN });
            param.put("P_VENDOR_CD", new Object[] { params.get("VENDOR_CD"), String.class, ParameterMode.IN });
            param.put("P_PURC_SEQ", new Object[] { params.get("PURC_SEQ"), Integer.class, ParameterMode.IN });
            param.put("P_INK_CD", new Object[] { params.get("INK_CD"), String.class, ParameterMode.IN });
            param.put("P_GR_PLANT_CD", new Object[] { params.get("GR_PLANT_CD"), String.class, ParameterMode.IN });
            param.put("P_DLV_REQ_DT", new Object[] { params.get("DLV_REQ_DT"), String.class, ParameterMode.IN });
            param.put("P_DLV_REQ_TIME", new Object[] { params.get("DLV_REQ_TIME"), Integer.class, ParameterMode.IN });
            param.put("P_DLV_REQ_RMK", new Object[] { params.get("DLV_REQ_RMK"), String.class, ParameterMode.IN });
            param.put("P_USER_ID", new Object[] { params.get("USER_ID"), String.class, ParameterMode.IN });

            resultMap = commonService.saveData("SP_UI_PK_ORN_INK_ORD_DIST_POP_S1", param);
        }
        return resultMap;
    }

    @ExecPermission(menuCd = "UI_PK_ORN_PACK_INK_ORD_DIST", type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("/pk/ordermgmt/inkorddistpopup/send")
    public Map<String, Object> sendData1(@RequestBody List<Map<String, Object>> changes, HttpServletRequest request) 
            throws Exception {
        Map<String, Object> resultMap = new HashMap<>();

        for (Map<String, Object> params : changes) {
            Map<String, Object> param = new HashMap<>();
            param.put("P_PURC_DT", new Object[] { params.get("PURC_DT"), String.class, ParameterMode.IN });
            param.put("P_VENDOR_CD", new Object[] { params.get("VENDOR_CD"), String.class, ParameterMode.IN });
            param.put("P_PURC_SEQ", new Object[] { params.get("PURC_SEQ"), Integer.class, ParameterMode.IN });
            param.put("P_USER_ID", new Object[] { params.get("USER_ID"), String.class, ParameterMode.IN });
            param.put("P_IF_KEY", new Object[] { null, String.class, ParameterMode.OUT });

            //resultMap = commonService.saveData("SP_UI_PK_ORN_INK_ORD_DIST_SEND", param);
            List<Map<String, Object>> result = (List<Map<String, Object>>) queryHandler.getProcedureData("SP_UI_PK_ORN_INK_ORD_DIST_SEND", null, param);
            resultMap = result.get(0);
        }
        return resultMap;
    }
}
