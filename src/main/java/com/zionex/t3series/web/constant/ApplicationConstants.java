package com.zionex.t3series.web.constant;

import java.util.HashSet;
import java.util.Set;

public interface ApplicationConstants {

    String CONTENT_TYPE_JSON          = "text/json;charset=UTF-8";

    String ICON_DEFAULT               = "default";

    String REQUEST_KEY_TREE_KEY_ID    = "TREE_KEY_ID";
    String REQUEST_KEY_TREE_PARENT_ID = "TREE_PARENT_ID";

    public enum PermissionType {
        READ,
        UPDATE,
        DELETE;

        public static Set<String> getTypes() {
            Set<String> types = new HashSet<>();
            for (PermissionType type : PermissionType.values()) {
                types.add(type.name());
            }
            return types;
        }
    }

}
