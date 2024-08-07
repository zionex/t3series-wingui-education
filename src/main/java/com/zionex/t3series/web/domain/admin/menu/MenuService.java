package com.zionex.t3series.web.domain.admin.menu;

import static com.zionex.t3series.web.constant.ApplicationConstants.ICON_DEFAULT;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zionex.t3series.web.domain.admin.account.AccountManager;
import com.zionex.t3series.web.domain.admin.menu.bookmark.Bookmark;
import com.zionex.t3series.web.domain.admin.menu.bookmark.BookmarkService;
import com.zionex.t3series.web.domain.admin.menu.manual.Manual;
import com.zionex.t3series.web.domain.admin.menu.manual.ManualService;
import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.domain.admin.user.delegation.DelegationService;
import com.zionex.t3series.web.domain.admin.user.permission.GroupPermission;
import com.zionex.t3series.web.domain.admin.user.permission.GroupPermissionService;
import com.zionex.t3series.web.domain.admin.user.permission.Permission;
import com.zionex.t3series.web.domain.admin.user.permission.PermissionService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;

    private final AccountManager accountManager;
    private final UserService userService;
    private final DelegationService delegationService;
    private final GroupPermissionService groupPermissionService;
    private final ManualService manualService;

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private PermissionService permissionService;

    private final String ADMIN_MODULE_PREFIX = "UI_AD_";

    private final Set<String> userMenus = new HashSet<>(Arrays.asList("UI_AD_01", "UI_AD_07"));
    private final Set<String> filterMenus = new HashSet<>(Arrays.asList("UI_AD_MENU_MST"));

    private List<Menu> menus = new ArrayList<>();

    @Getter
    private Map<String, String> menuCdMap = new HashMap<>();

    public Map<String, Menu> getMenusMap() {
        Map<String, Menu> menusMap = new HashMap<>();
        menus.forEach(menu -> menusMap.put(menu.getMenuCd(), menu));

        return menusMap;
    }

    public List<Menu> getMenusByUse(boolean allMenus) {
        if (allMenus) {
            menus = menuRepository.findAll();
        } else {
            menus = menuRepository.findByUseYnTrue();
        }

        return menus;
    }

    public List<Menu> getOpenViews() {
        List<Menu> menus = getMenusByUse(false);
        return menus
                .stream()
                .filter(menu -> (!StringUtils.isEmpty(menu.getParentId()) && !StringUtils.isEmpty(menu.getMenuPath())))
                .collect(Collectors.toList());
    }

    public List<Menu> getUserOpenViews() {
        List<Menu> views = getOpenViews().stream().sorted(Comparator.comparing(Menu::getMenuCd)).filter(view -> {
            if (view.getMenuCd().startsWith("UI_AD_")) {
                return isUserMenus(view.getMenuCd());
            } else {
                return true;
            }
        }).collect(Collectors.toList());

        return views;
    }

    public MenuItem getMenus() {
        MenuItem rootMenuItem = new MenuItem("", "", ICON_DEFAULT, "", "", null, 0, false, true);
        Map<String, MenuItem> menuGroup = new HashMap<>();
        Map<String, MenuItem> menuView = new HashMap<>();

        String username = userService.getUserDetails().getUsername();
        if (StringUtils.isEmpty(username)) {
            return rootMenuItem;
        }

        List<Menu> menus = getMenusByUse(false);
        menuCdMap = menus.stream().collect(Collectors.toMap(Menu::getId, Menu::getMenuCd));

        menus.forEach(menu -> {
            String menuCd = menu.getMenuCd();
            String parentId = menuCdMap.getOrDefault(menu.getParentId(), "");

            if (StringUtils.isEmpty(menu.getMenuPath())) {
                menuGroup.put(menuCd, new MenuItem(menuCd, parentId, menu.getMenuIcon(), "", "", null, menu.getMenuSeq(), false, true));
            } else if (!StringUtils.isEmpty(menu.getParentId())) {
                menuView.put(menuCd, new MenuItem(menuCd, parentId, "", menu.getMenuPath(), menu.getMenuFilePath(), null, menu.getMenuSeq(), false, true));
            }
        });

        Set<String> acceptMenus = getAcceptMenus(username, menuView.keySet());

        String userId = userService.getUser(username).getId();
        List<Bookmark> bookmarks = bookmarkService.getBookmarks(userId);

        MenuItem bookmarkMenuItem = new MenuItem("BOOKMARK", "", "Bookmark", "", "", null, -1, false, true);

        bookmarks.forEach(bookmark -> {
            String menuCd = bookmark.getMenuCd();
            if (bookmark.getBookmark() && menuCdMap.containsValue(menuCd) && acceptMenus.contains(menuCd)) {
                Menu menu = menus.stream().filter(m -> m.getMenuCd().equals(menuCd)).findFirst().get();
                bookmarkMenuItem.addItems(new MenuItem(menuCd, menuCdMap.get(menu.getParentId()), "", menu.getMenuPath(), menu.getMenuFilePath(), null, bookmark.getSeq(), true, true));
            }
        });

        if (!bookmarkMenuItem.getItems().isEmpty()) {
            rootMenuItem.addItems(bookmarkMenuItem);
        }

        Map<String, Manual> manualMap = manualService.getManualMap();
        menuView.values().forEach(menu -> {
            if (acceptMenus.contains(menu.getId())) {
                Manual manual = manualMap.get(menu.getId());
                if (manual != null) {
                    String extension = Optional.ofNullable(manual.getFileExtension()).orElse("html").toLowerCase();
                    menu.setManualPath(manual.getManualPath() + "." + extension);
                }
                appendMenuItems(menu, menuGroup);
            }
        });

        menuGroup.values().forEach(menu -> {
            if (StringUtils.isEmpty(menu.getParentId()) && !menu.getItems().isEmpty()) {
                rootMenuItem.addItems(menu);
            }
        });

        return rootMenuItem;
    }

    public Set<MenuItem> getMenusTree(boolean allMenus) {
        Set<MenuItem> menuItems = new TreeSet<>();
        Map<String, MenuItem> menuGroup = new HashMap<>();
        Map<String, MenuItem> menuView = new HashMap<>();

        String username = userService.getUserDetails().getUsername();
        if (StringUtils.isEmpty(username)) {
            return menuItems;
        }

        List<Menu> menus = getMenusByUse(allMenus);
        menuCdMap = menus.stream().collect(Collectors.toMap(Menu::getId, Menu::getMenuCd));
        
        String userId = userService.getUser(username).getId();
        List<Bookmark> bookmarks = bookmarkService.getBookmarks(userId);
        Map<String, Boolean> bookmarkMap = bookmarks.stream().filter(Bookmark::getBookmark).collect(Collectors.toMap(Bookmark::getMenuId, Bookmark::getBookmark));

        menus.forEach(menu -> {
            if (StringUtils.isEmpty(menu.getMenuPath())) {
                String parentId = StringUtils.isEmpty(menu.getParentId()) ? "" : menuCdMap.get(menu.getParentId());
                menuGroup.put(menu.getMenuCd(), new MenuItem(menu.getMenuCd(), parentId, menu.getMenuIcon(), "", "", null, menu.getMenuSeq(), false, menu.getUseYn()));
            }

            if (!StringUtils.isEmpty(menu.getParentId()) && !StringUtils.isEmpty(menu.getMenuPath()) && !filterMenus.contains(menu.getMenuCd())) {
                menuView.put(menu.getMenuCd(), new MenuItem(menu.getMenuCd(), menuCdMap.get(menu.getParentId()), "", menu.getMenuPath(), menu.getMenuFilePath(), null, menu.getMenuSeq(), bookmarkMap.getOrDefault(menu.getId(), false), menu.getUseYn()));
            }
        });

        if (allMenus) {
            menuView.values().forEach(menu -> appendMenuItems(menu, menuGroup));
        } else {
            Set<String> acceptMenus = getAcceptMenus(username, menuView.keySet());
            menuView.values().forEach(menu -> {
                if (acceptMenus.contains(menu.getId())) {
                    appendMenuItems(menu, menuGroup);
                }
            });
        }

        menuGroup.values().forEach(menu -> {
            if (StringUtils.isEmpty(menu.getParentId()) && !menu.getItems().isEmpty()) {
                menuItems.add(menu);
            }
        });

        return menuItems;
    }

    public void appendMenuItems(MenuItem menu, Map<String, MenuItem> menuGroup) {
        MenuItem group = menuGroup.get(menu.getParentId());
        
        if (group != null) {
            group.addItems(menu);
            if (!StringUtils.isEmpty(group.getParentId())) {
                appendMenuItems(group, menuGroup);
            }
        }
    }

    public boolean isAdminModuleMenu(String menuCd) {
        if (menuCd == null) {
            return false;
        }
        return menuCd.startsWith(ADMIN_MODULE_PREFIX);
    }

    public Set<String> getAcceptMenus(String username, Set<String> allViews) {
        Set<String> acceptMenus = new HashSet<>();

        if (accountManager.isSystemAdmin(username)) {
            return allViews;
        }

        String userId = userService.getUser(username).getId();
        List<String> delegationUserIds = delegationService.getDelegatedUserIds(userId);
        delegationUserIds.add(userId);

        for (String user : delegationUserIds) {
            List<Permission> permissions = permissionService.getPermissionsByPermissionTp(user, "READ");
            acceptMenus.addAll(permissions.stream().map(Permission::getMenuId).collect(Collectors.toSet()));

            List<GroupPermission> groupPermissions = groupPermissionService.getGroupPermissionsByPermissionTp(user, "READ");
            acceptMenus.addAll(groupPermissions.stream().map(GroupPermission::getMenuId).collect(Collectors.toSet()));
        }

        return filterUserMenu(acceptMenus
                .stream()
                .map(menu -> menuCdMap.get(menu))
                .collect(Collectors.toSet()));
    }

    public Set<String> filterUserMenu(Set<String> menuCds) {
        return menuCds
                .stream()
                .filter(menuCd -> {
                    boolean existMenu = menuCdMap.containsValue(menuCd);
                    if (existMenu) {
                        if (isAdminModuleMenu(menuCd)) {
                            return isUserMenus(menuCd);
                        } else {
                            return true;
                        }
                    } else {
                        return false;
                    }
                })
                .collect(Collectors.toSet());
    }

    public Menu getMenuById(String menuId) {
        return menuRepository.findById(menuId).orElse(null);
    }

    public Menu getMenu(String menuCd) {
        return menuRepository.findByMenuCd(menuCd).orElse(null);
    }
    
    public boolean isUserMenus(String menuCd) {
        return userMenus.contains(menuCd);
    }

    public boolean existsMenu(String menuCd) {
        return menuRepository.existsByMenuCd(menuCd);
    }

    @Transactional
    public void saveMenus(List<MenuItem> menuItems) {
        List<Menu> saveMenus = new ArrayList<>();

        menuItems.forEach(item -> {
            Menu menu = getMenu(item.getId());
            if (menu == null) {
                menu = new Menu();
                menu.setMenuCd(item.getId());
            }
            menu.setMenuPath(StringUtils.isEmpty(item.getPath()) ? null : item.getPath());
            menu.setMenuFilePath(StringUtils.isEmpty(item.getFilePath()) ? null : item.getFilePath());
            menu.setMenuSeq(item.getSeq());
            menu.setMenuIcon(StringUtils.isEmpty(item.getIcon()) ? null : item.getIcon());
            menu.setUseYn(item.isUsable());

            saveMenus.add(menu);
        });
        menuRepository.saveAll(saveMenus);

        for (MenuItem menu : menuItems) {
            Menu savedMenu = getMenu(menu.getId());
            if (savedMenu == null) {
                continue;
            }

            String parentId = menu.getParentId();
            if (StringUtils.isEmpty(parentId)) {
                continue;
            }

            Menu parentMenu = getMenu(parentId);
            if (parentMenu != null) {
                savedMenu.setParentId(parentMenu.getId());
                menuRepository.save(savedMenu);

                String filePath = savedMenu.getMenuFilePath();
                if (!StringUtils.isEmpty(filePath)) {
                    int indexOf = filePath.indexOf("/", 1);
                    if (indexOf > 0) {
                        String moduleName = filePath.substring(1, indexOf);

                        Manual manual = manualService.getManual(menu.getId());
                        if (manual == null) { 
                            manual = new Manual();
                            manual.setCreateDttm(LocalDateTime.parse("1970-01-01T00:00"));
                        }
                        manual.setMenuCd(menu.getId());
                        manual.setManualPath(moduleName + "/ui/" + menu.getId());
                        manualService.saveManual(manual);
                    }
                }
            }
        }
        menuCdMap.clear();
    }

    @Transactional
    public void deleteMenus(List<String> menuCds) {
        menuRepository.deleteByMenuCdIn(menuCds);
        menuCdMap.clear();

        manualService.deleteManuals(menuCds);
    }

}
