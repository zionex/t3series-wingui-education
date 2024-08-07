package com.zionex.t3series.web.util.query;

import java.util.List;
import java.util.Map;

public class QueryLogEvent {
    String procName;
    Map<String, Object> inputParams;
    List<Map<String, Object>> procParams;

    public QueryLogEvent(String procName, Map<String, Object> inputParams, List<Map<String, Object>> procParams) {
        this.procName = procName;
        this.inputParams = inputParams;
        this.procParams = procParams;
    }

    public String getProcName() {
        return this.procName;
    }

    public Map<String, Object> getInputParams() {
        return this.inputParams;
    }

    public List<Map<String, Object>> getProcParams() {
        return this.procParams;
    }
}
