
package com.zionex.t3series.web.util.data;

import static com.zionex.t3series.web.constant.ApplicationConstants.CONTENT_TYPE_JSON;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.text.StringEscapeUtils;
import org.json.simple.JSONObject;

import com.zionex.t3series.web.constant.ServiceConstants;

import lombok.extern.java.Log;

@Log
public class ResponseData {

    protected void responseError(HttpServletResponse response, String message) {
        responseError(response, message, "");
    }

    protected void responseError(HttpServletResponse response, String message, String code) {
        responseResult(response, responseErrorData(message, code));
    }

    protected void responseResult(HttpServletResponse response, Object result) {
        try {
            response.setContentType(CONTENT_TYPE_JSON);
            PrintWriter pw = response.getWriter();
            pw.print(result);
            pw.flush();
            pw.close();
        } catch (IOException e) {
            log.warning("response result fails : " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    protected JSONObject responseErrorData(String message, String code) {
        JSONObject resultData = new JSONObject();
        resultData.put(ServiceConstants.PARAMETER_KEY_RESULT_CODE, code);
        resultData.put(ServiceConstants.PARAMETER_KEY_RESULT_SUCCESS, Boolean.FALSE);
        message = ( message == null ) ? "The service has failed." : message;
        resultData.put(ServiceConstants.PARAMETER_KEY_RESULT_MESSAGE, StringEscapeUtils.escapeHtml4(message));
        resultData.put(ServiceConstants.PARAMETER_KEY_RESULT_TYPE, ServiceConstants.RESULT_TYPE_I);
        return resultData;
    }

}
