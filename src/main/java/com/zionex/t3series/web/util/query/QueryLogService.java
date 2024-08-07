package com.zionex.t3series.web.util.query;

import java.util.List;
import java.util.Map;
// import java.util.concurrent.Future;
// import java.util.concurrent.TimeUnit;
// import java.util.concurrent.TimeoutException;
// import com.zionex.t3series.web.domain.common.AsyncService;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;

@Log
@Service
@RequiredArgsConstructor
public class QueryLogService {

    private final ApplicationEventPublisher publisher;
    // private final AsyncService asyncService;

    // public void traceQuery(String procName, Map<String, Object> inputParams, List<Map<String, Object>> procParams) {
    //     try {
    //         int timeout = 200;
    //         Future<Long> future = asyncService.runAsync(() -> this.logProcedure(procName, inputParams, procParams));
    //         future.get(timeout, TimeUnit.SECONDS);
    //     } catch (TimeoutException te) {
    //         log.info("createVersionAsync waiting timeout but we will keep going our way");
    //     } catch (Exception e) {
    //         e.printStackTrace();
    //     }
    // }

    public void traceQuery(String procName, Map<String, Object> inputParams, List<Map<String, Object>> procParams) {

        QueryLogEvent evt =new QueryLogEvent(procName, inputParams, procParams);
        publisher.publishEvent(evt);
    }

    public void logProcedure(String procName, Map<String, Object> inputParams, List<Map<String, Object>> procParams) {
        StringBuilder logBuilder = new StringBuilder();
        logBuilder.append(procName);
        logBuilder.append(" ");

        if (procParams != null) {
            for (Map<String, Object> paramInfo : procParams) {
                String orgParamName = paramInfo.get("COLUMN_NAME").toString();
                String paramName = orgParamName.replace("@", "");

                Object param = null;
                if (inputParams != null) {
                    param = inputParams.get(paramName);
                }

                if (param != null) {
                    logBuilder.append("'");
                    logBuilder.append(paramName).append("=").append(getValue(param));
                    logBuilder.append("'");
                    logBuilder.append(",");
                } else {
                    logBuilder.append("{NO PARAM VALUE}");
                    logBuilder.append(",");
                }
            }
        }
        log.info(logBuilder.substring(0, logBuilder.length() - 1));
    }

    public String getValue(Object param) {
        String value = "";
        if (param != null) {
            if (param.getClass().isArray()) {
                Object[] info = (Object[]) param;
                Object paramValue = info[0];
                if (paramValue != null)
                    value = paramValue.toString();
            } else {
                value = param.toString();
            }
        }

        return value;
    }

    @Async
    @EventListener
    public void handleLogEvent(QueryLogEvent evt) {
        logProcedure(evt.getProcName(),evt.getInputParams(),evt.getProcParams());
    }

}
