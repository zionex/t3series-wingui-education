## grid 유효성 검사
**샘플 파일명:**  `Practice07.jsx`


![preview](../images/chapter4/Pratice07_2.png)

### grid 컬럼 유효성 검사 
- criteria
  - required: 필수 입력 여부를 검증합니다.
  - values: 허용되는 값의 목록 내에 있는지 검증합니다.
  - maxLength: 입력된 값의 최대 길이를 검증합니다.
  - min, max: 최소 및 최대 값 제한을 검증합니다.
  - lessThan, lessOrEqualThan, biggerThan, biggerOrEqualThan: 다른 필드 값과 비교하여 크기 제한을 검증합니다.
  - inputChar: 입력된 문자의 유효성을 검증합니다.
  - validFunc: 사용자 정의 함수에 의한 유효성을 검증합니다.


```javascript
 gridView.onValidateColumn = (grid, column, inserting, value, itemIndex) => {
      let error = {};
      if (inserting) {
        return;
      }

      let headerText = getHeaderText(grid, column.name);
      const rules = getColumnValidRules(column.fieldName);

      if (rules !== undefined) {
        rules.forEach((rule) => {
          let valid = rule.valid;
          if (rule.criteria === 'required' && (value === undefined || value === null || value.length <= 0)) {
            error.level = 'warning';
            //MSG_CHECK_VALID_002 : '{{headerText}}는 필수값입니다.'
            error.message = transLangKey('MSG_CHECK_VALID_002', { headerText })
          } else if (rule.criteria === 'values') {
            if (Array.isArray(valid) && !valid.inclues(value)) {
              error.level = 'warning';
              //MSG_CHECK_VALID_001 : '{{headerText}}값은 {{val}}중 하나여야 합니다.'
              error.message = transLangKey('MSG_CHECK_VALID_001', { headerText: headerText, val: valid })
            }
          } else if (rule.criteria === 'maxLength' && (value && value.length > valid)) {
            error.level = 'warning';
            //MSG_CHECK_VALID_003 : '{{headerText}}길이는 {{val}}보다 작아야 합니다.'
            error.message = transLangKey('MSG_CHECK_VALID_003', { headerText: headerText, val: valid })
          }
          // min
          if (rule.criteria === 'min' && (value < valid)) {
            error.level = 'warning';
            //MSG_CHECK_VALID_004 : '{{headerText}}값은 {{val}}보다 커야 합니다.'
            error.message = transLangKey('MSG_CHECK_VALID_004', { headerText: headerText, val: valid })
          } else if (rule.criteria === 'max' && (value > rule.valid)) {
            error.level = 'warning';
            //MSG_CHECK_VALID_005 : '{{headerText}}값은 {{val}}보다 작아야 합니다.'
            error.message = transLangKey('MSG_CHECK_VALID_005', { headerText: headerText, val: valid })
          } else if (rule.criteria === 'lessThan') {
            let val = grid.getValue(itemIndex, valid);
            if (value && value >= val) {
              error.level = 'warning';
              //MSG_CHECK_VALID_005 : '{{headerText}}값은 {{val}}보다 작아야 합니다.'
              error.message = transLangKey('MSG_CHECK_VALID_005', { headerText: headerText, val: valid })
            }
          } else if (rule.criteria === 'lessOrEqualThan') {
            let val = grid.getValue(itemIndex, valid);
            if (value && value > val) {
              let aHeadText = getHeaderText(grid, valid)
              error.level = 'warning';
              //MSG_CHECK_VALID_007 : '{{headerText}}값은 {{val}}값보다 작거나 같아야 합니다.'
              error.message = transLangKey('MSG_CHECK_VALID_007', { headerText: headerText, val: aHeadText })
            }
          } else if (rule.criteria === 'biggerThan') {
            let val = grid.getValue(itemIndex, valid);
            if (value && value <= val) {
              let aHeadText = getHeaderText(grid, valid)
              error.level = 'warning';
              //MSG_CHECK_VALID_008 : '{{headerText}}값은 {{aHeadText}}값보다 커야 합니다.'
              error.message = transLangKey('MSG_CHECK_VALID_008', { headerText: headerText, val: aHeadText })
            }
          } else if (rule.criteria === 'biggerOrEqualThan') {
            let val = grid.getValue(itemIndex, valid);
            if (value && value < val) {
              let aHeadText = getHeaderText(grid, valid)

              error.level = 'warning';
              //MSG_CHECK_VALID_009 : '{{headerText}}값은 {{aHeadText}}값보다 크거나 같아야 합니다.'
              error.message = transLangKey('MSG_CHECK_VALID_009', { headerText: headerText, val: aHeadText })
            }
          } else if (rule.criteria == 'inputChar') {
            err = checkInputCharValid(headerText, valid, value);
            if (err != true) {
              error.level = 'warning';
              error.message = err.message;
            } else {
              error.level = 'ignore'
            }
          } else if (rule.criteria == 'validFunc') {
            let err = valid(grid, column, value, itemIndex);
            if (err != true) {
              error.level = 'warning';
              error.message = err.message;
            }
          }
        });
      }

      return error;
    }
```

```javscript
  {name: "RES_CD", dataType: "text", headerText :"AK_RES_CODE" , visible: true, editable: true, width: 100, validRules: [{ criteria: "required" }] },
  {name: 'SVC_LEV', dataType: 'number', headerText: 'SVC_LEV', visible: true, editable: true, width: 80,  validRules: [{criteria: "min", valid: "50"}, {criteria: "max", valid: "99.9"}]},
  {name: "email", dataType: "text", headerText: "EMAIL", editable: true, width: 100, validRules: [{ criteria: "inputChar", valid: "email" }] },
  {name: "processTimeTpCd", dataType: "text", headerText: "FP_PROCESS_TM_TP_CD", visible: true, editable: true, width: 80, textAlignment: "center", defaultValue: "N",
    validRules: [{ criteria: "validFunc", valid: (grid, column, value, itemIndex) => {
        if (grid.getValue(itemIndex, 'SVC_LEV') > 100 && !value) {
          return { message: transLangKey('FP_MSG_RULE_OF_PROCESS_TM_TP_CD', { headerText: transLangKey('FP_PROCESS_TM_TP_CD') }) };
        } else {
          return true;
        }
      }
    }],
  },
```

### 유효성 검사
```javascript
function saveData() {
    //일괄 유효성 확인
    let log = targetGrid.gridView.validateCells();
    if (log && log.length > 0) {
      showMessage(transLangKey("WARNING"), log[0].message);
      return false;
    }
  }  
```



#### grid 시작일 종료일 체크
```javascript
gridView.onEditRowChanged = function (grid, itemIndex, dataRow, field, oldValue, newValue) {
      let fieldName = dataProvider.getFieldName(field);
      if (fieldName === 'START_DT'){ 
        let enddate =  grid.getValue(itemIndex, "END_DT")
        if(enddate != undefined){
          if(newValue > enddate){
            showMessage(transLangKey("WARNING"), transLangKey('MSG_0007'));
            grid.setValue(itemIndex, "getValue", null);
          }
        }
      }else if (fieldName === 'END_DT'){ //END_DATE
        let stddate =  grid.getValue(itemIndex, "START_DT")
        if(stddate != undefined){
          if(newValue < stddate){
            showMessage(transLangKey("WARNING"), transLangKey('MSG_0007'));
            grid.setValue(itemIndex, "END_DT", null);
          }
        }
      }
    };
```