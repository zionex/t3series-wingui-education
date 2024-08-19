## Pivot Grid
**샘플 파일명:**  `Practice05.jsx`, `PracticeController.java`

>이 샘플에서는 피벗 데이터를 가공하여 그리드 형태로 구현하는 방법을 보여줍니다.

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
**3. 피벗 데이터 구성** 그룹화된 각 데이터를 순회하며, 헤더에 맞게 데이터를 재배치합니다. 그룹 내 각 데이터의 `PLAN_DATE`를 기준으로 `QTY` 값을 배열에 배치하고, 이를 다시 맵에 추가합니다.

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

**4. 결과 반환** 
마지막으로, 생성된 헤더와 피벗 데이터가 담긴 맵을 반환합니다. 이 결과는 프론트엔드나 다른 시스템에서 사용하기 위한 최종 데이터 구조가 됩니다.


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


---

### font-end  

이 자료에서는 주어진 React 소스를 통해 그리드 데이터를 조회하고, 피벗 테이블을 생성 및 표시하는 방법을 설명합니다. 이 코드의 주요 목적은 데이터를 서버로부터 불러와 동적으로 컬럼을 생성하고, 그리드에 데이터를 표시하는 것입니다.

pivot Grid는 Context Menu의 레이아웃 저장/삭제 기능을 사용하지 않기 때문에 `dynamic={true}` 를 설정한다.
```
 <BaseGrid id="grid1" items={grid1Items} afterGridCreate={afterGrid1Create} dynamic={true}/>
```

1. 데이터 조회 (`loadData` 함수)** `loadData` 함수는 서버에서 데이터를 조회하는 역할을 합니다. 

```javascript
const loadData = () => {
  let param = {
    p_GENDOR : getValues('gender'),  // 성별 선택값
    P_START_DT : getValues('startDt'),  // 시작일 선택값
  };

  zAxios({
    method: 'post',
    header: { 'content-type': 'application/json' },
    url: baseURI() + 'practice/q3',  // 요청을 보낼 서버 URL
    data: param
  })
  .then(function (res) {
    if (res.status === HTTP_STATUS.SUCCESS) {  // 서버 응답이 성공적일 경우
      makeCrossTabFieldsAndColumns(res.data.header);  // 동적 컬럼 생성 함수 호출
      setCrossTabGridData(res.data.header, res.data.data);  // 그리드에 데이터 설정
    }
  })
  .catch(function (err) {
    console.log(err);  // 에러 발생 시 로그 출력
  });
};
```
 
- **`zAxios`** : axiso 기반으로 만든 서버에 요청을 보내는 비동기 함수입니다.
  
2. 동적 컬럼 생성 (`makeCrossTabFieldsAndColumns` 함수)** 
이 함수는 서버로부터 받아온 헤더 데이터를 기반으로 그리드에 동적 컬럼을 추가합니다. 각 날짜별로 새로운 컬럼을 생성하고, 그 컬럼을 그리드에 추가합니다.


```javascript
function makeCrossTabFieldsAndColumns(dateHeaders) {
  let dynamicCols = [];
  dateHeaders.forEach(dateHeader => {
    let dateHeaderSplit = dateHeader.split("-");
    const date = new Date(dateHeaderSplit[0], dateHeaderSplit[1]-1, dateHeaderSplit[2]);
    dynamicCols.push(
      { 
        name: dateHeader, 
        dataType: 'number',
        headerText: date.format("yyyy/MM/dd"),
        visible: true,
        editable: true, 
        width: 80,
      },
    );
  });   
  grid1.addGridItems(grid1Items.concat(dynamicCols), true);  // 기존 컬럼에 동적 컬럼을 추가
}
```
 
- **`dateHeaders`** : 서버로부터 받아온 날짜별 헤더 리스트입니다.
 
- **`dynamicCols`** : 동적으로 생성된 컬럼 객체 배열입니다.
 
- **`addGridItems`** : 기존의 컬럼 배열에 동적으로 생성된 컬럼을 추가합니다.
3. 데이터 그리드에 설정 (`setCrossTabGridData` 함수)** 
이 함수는 동적으로 생성된 컬럼과 데이터를 그리드에 설정합니다. 서버로부터 받은 데이터 배열을 가공하여 그리드에 채웁니다.


```javascript
function setCrossTabGridData(dateHeaders, data) {
  let jsonData = [];
  data.map(function (dataRow) {
    let obj = {};
    obj = Object.assign(obj, dataRow);  // 데이터 행을 복사하여 객체에 할당
    dateHeaders.map(function (val, idx) {
      obj[val] = dataRow["QTY"][idx];  // 날짜별 데이터를 해당 컬럼에 할당
    });
    jsonData.push(obj);  // 가공된 데이터를 배열에 추가
  });

  grid1.dataProvider.fillJsonData(jsonData);  // 가공된 데이터를 그리드에 채움
}
```
 
