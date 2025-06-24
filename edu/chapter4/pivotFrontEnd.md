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

- **`zAxios`** : axios 기반으로 만든 서버에 요청을 보내는 비동기 함수입니다.
  - <u>waitOn: false, 옵션을 추가하면 progress 가 나타나지 않습니다.</u>
  ```javascript
  zAxios({
    method: 'post',
    header: { 'content-type': 'application/json' },
    url: baseURI() + 'practice/q3',  // 요청을 보낼 서버 URL
    data: param,
    waitOn: false
  })
  ```
  
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

#### pivot 저장

- **`getUpdatedCells`** : 지정된 행의 수정된 셀 데이터들을 확인한다.


```javascript
function saveData() {
    grid1.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
    if (answer) {
      let changeRowData = [];
      let changes = [];

      changes = changes.concat(
        grid1.dataProvider.getAllStateRows().created,
        grid1.dataProvider.getAllStateRows().updated,
        grid1.dataProvider.getAllStateRows().deleted,
        grid1.dataProvider.getAllStateRows().createAndDeleted
      );

      changes.forEach(function (row) {
        let data = grid1.dataProvider.getJsonRow(row);
        changeRowData.push(data);
      });

      if (changeRowData.length === 0) {
        //저장 할 내용이 없습니다.
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
      } else {
        if (answer) {
          let arrUpdateData = [];
          if(changes.length > 0){
            changes.forEach(function (row) {
              let rowData = grid1.dataProvider.getJsonRow(row);
              const updatedCells = grid1.dataProvider.getUpdatedCells([row]);
              let headerGrps = [];
              updatedCells.map(cellRow => {
                const cells = cellRow.updatedCells
                cells.map(field => {
                  let date = field.fieldName;
                  if(headerGrps.indexOf(date) == -1) {
                    headerGrps.push(date);
                  }
                });
              });

              headerGrps.map(field => {
                let updData = {
                  PLANT_ID: rowData['PLANT_ID'],
                  DEMAND_ID: rowData['DEMAND_ID'],
                  ROUTE_CODE: rowData['ROUTE_CODE'],
                  RESOURCE_CODE: rowData['RESOURCE_CODE'],
                  BASE_DATE: field,
                  QTY: rowData[field],
                }; 
                arrUpdateData.push(updData);
              });
            });
          }
          console.log("arrUpdateData", arrUpdateData);
        }
      }
    }
    });
  }
```