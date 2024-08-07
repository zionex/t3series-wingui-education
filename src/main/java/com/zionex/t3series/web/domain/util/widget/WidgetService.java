package com.zionex.t3series.web.domain.util.widget;

import static com.zionex.t3series.web.constant.ApplicationConstants.ICON_DEFAULT;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zionex.t3series.web.domain.admin.user.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WidgetService {

    private final WidgetRepository widgetRepository;
    private final UserService userService;

    private List<Widget> widgets = new ArrayList<>();

    private Map<String, String> widgetCdMap = new HashMap<>();

    public List<Widget> getWidgetsByUse(boolean allWidgets) {
        if (allWidgets) {
            widgets = widgetRepository.findAll();
        } else {
            widgets = widgetRepository.findByUseYnTrue();
        }

        return widgets;
    }

    public WidgetItem getWidgets() {
        WidgetItem rootWidgetItem = new WidgetItem("", "", ICON_DEFAULT, "", "", 0, false, true);
        Map<String, WidgetItem> widgetGroup = new HashMap<>();
        Map<String, WidgetItem> widgetView = new HashMap<>();

        String username = userService.getUserDetails().getUsername();
        if (StringUtils.isEmpty(username)) {
            return rootWidgetItem;
        }

        List<Widget> widgets = getWidgetsByUse(false);
        widgetCdMap = widgets.stream().collect(Collectors.toMap(Widget::getId, Widget::getWidgetCd));

        widgets.forEach(widget -> {
            if (StringUtils.isEmpty(widget.getWidgetPath())) {
                String parentId = StringUtils.isEmpty(widget.getParentId()) ? "" : widgetCdMap.get(widget.getParentId());
                widgetGroup.put(widget.getWidgetCd(), new WidgetItem(widget.getWidgetCd(), parentId, widget.getWidgetIcon(), "", "", widget.getWidgetSeq(), false, true));
            }

            if (!StringUtils.isEmpty(widget.getParentId()) && !StringUtils.isEmpty(widget.getWidgetPath())) {
                widgetView.put(widget.getWidgetCd(), new WidgetItem(widget.getWidgetCd(), widgetCdMap.get(widget.getParentId()), "", widget.getWidgetPath(), widget.getWidgetTp(), widget.getWidgetSeq(), false, true));
            }
        });

        widgetView.values().forEach(widget -> appendWidgetItems(widget, widgetGroup));

        widgetGroup.values().forEach(widget -> {
            if (StringUtils.isEmpty(widget.getParentId()) && !widget.getItems().isEmpty()) {
                rootWidgetItem.addItems(widget);
            }
        });

        return rootWidgetItem;
    }

    public Set<WidgetItem> getWidgetsTree(boolean allWidgets) {
        Set<WidgetItem> widgetItems = new TreeSet<>();
        Map<String, WidgetItem> widgetGroup = new HashMap<>();
        Map<String, WidgetItem> widgetView = new HashMap<>();

        String username = userService.getUserDetails().getUsername();
        if (StringUtils.isEmpty(username)) {
            return widgetItems;
        }

        List<Widget> widgets = getWidgetsByUse(allWidgets);
        widgetCdMap = widgets.stream().collect(Collectors.toMap(Widget::getId, Widget::getWidgetCd));

        widgets.forEach(widget -> {
            if (StringUtils.isEmpty(widget.getWidgetPath())) {
                String parentId = StringUtils.isEmpty(widget.getParentId()) ? "" : widgetCdMap.get(widget.getParentId());
                widgetGroup.put(widget.getWidgetCd(), new WidgetItem(widget.getWidgetCd(), parentId, widget.getWidgetIcon(), "", "", widget.getWidgetSeq(), false, widget.getUseYn()));
            }

            if (!StringUtils.isEmpty(widget.getParentId()) && !StringUtils.isEmpty(widget.getWidgetPath())) {
                widgetView.put(widget.getWidgetCd(),
                               new WidgetItem(widget.getWidgetCd(), widgetCdMap.get(widget.getParentId()), "", widget.getWidgetPath(), widget.getWidgetTp(), widget.getWidgetSeq(), false,widget.getUseYn()));
            }
        });

        widgetView.values().forEach(widget -> appendWidgetItems(widget, widgetGroup));

        widgetGroup.values().forEach(widget -> {
            if (StringUtils.isEmpty(widget.getParentId()) && !widget.getItems().isEmpty()) {
                widgetItems.add(widget);
            }
        });

        return widgetItems;
    }

    public void appendWidgetItems(WidgetItem widget, Map<String, WidgetItem> widgetGroup) {
        WidgetItem group = widgetGroup.get(widget.getParentId());

        if (group != null) {
            group.addItems(widget);
            if (!StringUtils.isEmpty(group.getParentId())) {
                appendWidgetItems(group, widgetGroup);
            }
        }
    }

    public Widget getWidget(String widgetCd) {
        return widgetRepository.findByWidgetCd(widgetCd).orElse(null);
    }

    public boolean existswidgets(String widgetCd) {
        return widgetRepository.existsByWidgetCd(widgetCd);
    }

    public void saveWidgets(List<WidgetItem> widgets) {
        List<Widget> saveWidgets = new ArrayList<>();

        widgets.forEach(widget -> {
            if (existswidgets(widget.getId())) {
                Widget existsWidget = getWidget(widget.getId());

                existsWidget.setWidgetPath(StringUtils.isEmpty(widget.getPath()) ? null : widget.getPath());
                existsWidget.setWidgetTp(widget.getType());
                existsWidget.setWidgetSeq(widget.getSeq());
                existsWidget.setWidgetIcon(StringUtils.isEmpty(widget.getIcon()) ? null : widget.getIcon());
                existsWidget.setUseYn(widget.isUsable());

                saveWidgets.add(existsWidget);
            } else {
                Widget newWidget = new Widget();

                newWidget.setWidgetCd(widget.getId());
                newWidget.setWidgetPath(widget.getPath());
                newWidget.setWidgetTp(widget.getType());
                newWidget.setWidgetSeq(widget.getSeq());
                newWidget.setWidgetIcon(StringUtils.isEmpty(widget.getIcon()) ? null : widget.getIcon());
                newWidget.setUseYn(widget.isUsable());

                saveWidgets.add(newWidget);
            }
        });
        widgetRepository.saveAll(saveWidgets);

        for (WidgetItem widget : widgets) {
            Widget savedWidget = getWidget(widget.getId());
            if (savedWidget == null) {
                continue;
            }

            String parentId = widget.getParentId();
            if (StringUtils.isEmpty(widget.getParentId())) {
                continue;
            }

            Widget parentWidget = getWidget(parentId);
            if (parentWidget != null) {
                savedWidget.setParentId(parentWidget.getId());
                widgetRepository.save(savedWidget);
            }
        }
        widgetCdMap.clear();
    }

    public void deleteWidgets(List<String> widgetCds) {
        widgetRepository.deleteByWidgetCdIn(widgetCds);
        widgetCdMap.clear();
    }

}
