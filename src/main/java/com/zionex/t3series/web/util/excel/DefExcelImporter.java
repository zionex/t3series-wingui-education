package com.zionex.t3series.web.util.excel;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

import lombok.extern.java.Log;

/**
 * 대용량 엑셀 import 시 아래 클래스를 template 으로 만들것.
 */
@Log
@Component
public class DefExcelImporter implements ExcelImporter {

    @Override
    public Map<String, Object> handle(HttpServletRequest request, List<Map<String, Object>> resultData) {
        Map<String, Object> res = new HashMap<String, Object>();

        for (int i = 0; i < resultData.size(); i++) {
            Map<String, Object> row = resultData.get(i);
            for (String key : row.keySet()) {
                log.info(String.format("%s=%s,", key, row.get(key)));
            }
            log.info("" + i);
        }
        res.put("result", true);
        res.put("cnt", resultData.size());
        res.put("msg", "Success");

        return res;
    }

}
