package com.zionex.t3series.web.domain.admin.user.permission;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.zionex.t3series.web.constant.ApplicationConstants.PermissionType;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonDeserialize(using = PermissionDataDeserializer.class)
public class PermissionData {

    private String grpId;

    private String userId;

    private String menuId;

    private Boolean PERMISSION_TYPE_READ;

    private Boolean PERMISSION_TYPE_UPDATE;

    private Boolean PERMISSION_TYPE_DELETE;

    public static List<Permission> convertToPermissionEntities(List<PermissionData> permissionDatas) {
        List<Permission> permissions = new ArrayList<>();

        Set<String> permissionTypes = PermissionType.getTypes();
        permissionDatas.forEach(permissionData -> {
            if (permissionData.getMenuId() == null) {
                return;
            }

            for (String permissionType : permissionTypes) {
                Permission permission = new Permission();

                permission.setUserId(permissionData.getUserId());
                permission.setMenuId(permissionData.getMenuId());
                permission.setPermissionTp(permissionType);

                switch (permissionType) {
                    case "READ":
                        if (permissionData.getPERMISSION_TYPE_READ() != null) {
                            permission.setUsability(permissionData.getPERMISSION_TYPE_READ());
                            permissions.add(permission);
                        }
                        break;

                    case "UPDATE":
                        if (permissionData.getPERMISSION_TYPE_UPDATE() != null) {
                            permission.setUsability(permissionData.getPERMISSION_TYPE_UPDATE());
                            permissions.add(permission);
                        }
                        break;

                    case "DELETE":
                        if (permissionData.getPERMISSION_TYPE_DELETE() != null) {
                            permission.setUsability(permissionData.getPERMISSION_TYPE_DELETE());
                            permissions.add(permission);
                        }
                        break;
                }
            }
        });

        return permissions;
    }

    public static List<GroupPermission> convertToGroupPermissionEntities(List<PermissionData> permissionDatas) {
        List<GroupPermission> permissions = new ArrayList<>();

        Set<String> permissionTypes = PermissionType.getTypes();
        permissionDatas.forEach(permissionData -> {
            if (permissionData.getMenuId() == null) {
                return;
            }

            for (String permissionType : permissionTypes) {
                GroupPermission groupPermission = new GroupPermission();

                groupPermission.setGrpId(permissionData.getGrpId());
                groupPermission.setMenuId(permissionData.getMenuId());
                groupPermission.setPermissionTp(permissionType);

                switch (permissionType) {
                    case "READ":
                        if (permissionData.getPERMISSION_TYPE_READ() != null) {
                            groupPermission.setUsability(permissionData.getPERMISSION_TYPE_READ());
                            permissions.add(groupPermission);
                        }
                        break;

                    case "UPDATE":
                        if (permissionData.getPERMISSION_TYPE_UPDATE() != null) {
                            groupPermission.setUsability(permissionData.getPERMISSION_TYPE_UPDATE());
                            permissions.add(groupPermission);
                        }
                        break;

                    case "DELETE":
                        if (permissionData.getPERMISSION_TYPE_DELETE() != null) {
                            groupPermission.setUsability(permissionData.getPERMISSION_TYPE_DELETE());
                            permissions.add(groupPermission);
                        }
                        break;
                }
            }
        });

        return permissions;
    }

}
