package com.zionex.t3series.web.domain.common;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommonService {

    private final QueryHandler queryHandler;

    public List<Map<String, Object>> getData(String procedureName, Map<String, Object> inputParams) throws Exception {
        return queryHandler.getList(procedureName, inputParams);
    }

    public Map<String, Object> saveData(String procedureName, Map<String, Object> inputParams) {
        Map<String, Object> result = new HashMap<>();
        try {
            result = queryHandler.save(procedureName, inputParams);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Failed : " + getCauseMessage(e));
        }
        return result;
    }

    private String getCauseMessage(Throwable exception) {
        Throwable cause = exception;
        while (cause.getCause() != null) {
            cause = cause.getCause();
        }

        return cause.getMessage();
    }

}
