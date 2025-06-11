package com.zionex.t3series.web.domain.snop.simulation;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.ParameterMode;

import org.springframework.stereotype.Repository;

import com.zionex.t3series.web.domain.common.CommonService;
import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SnopSimulationRepository {

    private final QueryHandler queryHandler;
    private final CommonService commonService;

    public List<Map<String, Object>> getSimulationVersion() throws Exception {
        return queryHandler.getList("SP_SA_VER_Q1", Collections.emptyMap());
    }

    public Object createVersion(Map<String, Object> params) throws Exception {
        Map<String, Object> inputParams = new HashMap<String, Object>();

        params.entrySet().stream().forEach((set)-> {
            inputParams.put(set.getKey(), new Object[] { params.get(set.getKey()), String.class, ParameterMode.IN });
        });

        Map<String, Object> ret = new HashMap<String, Object>();
        ret = commonService.saveData("SP_SA_VER_CREATE", inputParams);

        return ret;
    }

}
