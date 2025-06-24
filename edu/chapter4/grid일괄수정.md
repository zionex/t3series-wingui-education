## 일괄수정

- beginUpdate()를 호출하면 endUpdate()가 호출될 때까지 DataProvider에 변경이 이루어질 때마다 관련 이벤트들이 발생하지 않고, endUpdate() 내에서 갱신 요구 이벤트가 한 번 발생하게 된다. 예를 들어 LocalDataProvider addRow, DataProvider updateRow등을 연속해서 많이 호출한다거나, LocalDataProvider addRows, LocalDataProvider updateRows등으로 수백건 이상의 많은 행을 전달할 때, beginUpdate()와 endUpdate()로 감싸서 호출하면 개별 행 처리에 대한 이벤트가 발생하지 않게된다. beginUpdate/endUpdate는 중첩될 수 있는데 쌍으로 개수를 맞춰야 한다. 가장 바깥의 endUpdate()가 호출될 때 갱신 요구 이벤트가 그리드 등에 전달된다.

- beginUpdate() 를 호출하면 endUpdate()가 호출되기 전 까지는 변경 처리 호출이 지연됩니다.

[관련 문서](https://help.realgrid.com/api/GridBase/beginUpdate/)


### 일괄 데이터 변경 샘플
```javascript
    dataProvider.beginUpdate();
    try{
        for(let i = 0; i < dataProvider.getRowCount(); i++) {
            dataProvider.setValue(i, 'QTY', 0);
        }
    }
    dataProvider.endUpdate();

```