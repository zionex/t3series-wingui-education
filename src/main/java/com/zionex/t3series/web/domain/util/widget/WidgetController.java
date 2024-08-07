package com.zionex.t3series.web.domain.util.widget;

import java.util.List;
import java.util.Set;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class WidgetController {

    private final WidgetService widgetService;

    @GetMapping("/widgets")
    public WidgetItem getWidgets() {
        return widgetService.getWidgets();
    }

    @GetMapping("/system/widgets")
    public Set<WidgetItem> getWidgetTree(@RequestParam(value = "all-widgets", required = false) boolean allWidgets) {
        return widgetService.getWidgetsTree(allWidgets);
    }

    @PostMapping("/system/widgets")
    public void saveWidgets(@RequestBody List<WidgetItem> widgets) {
        widgetService.saveWidgets(widgets);
    }

    @PostMapping("/system/widgets/delete")
    public void deleteWidgets(@RequestBody List<String> widgetCds) {
        widgetService.deleteWidgets(widgetCds);
    }

}
