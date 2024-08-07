package com.zionex.t3series.web.domain.admin.menu.manual;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ManualService {

    private final ManualRepository manualRepository;

    public Manual getManual(String menuCd) {
        return manualRepository.findById(menuCd).orElse(null);
    }

    public List<Manual> getManuals() {
        return manualRepository.findByUseYnTrue();
    }

    public Map<String, Manual> getManualMap() {
        return getManuals()
                .stream()
                .collect(Collectors.toMap(Manual::getMenuCd, manual -> manual));
    }

    public void saveManual(Manual manual) {
        manualRepository.save(manual);
    }

    public void deleteManuals(List<String> menuCds) {
        manualRepository.deleteByMenuCdIn(menuCds);
    }

}
