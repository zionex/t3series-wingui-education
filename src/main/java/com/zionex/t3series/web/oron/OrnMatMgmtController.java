package com.zionex.t3series.web.oron;

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

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class OrnMatMgmtController {

    private final CommonService commonService;

    @ExecPermission(menuCd = "UI_PK_ORN_MAT_MGMT", type = ServiceConstants.PERMISSION_TYPE_READ)
    @PostMapping("/pk/master/matmgmt/q1")
    public List<Map<String, Object>> getData1(@RequestBody Map<String, Object> params, HttpServletRequest request) throws Exception {
        return commonService.getData("SP_UI_PK_ORN_MAT_MST_Q1", params);
    }


    @ExecPermission(menuCd = "UI_PK_ORN_MAT_MGMT", type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("/pk/master/matmgmt/s1")
    public Map<String, Object> saveData1(@RequestBody List<Map<String, Object>> changes, HttpServletRequest request) {
        Map<String, Object> resultMap = new HashMap<>();

        for(Map<String, Object> params : changes){
            Map<String, Object> param = new HashMap<>();
            param.put("P_PLANT_CD", new Object[] { params.get("PLANT_CD"), String.class, ParameterMode.IN });
            param.put("P_MAT_CD", new Object[] { params.get("MAT_CD"), String.class, ParameterMode.IN });
            param.put("P_PURC_YN", new Object[] { params.get("PURC_YN"), String.class, ParameterMode.IN });
            param.put("P_USER_ID", new Object[] { params.get("USER_ID"), String.class, ParameterMode.IN });

            resultMap = commonService.saveData("SP_UI_PK_ORN_MAT_MST_S1", param);
        }
        return resultMap;
    }
}
