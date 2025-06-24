## 세로 셀병합
- mergeRule.criteria속성에 이전 행의 셀과 병합할 수식을 설정합니다.


```javascript
{ name: "SITE_GROUP", dataType: "group", orientation: "horizontal", headerText: "SITE",
    childs: [
      { name: "PLANT_CD", dataType: "text", headerText :"PLANT_CD" , visible: true, editable: false, width: 50, textAlignment: "center", mergeRule: { criteria: 'values["PLANT_CD"]' } },
      { name: "PLANT_NM", dataType: "text", headerText :"PLANT_NM" , visible: true, editable: false, width: 50, mergeRule: { criteria: 'values["PLANT_CD"]' } },
    ]
  },
  { name: "ITEM_GROUP", dataType: "group", orientation: "horizontal", headerText: "ITEM",
    childs: [
      { name: "ITEM_TP", dataType: "text", headerText :"ITEM_TP" , visible: true, editable: false, width: 60, textAlignment: "center", mergeRule: { criteria: 'values["PLANT_CD"] + values["ITEM_TP"] + values["ITEM_CD"]' } },
      { name: "ITEM_CD", dataType: "text", headerText :"ITEM_CD" , visible: true, editable: false, width: 80, textAlignment: "center",  styleName: "link-column-htns", mergeRule: { criteria: 'values["PLANT_CD"] + values["ITEM_TP"] + values["ITEM_CD"]' } },
      { name: "ITEM_NM", dataType: "text", headerText :"ITEM_NM" , visible: true, editable: false, width: 120,  styleName: "link-column-htns", mergeRule: { criteria: 'values["PLANT_CD"] + values["ITEM_TP"] + values["ITEM_CD"]' } },
    ]
  },
```
- PLANT_CD, PLANT_NM, ITEM_TP : PLANT_CD 값이 일치할 시 병합
- ITEM_CD, ITEM_NM, ITEM_TP : PLANT_CD, ITEM_TP, ITEM_CD 값이 일치할 시 병합

## 병합시 일괄 수정
- 컬럼의 mergeEdit 속성으로 병합된 셀을 일괄로 수정할 수 있습니다.

```javascript
      { name: "PLANT_CD", dataType: "text", headerText :"PLANT_CD" , visible: true, editable: false, width: 50, textAlignment: "center", mergeRule: { criteria: 'values["PLANT_CD"]' }, mergeEdit: true }
```
- 병합 일괄변경 시 아래 옵션이 필수적으로 적용되어 있어야 mergeEdit 기능을 사용할 수 있습니다.

```javascript
gridView.editOptions.commitByCell = true;
```
- 병합 내부 포커스 숨기기

```javascript
gridView.displayOptions.showInnerFocus = false;
```

## 가로 셀 병합
- layout.spanCallback을 사용하여 가로 방향으로 셀을 병합할 수 있습니다.
- 특정 컬럼에 spanCallback을 적용해서 동적으로 사용하거나 일괄로 모든행에 적용시킬 수 있습니다.
동적으로 사용 시 내부에 조건은 직접 설정해야하며 반환된 값 만큼 가로방향으로 셀이 병합됩니다.
이때 데이터는 병합되는 첫 번째 셀의 데이터가 출력됩니다.
(값을 병합되는 다른 필드의 값과 연산하거나 합쳐서 출력할 수는 없습니다.)

```javascript
gridView.layoutByColumn("KorName").spanCallback = function (grid, layout, itemIndex) {
    var value = grid.getValue(itemIndex, "Gender")
    if(value == "남"){
        return 2; //가로 병합 수
    }
    
    return 1;
};
```
