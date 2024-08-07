package com.zionex.t3series.web.domain.util.widget;

import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

import lombok.Data;

@Data
public class WidgetItem implements Comparable<WidgetItem> {

    private String id;
    private String parentId;
    private String icon;
    private String path;
    private String type;
    private int seq;
    private boolean bookmarked;
    private boolean usable;
    private Set<WidgetItem> items = new TreeSet<>();

    public WidgetItem(String id, String parentId, String icon, String path, String type, int seq, boolean bookmarked, boolean usable) {
        this.id = id;
        this.parentId = parentId;
        this.icon = icon;
        this.path = path;
        this.type = type;
        this.seq = seq;
        this.bookmarked = bookmarked;
        this.usable = usable;
    }

    public void addItems(WidgetItem item) {
        Set<String> ids = this.items.stream().map(WidgetItem::getId).collect(Collectors.toSet());
        if (!ids.contains(item.getId())) {
            this.items.add(item);
        }
    }

    @Override
    public int compareTo(WidgetItem item) {
        int result = Integer.compare(this.seq, item.getSeq());
        if (result != 0) {
            return result;
        }

        return this.id.compareTo(item.id);
    }

}
