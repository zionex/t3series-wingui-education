package com.zionex.t3series.web.project.practice;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.persistence.ParameterMode;
import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.domain.common.CommonService;
import com.zionex.t3series.web.util.crosstab.PivotUtil;
import com.zionex.t3series.web.util.interceptor.ExecPermission;
import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
class Sample {

    public Sample(String plantId, String demandId, String routeCode, String routeName, String resourceCode,
                  String resourceName, String planDate, Integer qty, String holidayYn, List<Object> pivotData) {
        this.plantId = plantId;
        this.demandId = demandId;
        this.routeCode = routeCode;
        this.routeName = routeName;
        this.resourceCode = resourceCode;
        this.resourceName = resourceName;
        this.planDate = planDate;
        this.qty = qty;
        this.holidayYn = holidayYn;
        this.pivotData = pivotData;
    }

    private String plantId;
    private String demandId;
    private String routeCode;
    private String routeName;
    private String resourceCode;
    private String resourceName;
    private String planDate;
    private Integer qty;
    private String holidayYn;
    private List<Object> pivotData;

}

@RestController
@RequiredArgsConstructor
public class PracticeController {

    private final QueryHandler queryHandler;
    private final CommonService commonService;
    private final UserService userService;

    @ExecPermission(menuCd = "UI_PRACTICE_01", type = ServiceConstants.PERMISSION_TYPE_READ)
    @PostMapping("/practice/q1")
    public List<Map<String, Object>> getData1(@RequestBody Map<String, Object> params, HttpServletRequest request) throws Exception {
        return commonService.getData("SP_UI_PRACTICE_01Q", params);
    }

    @ExecPermission(menuCd = "UI_PRACTICE_01", type = ServiceConstants.PERMISSION_TYPE_READ)
    @PostMapping("/practice/q2")
    public List<?> getData2(@RequestBody Map<String, Object> params, HttpServletRequest request) throws Exception {
        String sqlQuery = "SELECT '쿼리-박OO' AS KORNAME, '남' AS GENDER, '71' AS AGE, '(025)6563-2802' AS PHONE, " +
                "'198160731-00008' AS PRODUCTID, '모잠비크' AS KORCOUNTRY, '2021-01-16' AS ORDERDATE, 'Y' AS ACTIVE " +
                "UNION ALL " +
                "SELECT '쿼리-조OO', '남', '62', '(093)8809-8696', " +
                "'571215854-00001', '캐나다', '2019-07-29', 'Y' " +
                "UNION ALL " +
                "SELECT '쿼리-김OO', '남', '45', '(010)1234-5678', " +
                "'123456789-00003', '한국', '2020-05-23', 'N' " +
                "UNION ALL " +
                "SELECT '쿼리-이OO', '여', '32', '(010)8765-4321', " +
                "'987654321-00004', '미국', '2020-11-11', 'Y' " +
                "UNION ALL " +
                "SELECT '쿼리-한OO', '여', '29', '(010)5555-6666', " +
                "'55556666-00005', '호주', '2021-03-14', 'Y' " +
                "UNION ALL " +
                "SELECT '쿼리-장OO', '남', '39', '(010)7777-8888', " +
                "'77778888-00006', '영국', '2018-09-17', 'N' " +
                "UNION ALL " +
                "SELECT '쿼리-송OO', '여', '35', '(010)9999-0000', " +
                "'99990000-00007', '프랑스', '2021-06-21', 'N';";

        return queryHandler.getNativeQueryData(sqlQuery);
    }

    private static Map<String, Object> createDataMap(String plantId, String demandId, String routeCode, String routeName,
                                                     String resourceCode, String resourceName, String planDate, Integer qty, String holidayYn) {
        Map<String, Object> map = new HashMap<>();
        map.put("PLANT_ID", plantId);
        map.put("DEMAND_ID", demandId);
        map.put("ROUTE_CODE", routeCode);
        map.put("ROUTE_NAME", routeName);
        map.put("RESOURCE_CODE", resourceCode);
        map.put("RESOURCE_NAME", resourceName);
        map.put("PLAN_DATE", planDate);
        map.put("QTY", qty);
        map.put("HOLIDAY_YN", holidayYn);
        return map;
    }

    @ExecPermission(menuCd = "UI_PRACTICE_05", type = ServiceConstants.PERMISSION_TYPE_READ)
    @PostMapping("/practice/q3")
    public Map<String, Object> getData3(@RequestBody Map<String, Object> params, HttpServletRequest request) throws Exception {
        List<Map<String, Object>> dataList = Arrays.asList(
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-23", 1, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-23", 10, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-24", 1, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-24", 10, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-25", 1, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-25", 10, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-26", 1, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-26", 10, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-27", 1, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-27", 10, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-28", 10, "Y"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-28", 5, "Y"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-29", 100, "Y"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-29", 999, "Y"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-30", 55, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-30", 22, "N"));

                
        Function<Map<String, Object>, List<Object>> pivotColumns = wr -> Arrays.<Object>asList(wr.get("PLANT_ID"), wr.get("DEMAND_ID"), wr.get("ROUTE_CODE"), wr.get("RESOURCE_CODE"));

