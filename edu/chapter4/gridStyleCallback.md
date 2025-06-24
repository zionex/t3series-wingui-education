
## styleCallback

### realgrid styleCallback 이벤트와 css 설정
- styleCallback: 스타일을 지정하기 위한 콜백
StyleCallback을 지정하면, 기본 스타일 외의 다른 스타일들이 초기화되어 스타일을 다시 지정해야 합니다. StyleCallback을 통해 지정하는 스타일은 클래스(class) 방식으로만 적용할 수 있습니다. React에서 클래스(class)를 지정할 때, CacheRoute 방식 때문에 다른 화면에 영향을 미칠 수 있으므로, CSS를 작성할 때 #화면아이디 .className {} 형태로 구성해야 합니다. css파일은 보통 화면파일명과 동일하게 설정합니다. 
#화면아이디 는 #contentInner-activeViewId(메뉴ID) 입니다.
```css
#contentInner-UI_PRACTICE_03 .red {
  color: #fa0017;
}
```


- 리얼 그리드의 기본 정렬은 **가운데 정렬** 입니다. 아래 설정들은 dataType 에 따라 정렬 설정을 해주기 위해 wingui 에서 커스텀으로 만든 class 입니다. 
  - **숫자:** 오른쪽 정렬  `column-textAlign-far`
 
  - **텍스트:**  왼쪽 정렬 `column-textAlign-near`
 
  - **수정 가능:**  `editable-column`

- <U>리얼 그리드의 styleCallback 라는 기능을 사용하여 style class 를 추가할때 wingui 커스텀 class가 `초기화` 되므로 타입과 editable 여부에 따라 `재지정` 해줘야합니다.</U>

```javascript
{name: "AGE", dataType: "number", headerText :"AGE" , visible: true, editable: true, width: 100,
    styleCallback: function (grid, dataCell) {
      let ret = {};
      let age = grid.getValue(dataCell.index.itemIndex, "AGE");
      if(age > 40){
        ret.styleName = `${dataCell.dataColumn.styleName} red`;
        ret.editable = true;
      }else{
        ret.editable = false;
      }
      return ret;
    }
  }, 
```
