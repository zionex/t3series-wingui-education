package com.zionex.t3series.web.domain.util.dashboard;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardRepository dashboardRepository;

    public Optional<Dashboard> getDashboard(String id) {
        return dashboardRepository.findById(id);
    }

    public List<Dashboard> getDashboards() {
        return dashboardRepository.findAll();
    }

    public void saveDashboards(List<Dashboard> dashboards) {
        dashboardRepository.saveAll(dashboards);
    }

    public void deleteDashboard(String id) {
        dashboardRepository.deleteById(id);
    }

}
