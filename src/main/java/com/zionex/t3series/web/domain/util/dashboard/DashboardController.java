package com.zionex.t3series.web.domain.util.dashboard;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard/view")
    public Optional<Dashboard> getDashboard(@RequestParam("id") String id) {
        return dashboardService.getDashboard(id);
    }

    @GetMapping("/dashboard/list")
    public List<Dashboard> getDashboards(@RequestParam("menucd") String menucd) {
        return dashboardService.getDashboards();
    }

    @PostMapping("/dashboard/save")
    public void saveDashboards(@RequestBody List<Dashboard> dashboards) {
        dashboardService.saveDashboards(dashboards);
    }

    @GetMapping("/dashboard/delete")
    public void deleteDashboard(@RequestParam(value = "id") String id) {
        dashboardService.deleteDashboard(id);
    }

}
