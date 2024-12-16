package com.zionex.t3series.web.util.crosstab;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

public class PivotUtil {
  
    public static Map<String, Object> pivotData(
              List<Map<String, Object>> dataList,
              String headerColumn,
              String[] groupCds,
              String[] dataColumns,
              String[] measureCds,
              String[] additionalHeaderColumns) {
  
          Map<String, Object> resultMap = new HashMap<>();
          
          Function<Map<String, Object>, List<Object>> pivotColumns = wr -> 
              Arrays.stream(groupCds).map(wr::get).collect(Collectors.toList());
  
          Collection<List<Map<String, Object>>> groupedList = dataList.stream()
                  .collect(Collectors.groupingBy(pivotColumns, LinkedHashMap::new, Collectors.toList()))
                  .values();
  
          List<Map<String, Object>> data = new ArrayList<>();
          Set<String> header = new LinkedHashSet<>();
          List<Map<String, String>> additionalHeaderList = new ArrayList<>();
  
          for (Map<String, Object> heads : dataList) {
              header.add((String) heads.get(headerColumn));
  
              if (additionalHeaderColumns != null && additionalHeaderColumns.length > 0) {
                  Map<String, String> additionalHeaderMap = new LinkedHashMap<>();
                  for (String column : additionalHeaderColumns) {
                      additionalHeaderMap.put(column, String.valueOf(heads.get(column)));
                  }
                  additionalHeaderList.add(additionalHeaderMap);
              }
          }
  
          // 중복 제거
          Set<Map<String, String>> uniqueSet = new LinkedHashSet<>(additionalHeaderList);
          List<Map<String, String>> uniqueHeaderList = new ArrayList<>(uniqueSet);
  
  
          if (!header.isEmpty()) {
              String[] existDataHeader = header.toArray(new String[0]);
  
              for (List<Map<String, Object>> groupItem : groupedList) {
                  Map<String, Object[]> columnData = new HashMap<>();
                  
                  for (String column : dataColumns) {
                      columnData.put(column, new Object[existDataHeader.length]);
                  }
  
                  boolean existDataFlag = false;
  
                  for (Map<String, Object> item : groupItem) {
                      String headerIdx = (String) item.get(headerColumn);
                      int idx = Arrays.asList(existDataHeader).indexOf(headerIdx);
  
                      for (String column : dataColumns) {
                          columnData.get(column)[idx] = item.get(column);
                      }
                      existDataFlag = true;
                  }
  
                  if (existDataFlag) {
                      if (measureCds != null && measureCds.length > 0) {
                          for (int i = 0; i < measureCds.length; i++) {
                              Map<String, Object> typeMap = new HashMap<>(groupItem.get(0));
                              typeMap.put("QTY_TYPE", measureCds[i]);
                              String column = dataColumns[i];
                              typeMap.put("QTY", Arrays.asList(columnData.get(column)));
  
                              if(dataColumns.length > measureCds.length){
                                  for (int j = measureCds.length; j < dataColumns.length; j++) {
                                      typeMap.put(dataColumns[j], Arrays.asList(columnData.get(dataColumns[j])));
                                  }
                              }
                              data.add(typeMap);
                          } 
                      } else {
                          Map<String, Object> item = new HashMap<>(groupItem.get(0));
                          for (String column : dataColumns) {
                              item.put(column, Arrays.asList(columnData.get(column)));
                          }
                          data.add(item);
                      }
                  }
              }
          }
  
          resultMap.put("header", header);
          if (!uniqueHeaderList.isEmpty()) {
              resultMap.put("headerMap", uniqueHeaderList);
          }
          resultMap.put("data", data);
          return resultMap;
      }


      public static Map<String, Object> pivotData(
        List<Map<String, Object>> dataList,
        String headerColumn,
        String[] groupCds,
        String valueColumn,
        String pivotColumn,
        String[] additionalHeaderColumns) {

        Map<String, Object> resultMap = new HashMap<>();
        
        // Group by the main grouping columns
        Function<Map<String, Object>, List<Object>> pivotColumns = wr -> 
            Arrays.stream(groupCds).map(wr::get).collect(Collectors.toList());

        Collection<List<Map<String, Object>>> groupedList = dataList.stream()
                .collect(Collectors.groupingBy(pivotColumns, LinkedHashMap::new, Collectors.toList()))
                .values();

        List<Map<String, Object>> data = new ArrayList<>();
        Set<String> header = new LinkedHashSet<>();
        List<Map<String, String>> additionalHeaderList = new ArrayList<>();

        // Collect unique headers
        for (Map<String, Object> heads : dataList) {
            header.add((String) heads.get(headerColumn));

            if (additionalHeaderColumns != null && additionalHeaderColumns.length > 0) {
                Map<String, String> additionalHeaderMap = new LinkedHashMap<>();
                for (String column : additionalHeaderColumns) {
                    additionalHeaderMap.put(column, String.valueOf(heads.get(column)));
                }
                additionalHeaderList.add(additionalHeaderMap);
            }
        }

        // Get unique pivot values (DIVS_CD values)
        Set<String> pivotValues = dataList.stream()
                .map(m -> (String) m.get(pivotColumn))
                .collect(Collectors.toCollection(LinkedHashSet::new));

        Set<Map<String, String>> uniqueSet = new LinkedHashSet<>(additionalHeaderList);
        List<Map<String, String>> uniqueHeaderList = new ArrayList<>(uniqueSet);

        if (!header.isEmpty()) {
            String[] existDataHeader = header.toArray(new String[0]);

            for (List<Map<String, Object>> groupItem : groupedList) {
                Map<String, Object[]> columnData = new HashMap<>();
                
                // Initialize arrays for each pivot value
                for (String pivotValue : pivotValues) {
                    columnData.put(pivotValue, new Object[existDataHeader.length]);
                }

                boolean existDataFlag = false;

                // Fill in the data
                for (Map<String, Object> item : groupItem) {
                    String headerIdx = (String) item.get(headerColumn);
                    String pivotVal = (String) item.get(pivotColumn);
                    int idx = Arrays.asList(existDataHeader).indexOf(headerIdx);

                    columnData.get(pivotVal)[idx] = item.get(valueColumn);
                    existDataFlag = true;
                }

                if (existDataFlag) {
                    Map<String, Object> item = new HashMap<>(groupItem.get(0));
                    // Add each pivot value as a separate column
                    for (String pivotValue : pivotValues) {
                        item.put(pivotValue + "_QTY", Arrays.asList(columnData.get(pivotValue)));
                    }
                    // Remove the original columns that were pivoted
                    item.remove(pivotColumn);
                    item.remove(valueColumn);
                    data.add(item);
                }
            }
        }

        resultMap.put("header", header);
        if (!uniqueHeaderList.isEmpty()) {
            resultMap.put("headerMap", uniqueHeaderList);
        }
        resultMap.put("data", data);
        return resultMap;
    }
  }
  