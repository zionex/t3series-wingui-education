### backend

**1. 데이터 그룹화** 이후, 스트림 API를 사용해 데이터를 `pivotColumns` 함수에서 정의한 기준에 따라 그룹화합니다. `Collectors.groupingBy`를 사용해 데이터를 그룹화하고, 각 그룹을 리스트로 반환합니다.

```java
Collection<List<Map<String, Object>>> groupedList = dataList.stream()
    .collect(Collectors.groupingBy(pivotColumns, LinkedHashMap::new, Collectors.toList())).values();
```
**2. 헤더 추출** 각 그룹의 데이터에서 `PLAN_DATE` 필드를 기준으로 헤더를 추출합니다. 이 헤더는 피벗 테이블에서 컬럼 헤더로 사용됩니다. 추출된 헤더는 `TreeSet`을 사용해 중복을 제거하고 정렬합니다.

```java
Set<String> header = new TreeSet<>();
for (Map<String, Object> heads : dataList) {
  header.add((String) heads.get("PLAN_DATE"));
}
```
**3-1. 피벗 데이터 구성** 그룹화된 각 데이터를 순회하며, 헤더에 맞게 데이터를 재배치합니다. 그룹 내 각 데이터의 `PLAN_DATE`를 기준으로 `QTY` 값을 배열에 배치하고, 이를 다시 맵에 추가합니다.

```java
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
```
이 과정에서 `existDataFlag`는 데이터가 유효한지 확인하는 플래그로 사용되며, 유효한 경우에만 피벗 데이터가 추가됩니다.


**3-2. PivotUtil.java 사용**

주어진 입력값들을 기준으로 Grouping을 하고, 그 결과를 피벗 테이블로 변환하여 리턴.

**파라미터 설명** 
<u>배열로 들어가는 값들은 모두 DB 컬럼명</u>이다.

| 파라미터명 | 설명 | 예시 | 
|----------|:-------:|:-------:|
| dataList |  | [{"PLANT_ID": "P1", "QTY": 100}, ...] | 
| headerColumn | 피벗 테이블의 헤더로 사용할 컬럼. | "PLAN_DATE" | 
| groupCds | Group By에 사용될 컬럼들의 배열. | {"PLANT_ID", "DEMAND_ID", "ROUTE_CODE"} | 
| dataColumns | 피벗 테이블에서 값을 표시할 데이터 컬럼들의 배열. | {"QTY", "HOLIDAY_YN"} | 
| measureNms | 데이터 값이 나눠진 경우(측정값 분리 시) 사용하는 분류명. 보통 groupCds에 포함되어 사용할 일이 없지만 DB 데이터로 주어지지 않을 경우 사용. | {"A_QTY", "B_QTY", "C_QTY"} | 
| additionalHeaderColumns | 추가적으로 헤더에 포함할 컬럼. | {"PLAN_DATE","WEEK","ETC"} | 

시나리오 1 : 일반 pivot
```java
String headerColumn ="PLAN_DATE"; 
String[] groupCds = {"PLANT_ID","DEMAND_ID","ROUTE_CODE","RESOURCE_CODE"}; 
String[] dataColumns = {"QTY", "HOLIDAY_YN"}; 
String[] measureNms = {}; 
String[] additionalHeaderColumns = {}; 
return PivotUtil.pivotData(dataList, headerColumn, groupCds, dataColumns, measureNms, additionalHeaderColumns);
```
결과

```
{
  "ROUTE_NAME": "1차가공",
  "PLAN_DATE": "2024-08-23",
  "HOLIDAY_YN": "N",
  "RESOURCE_CODE": "KRS-020110",
  "QTY": [
    1,
    1,
    1,
    1,
    1,
    10,
    100,
    55
  ],
  "PLANT_ID": "4205",
  "DEMAND_ID": "F0170006-K1-0001",
  "RESOURCE_NAME": "가공",
  "ROUTE_CODE": "KRT-020101"
}
```


