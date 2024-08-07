package com.zionex.t3series.web.domain.snop.common;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zionex.t3series.web.domain.common.CommonService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SnopCommonService {

    private final CommonService commonService;

    @SuppressWarnings("unchecked")
    public Map<String, Object> getListToHierarch(Map<String, Object> params) throws Exception {
        Map<String, Object> resultMap = new HashMap<String, Object>();

        String parentId = (String) params.get("TREE_PARENT_ID");
        String id = (String) params.get("TREE_ID");
        String procedure = (String) params.get("PROCEDURE");
        Map<String, Object> parameters = (Map<String, Object>) params.get("PARAMETERS");
        
        List<Map<String, Object>> list = commonService.getData(procedure, parameters);
        List<Map<String, Object>> hierarch = flatListToHierarch(list, id, parentId);
        
        resultMap.put("items", hierarch);

        return resultMap;
    }

    public List<Map<String, Object>> flatListToHierarch(List<Map<String, Object>> result, String treeKeyId, String treeParentId) {
       return flatListToHierarch(result, treeKeyId, treeParentId, "yyyy-MM-dd'T'HH:mm:ss");
    }

    public List<Map<String, Object>> flatListToHierarch(List<Map<String, Object>> result, String treeKeyId, String treeParentId, String strFormat) {
  
        if(result.isEmpty()) {
            return null;    
        }

        SimpleDateFormat format =  new SimpleDateFormat(strFormat);

        Map<String, Object> obj = result.get(0);

        List<String> columnNames = new ArrayList<>();
        List<List<Object>> rows = new ArrayList<>();

        columnNames = obj.entrySet().stream().map((set)->set.getKey()).collect(Collectors.toList());
        rows = result.stream().map(x -> new ArrayList<>(x.values())).collect(Collectors.toList());

        int childIdx = 0;
        int parentIdx = 0;
        int colCount = columnNames.size();

        for (int idx = 0; idx < colCount; idx++) {
            String columnName = columnNames.get(idx);
            if (columnName.equals(treeKeyId)) {
                childIdx = idx;
            } else if (columnName.equals(treeParentId)) {
                parentIdx = idx;
            }
        }

        Map<String, List<Object>> data = new HashMap<>();
        Map<String, List<String>> hiearchy = new HashMap<>();

        for (List<Object> row : rows) {
            if (log.isDebugEnabled()) {
                log.debug("row: {}", row);
            }

            int idx = 0;
            for (Object value : row) {
                if (value instanceof Date) {
                    row.set(idx, format.format(value));
                }
                idx++;
            }

            String childId = (String) row.get(childIdx);
            Object parent = row.get(parentIdx);
            String parentId = null;
            if (parent instanceof String) {
                parentId = (String) parent;
            }

            if (StringUtils.isEmpty(parentId)) {
                parentId = "root";
            }

            List<String> list = hiearchy.computeIfAbsent(parentId, k -> new ArrayList<>());
            list.add(childId);

            data.put(childId, row);
        }

        Map<String, Object> hiearchyinfo = makeHierarchInfo("root", hiearchy, 1, new HashMap<>());

        return makeHierarchData(hiearchyinfo, data, columnNames);
    }

    private Map<String, Object> makeHierarchInfo(String parentId, Map<String, List<String>> parentChildren, int depth, HashMap<Integer, Set<String>> history) {
        Map<String, Object> childMap = new HashMap<>();

        List<String> children = parentChildren.get(parentId);
        if (children == null || children.isEmpty()) {
            return childMap;
        }

        Set<String> historyList = history.computeIfAbsent(depth, key -> new HashSet<>());

        Set<String> r = history.entrySet().stream().filter(x -> x.getKey() < depth).flatMap(p -> p.getValue().stream())
                                .collect(Collectors.toSet());

        for (String childId : children) {
            if (parentId.equals(childId)) {
                continue;
            }

            if (!parentId.equals("root") && r.contains(childId)) {
                childMap.put(childId, new HashMap<>());
            } else {
                historyList.add(childId);
                childMap.put(childId, makeHierarchInfo(childId, parentChildren,depth+1, history));
            }
        }

        return childMap;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> makeHierarchData(Map<String, Object> hierarchyInfo, Map<String, List<Object>> data, List<String> columnNames) {
        List<Map<String, Object>> result = new ArrayList<>();

        for (Map.Entry<String, Object> subEntry : hierarchyInfo.entrySet()) {
            String id = subEntry.getKey();
            Map<String, Object> inHierarchyInfo = (Map<String, Object>) subEntry.getValue();

            Map<String, Object> obj = new HashMap<String, Object>();

            List<Object> row = data.get(id);
            for (int idx = 0; idx < columnNames.size(); idx++) {
                String columnName = columnNames.get(idx);
                Object value = row.get(idx);
                obj.put(columnName, value);
            }

            if (inHierarchyInfo != null && !inHierarchyInfo.isEmpty()) {
                obj.put("items", makeHierarchData(inHierarchyInfo, data, columnNames));
            }
            result.add(obj);
        }

        return result;
    }
    
}
