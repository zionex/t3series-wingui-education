package com.zionex.t3series.web.domain.common;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.ParameterMode;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.IOUtils;
import org.json.simple.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.ApplicationProperties;
import com.zionex.t3series.web.constant.ApplicationConstants;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.util.interceptor.ExecPermission;
import com.zionex.t3series.web.util.interceptor.SessionAttributeManager;
import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class CommonController {

    private final CommonService commonService;
    private final QueryHandler queryHandler;

    private static final String PARAM_PROCEDURE = "PROCEDURE_NAME";

    private final ApplicationProperties applicationProperties;

    @PostMapping("/common/data")
    public List<Map<String, Object>> getData(@RequestBody Map<String, Object> allParameters, HttpServletResponse response) throws Exception {
        String procedureName = (String) allParameters.get(PARAM_PROCEDURE);
        Map<String, Object> procParam = new HashMap<>();

        for (String key : allParameters.keySet()) {
            if (key.equals(PARAM_PROCEDURE)) {
                continue;
            }
            procParam.put(key, allParameters.get(key));
        }

        return commonService.getData(procedureName, procParam);
    }

    @SuppressWarnings("unchecked")
    @ExecPermission(type = "UPDATE")
    @PostMapping("/common/json-save")
    public void saveJsonParams(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Map<String, Object> params = new HashMap<>();
        String procedure = request.getParameter("procedure");

        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()) {
            String key = parameterNames.nextElement();
            if (key.toUpperCase().startsWith("P_")) {
                params.put(key, new Object[] { request.getParameter(key), String.class, ParameterMode.IN });
            } else if (key.equals(ServiceConstants.PARAMETER_KEY_DATA)) {
                params.put("P_JSON", new Object[] { request.getParameter(key), String.class, ParameterMode.IN });
            }
        }

        log.info("json save request: procedure = {}, parameterNames = {}", procedure, parameterNames);

        params.put("P_RT_ROLLBACK_FLAG", new Object[] { null, String.class, ParameterMode.OUT });
        params.put("P_RT_MSG", new Object[] { null, String.class, ParameterMode.OUT });
        List<Map<String, Object>> result = (List<Map<String, Object>>) queryHandler.getProcedureData(procedure, null, params);

        boolean resultFlag = false;
        String message = "MSG_0004";
        if (!result.isEmpty()) {
            Map<String, Object> resultMap = result.get(0);
            if (resultMap != null) {
                String rollbackFlag = (String) resultMap.get("P_RT_ROLLBACK_FLAG");
                message = (String) resultMap.get("P_RT_MSG");

                if (rollbackFlag == null || rollbackFlag.equals("false")) {
                    resultFlag = false;
                }
            }
        }

        // Make Resonse Result - IMTC1 - WING-UI 1.0
        Map<String, Object> mapResult = new HashMap<String, Object>();
        Map<String, Object> mapData = new HashMap<String, Object>();

        mapData.put(procedure + "_P_RT_MSG", message);
        mapResult.put(ServiceConstants.RESULT_KEY_IM_DATA, mapData);
        mapResult.put(ServiceConstants.RESULT_KEY_ITC1_DATA, Collections.EMPTY_MAP);

        response.setContentType(ApplicationConstants.CONTENT_TYPE_JSON);
        JSONObject resultData = new JSONObject(mapResult);

        PrintWriter pw;
        try {
            pw = response.getWriter();
            pw.print(resultData);
            pw.flush();
            pw.close();
        } catch (IOException e) {
            log.error("Error occurred while sending response: {}", e.getMessage());
        }
    }

    @GetMapping(value = "externalimage/{date}/{imagename}", produces = { MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_GIF_VALUE })
    public ResponseEntity<byte[]> externalimage(@PathVariable("date") String date, @PathVariable("imagename") String imagename) throws IOException {
        final ApplicationProperties.Service.File fileProps = applicationProperties.getService().getFile();

        String externalPath = fileProps.getExternalPath();
        String imagePath = externalPath + fileProps.getName() + "/" + fileProps.getCategory().getTemporary();

        InputStream imageStream = new FileInputStream(imagePath + "/" + date + "/" + imagename);
        byte[] imageByteArray = IOUtils.toByteArray(imageStream);
        imageStream.close();
        return new ResponseEntity<byte[]>(imageByteArray, HttpStatus.OK);
    }

    @GetMapping("/util/setlang")
    public void setLang(HttpServletRequest request, HttpServletResponse response, HttpSession httpSession) throws Exception {
        String languageCode = (String) request.getParameter("languageCode");

        httpSession.setAttribute("languageCode", languageCode);
        SessionAttributeManager.setAttribute(request, "languageCode", languageCode);
    }

}