시나리오2 : Measure 가 있지만 DB에서 Measure 값을 리턴하지 않아서 임의로 표시해야하는 경우
(쉽게 설명해서 구분 컬럼이 없이 컬럼으로 데이터가 나눠져있을 경우)
다국어 처리시  measureNms 에는 다국어 코드값을 넣고 realgrid displayCallback 을 이용해 다국어 표시
```
#시나리오 1 데이터 구성
구분: 기초재고 PLAN_DATE: 20240101  QTY: 1
구분: 출고예정 PLAN_DATE: 20240101  QTY: 2

#시나리오2 데이터 구성
DATE: 20240101  기초재고: 1 출고예정:2 
DATE: 20240102  기초재고: 1 출고예정:2 
```

```javascript
{name: "QTY_TYPE", dataType: "text", headerText :"QTY_TYPE" , visible: true, editable: false, width: 100,
  displayCallback: function (grid, index, val) {
    return transLangKey(val);
  },
},
```


```java
String headerColumn ="PLAN_DT";
String[] groupCds = {"PLNT_CD", "VERSION_CD", "ITEM_CD"};
String[] dataColumns = {"BOH_QTY", "GI_QTY", "GR_QTY", "EOH_QTY", "FLAG"};
String[] measureNms = {"기초재고", "출고예정", "입고예정", "기말재고"}; //다국어 컬럼명
String[] additionalHeaderColumns = {};
return PivotUtil.pivotData(dataList, headerColumn, groupCds, dataColumns, measureNms, additionalHeaderColumns);


```

샘플 데이터 형태 

|PLNT_CD|PLNT_NM|VERSION_CD|ITEM_CD|ITEM_NM|PLAN_DT|BOH_QTY|GI_QTY|GR_QTY|EOH_QTY|FLAG|
|-------|:-----:|:--------:|:-----:|:-----:|:-----:|:-----:|:----:|:----:|:-----:|:--:|
|1100|울산공장|U1-20240723-003-003|D00001|Adipic Acid|20240723|1000|1|0|1|Y|
|1100|울산공장|U1-20240723-003-003|D00001|Adipic Acid|20240724|2000|2|0|2|Y|
|1100|울산공장|U1-20240723-003-003|D00001|Adipic Acid|20240725|3000|3|0|3|Y|

결과
```
{
    "ITEM_CD": "D00001",
    "ITEM_NM": "Adipic Acid",
    "PLNT_NM": "울산공장",
    "PLNT_CD": "1100",
    "FLAG": [
        "Y",
        "Y",
        "Y",
    ],
    "QTY_TYPE": "기초재고",
    "QTY": [
        1000,
        2000,
        3000
    ],
    "VERSION_CD": "U1-20240723-004-003",
    "PLAN_DT": "20240723",
},
{
    "ITEM_CD": "D00001",
    "ITEM_NM": "Adipic Acid",
    "PLNT_NM": "울산공장",
    "PLNT_CD": "1100",
    "FLAG": [
        "Y",
        "Y",
        "Y",
    ],
    "QTY_TYPE": "출고예정",
    "QTY": [
        1,
        2,
        3
    ],
    "VERSION_CD": "U1-20240723-004-003",
    "PLAN_DT": "20240723",
},
```



| 구분     | 2024-01 | 2024-02 |
|----------|:-------:|:-------:|
| 기초재고 |    1    |    1    |
| 출고예정 |    1    |    1    |
| 입고예정 |    1    |    1    |
| 기말재고 |    1    |    1    |


<br/>
<br/>
<br/>
<br/>
<br/>

시나리오3 : 헤더에 부가적인 정보를 DB 데이터로 표현 해달라고 하는 경우 
| 2024-01 | 2024-02 | 
|--------|:--------:|
|  W01    |   W02   |
|  1월    |    2월  | 
| 1 | 1 | 
| 1 | 1 | 
| 1 | 1 | 
| 1 | 1 | 
```java
String headerColumn ="PLAN_DATE"; 
String[] groupCds = {"PLANT_ID","DEMAND_ID","ROUTE_CODE","RESOURCE_CODE"}; 
String[] dataColumns = {"QTY", "HOLIDAY_YN"}; 
String[] measureNms = {}; 
String[] additionalHeaderColumns = {"PLAN_DATE","WEEK","MONTH"}; 
return PivotUtil.pivotData(dataList, headerColumn, groupCds, dataColumns, measureNms, additionalHeaderColumns);
```


---