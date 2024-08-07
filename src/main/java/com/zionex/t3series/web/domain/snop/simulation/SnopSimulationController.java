package com.zionex.t3series.web.domain.snop.simulation;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class SnopSimulationController {

    private final SnopSimulationService snopSimulationService;

    private final String TREE_PARENT_ID = "TREE_PARENT_ID";

    private final String TREE_ID = "TREE_ID";

    @GetMapping("/snop/simulation/version")
    public Map<String, Object> getVersions(@RequestParam(TREE_PARENT_ID) String parentId,
            @RequestParam(TREE_ID) String id) throws Exception {
        return snopSimulationService.getSimulationVersion(parentId, id);
    }

    @PostMapping("/snop/simulation/create-version")
    public Object createVersion(@RequestBody Map<String, Object> params) throws Exception {
        return snopSimulationService.createVersion(params);
    }

}
