## 화면표시값변경 displayCallback

- 리얼그리드는 실제 데이터 값과 상관없이 화면에 표시되는 값을 변경할 수 있는 몇가지 기능을 제공합니다.
이 기능은 화면에 표시되는 값만 변경되는 것이지 실제 데이터 값은 변경되지 않습니다.

`※ displayCallback안에서 시간이 오래 걸리는 연산이나 setValue()등 값을 변경하는 행위를 하면 안됩니다.`

1. 정규식을 사용하여 변경
2. displayCallback을 사용하여 변경
3. 코드값을 라벨값으로 변경하여 보여줄 수 있는 lookupDisplay를 사용하여 변경

### 정규식
```javascript
{
  "name": "OrderID",
  "fieldName": "OrderID",
  "width": "150",
  "headerText": "정규식", 
  "textFormat": "([0-9]{4})([0-9]{4})([0-9]{4})([0-9]{4});$1-$2-$3-$4"
}
```


### displayCallback
```javascript
{
  "name": "OrderID",
  "fieldName": "OrderID",
  "width": "150",
  "headerText": "displayCallback", 
  "displayCallback": function(grid, index, value) {
    var tmp = '';
    tmp += value.substr(0, 4);
    tmp += '-';
    tmp += value.substr(4, 4);
    tmp += '-****-****';
    return tmp;
  }
}
```