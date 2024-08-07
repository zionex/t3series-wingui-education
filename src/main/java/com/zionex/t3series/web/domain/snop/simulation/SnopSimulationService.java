package com.zionex.t3series.web.domain.snop.simulation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.zionex.t3series.web.domain.snop.common.SnopCommonService;
import com.zionex.t3series.web.security.authentication.UserDetail;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SnopSimulationService {

    private final SnopSimulationRepository simulationRepository;

    private final SnopCommonService snopCommonService;

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
        params.remove("menu-cd");
        params.put("P_USER_ID", getAuthUserName());

        return simulationRepository.createVersion(params);
    }

    private String getAuthUserName() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetail user = (UserDetail)auth.getPrincipal();
        return user.getUsername();
    }
}