        Collection<List<Map<String, Object>>> groupedList = dataList
                .stream()
                .collect(Collectors.groupingBy(pivotColumns, LinkedHashMap::new, Collectors.toList())).values();

        List<Map<String, Object>> data = new ArrayList<>();
        Set<String> header = new TreeSet<>();
        for (Map<String, Object> heads : dataList) {
            header.add((String) heads.get("PLAN_DATE"));
        }
                
        Map<String, Object> resultMap = new HashMap<String, Object>();

        if (header.size() > 0) {
            String[] existDataHeader = header.toArray(new String[header.size()]);
            for (List<Map<String, Object>> groupItem : groupedList) {
                Object[] qty = new Object[existDataHeader.length];
                boolean existDataFlag = false;

                for (Map<String, Object> item : groupItem) {
                    String headerIdx = (String) item.get("PLAN_DATE");
                    int idx = Arrays.asList(existDataHeader).indexOf(headerIdx);
                    qty[idx] = item.get("QTY");
                    existDataFlag = true;
                }
                if (existDataFlag) {
                    Map<String, Object> item = groupItem.get(0);
                    item.put("QTY", Arrays.asList(qty));
                    data.add(item);
                }
            }
            resultMap.put("header", header);
            resultMap.put("data", data);
        } else {
            resultMap.put("header", null);
            resultMap.put("data", dataList);
        }

        return resultMap;
    }

    @ExecPermission(menuCd = "UI_PRACTICE_05", type = ServiceConstants.PERMISSION_TYPE_READ)
    @PostMapping("/practice/q4")
    public Map<String, Object> getData4(@RequestBody Map<String, Object> params, HttpServletRequest request) throws Exception {
        List<Map<String, Object>> dataList = Arrays.asList(
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-23", 1, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-23", 10, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-24", 1, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-24", 10, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-25", 1, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-25", 10, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-26", 1, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-26", 10, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-27", 1, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-27", 10, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-28", 10, "Y"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-28", 5, "Y"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-29", 100, "Y"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-29", 999, "Y"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020110", "가공", "2024-08-30", 55, "N"),
                createDataMap("4205", "F0170006-K1-0001", "KRT-020101", "1차가공", "KRS-020121", "소형로", "2024-08-30", 22, "N"));

        String headerColumn = "PLAN_DATE";
        String[] groupCds = { "PLANT_ID", "DEMAND_ID", "ROUTE_CODE", "RESOURCE_CODE" };
        String[] dataColumns = { "QTY", "HOLIDAY_YN" };
        String[] measureCds = {};
        String[] additionalHeaderColumns = {};
        return PivotUtil.pivotData(dataList, headerColumn, groupCds, dataColumns, measureCds, additionalHeaderColumns);
    }

    @ExecPermission(menuCd = "UI_PRACTICE_01", type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("/practice/s1")
    public Map<String, Object> saveData1(@RequestBody List<Map<String, Object>> changes, HttpServletRequest request) throws Exception {
        String username = userService.getUserDetails().getUsername();

        Map<String, Object> resultMap = new HashMap<>();
        for (Map<String, Object> params : changes) {
            Map<String, Object> param = new HashMap<>();
            param.put("p_ID", new Object[] { params.get("ID"), String.class, ParameterMode.IN });
            param.put("p_KORNAME", new Object[] { params.get("KORNAME"), String.class, ParameterMode.IN });
            param.put("p_GENDER", new Object[] { params.get("GENDER"), String.class, ParameterMode.IN });
            param.put("p_AGE", new Object[] { params.get("AGE"), Integer.class, ParameterMode.IN });
            param.put("p_PHONE", new Object[] { params.get("PHONE"), String.class, ParameterMode.IN });
            param.put("p_PRODUCTID", new Object[] { params.get("PRODUCTID"), String.class, ParameterMode.IN });
            param.put("p_KORCOUNTRY", new Object[] { params.get("KORCOUNTRY"), String.class, ParameterMode.IN });
            param.put("p_ORDERDATE", new Object[] { params.get("ORDERDATE"), String.class, ParameterMode.IN });
            param.put("p_ACTIVE", new Object[] { params.get("ACTIVE"), String.class, ParameterMode.IN });
           // param.put("P_USERNAME", new Object[] { username, String.class, ParameterMode.IN });
            
            Map<String, Object> result = commonService.saveData("SP_UI_PRACTICE_01S", param);
            resultMap.putAll(result);
        }
        return resultMap;
    }

    @ExecPermission(menuCd = "UI_PRACTICE_01", type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("/practice/d1")
    public Map<String, Object> deleteData1(@RequestBody List<Map<String, Object>> changes, HttpServletRequest request) throws Exception {
        String username = userService.getUserDetails().getUsername();

        Map<String, Object> resultMap = new HashMap<>();
        for (Map<String, Object> params : changes) {
            Map<String, Object> param = new HashMap<>();
            param.put("p_ID", new Object[] { params.get("ID"), String.class, ParameterMode.IN });
            //param.put("P_USERNAME", new Object[] { username, String.class, ParameterMode.IN });
            
            Map<String, Object> result = commonService.saveData("SP_UI_PRACTICE_01D", param);
            resultMap.putAll(result);
        }
        return resultMap;
    }

}
