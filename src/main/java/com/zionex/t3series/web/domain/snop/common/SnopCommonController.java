package com.zionex.t3series.web.domain.snop.common;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SnopCommonController {

    private final SnopCommonService snopCommonService;

    @PostMapping("/snop/common/list-hierarch")
    public Map<String, Object> getListToHierarch(@RequestBody Map<String, Object> params) throws Exception {
        return snopCommonService.getListToHierarch(params);
    }

}
