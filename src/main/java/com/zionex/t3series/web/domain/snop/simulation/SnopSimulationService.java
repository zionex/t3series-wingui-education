package com.zionex.t3series.web.domain.snop.simulation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.domain.snop.common.SnopCommonService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SnopSimulationService {

    private final SnopSimulationRepository simulationRepository;

    private final SnopCommonService snopCommonService;
    private final UserService userService;

    public Map<String, Object> getSimulationVersion(String parentId, String id) throws Exception {
        Map<String, Object> resultMap = new HashMap<String, Object>();

        List<Map<String, Object>> list = simulationRepository.getSimulationVersion();

        Optional<Map<String, Object>> isShow = list.stream().filter((d)-> "Y".equals(((String)d.get("IS_SHOW")))).findFirst();
        List<Map<String, Object>> hierarch = snopCommonService.flatListToHierarch(list, id, parentId);
        
        resultMap.put("isShow", isShow.isPresent() ? isShow.get() : null);
        resultMap.put("items", hierarch);

        return resultMap;
    }

    public Object createVersion(Map<String, Object> params) throws Exception {
        String username = userService.getUserDetails().getUsername();

        params.remove("menu-cd");
        params.put("P_USER_ID", username);

        return simulationRepository.createVersion(params);
    }

}
