import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { ContentInner, ViewPath, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridExcelExportButton, GridExcelImportButton,
  GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, PopupDialog, GridCnt, useViewStore, useContentStore, useStyles, zAxios, useUserStore, WorkArea
} from "@wingui/common/imports";

let grid1Items = [
  {name: "PLANT_ID", dataType: "text", headerText :"PLANT_ID" , visible: true, editable: false, width: 100, mergeRule: { criteria: "value" } },
  {name: "DEMAND_ID", dataType: "text", headerText :"DEMAND_ID" , visible: true, editable: false, width: 150, mergeRule: { criteria: "prevvalues + value" }},
  {name: "ROUTE_CODE", dataType: "text", headerText :"ROUTE_CODE" , visible: true, editable: false, width: 100, mergeRule: { criteria: "prevvalues + value" }},
  {name: "ROUTE_NAME", dataType: "text", headerText :"ROUTE_NAME" , visible: true, editable: false, width: 100, mergeRule: { criteria: "prevvalues + value" }},
  {name: "RESOURCE_CODE", dataType: "text", headerText :"RESOURCE_CODE" , visible: true, editable: false, width: 100, mergeRule: { criteria: "prevvalues + value" }},
  {name: "RESOURCE_NAME", dataType: "text", headerText :"RESOURCE_NAME" , visible: true, editable: false, width: 100, mergeRule: { criteria: "prevvalues + value" }},
];

//Pivot 예제
function Practice10() {
  const activeViewId = getActiveViewId();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [
    state.viewData,
    state.getViewInfo,
    state.setViewInfo,
  ]);

  // SearchArea
  const [genderOption, setGenderOption] = useState([]);

  // grid
  const [grid1, setGrid1] = useState(null);

  // default
  const { control, getValues, setValue, watch, reset } = useForm({
    defaultValues: {
      plantCd: [],
      startDt: new Date(),
    },
  });

   // globalButtons
  const globalButtons = [
    { name: "help", docUrl: '/edu/chapter4/pivot그리드.html', visible: true, disable: false },
    { name: 'search', action: (e) => { loadData() }, visible: true, disable: false },
    { name: "refresh", action: (e) => { refresh() }, visible: true, disable: false },
  ];

  useEffect(() => {
    loadCombo();
  }, []);

  useEffect(() => {
    setViewInfo(activeViewId, "globalButtons", globalButtons);
    
    if(grid1){
      loadGridCombo(); 
      loadData();
    }
  }, [grid1]);

  const refresh = () => {
    grid1.gridView.refresh();
    grid1.dataProvider.clearRows();
    reset();
    loadCombo();
  };
  
  const loadCombo = async () => {
    const genderArr = [
      {label: "전체", value: "ALL"},
      {label: "남자", value: "남"},
      {label: "여자", value: "여"},
    ]

    setGenderOption(genderArr);
    setValue("gender", genderArr.length > 0 ? genderArr[0].value : "");
  };

  const loadGridCombo = async () => {
  };

  const afterGrid1Create = (gridObj, gridView, dataProvider) => {
    gridView.setDisplayOptions({ fitStyle: 'even' });
    setVisibleProps(gridObj, true, true, false);
    setGrid1(gridObj);
    gridView.setFixedOptions({ colCount: 6 });
  };

  // grid1 조회
  const loadData = () => {
    let param = {
      p_GENDOR : getValues('gender'),
      P_START_DT : getValues('startDt'),
    };

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'practice/q10',
      data: param
    })
    .then(function (res) {
      if (res.status === HTTP_STATUS.SUCCESS) {
        makeCrossTabFieldsAndColumns(res.data.headerMap);
        setCrossTabGridData(res.data.header, res.data.data);
      }
    })
    .catch(function (err) {
      console.log(err);
    })
  };

  
    function makeCrossTabFieldsAndColumns(dateHeaderMap) {
    let dynamicCols = [];  // 동적으로 생성될 컬럼 그룹들을 저장할 배열

    // 1. PLAN_DATE에서 'YYYY-MM'만 추출해서 중복을 제거한 월 그룹 배열 생성 (ex: ['2025-07', '2025-08', '2025-09'])
    let monthGroups = [...new Set(dateHeaderMap.map(item => item.PLAN_DATE.slice(0, 7)))];

    // 2. 월별로 그룹화된 컬럼들을 구성 ( ex. 2025-07 그룹컬럼 생성 후, 해당월에 포함되는 날짜를["2025-07-03", ] child에 push하는 방식)
    monthGroups.forEach((weekGroup, index) => {
      // 각 월 그룹에 해당하는 상위 그룹 컬럼 정의
      let weekCol = {
        key: weekGroup,                                // 고유 키
        name: weekGroup + '_GROUP',                    // 컬럼 이름
        dataType: 'group',                             // 그룹 타입
        headerText: weekGroup,                         // 헤더에 표시될 텍스트 (예: 2025-07)
        visible: true,
        depth: 2,                                      // 그룹 깊이
        orientation: 'horizontal',                     // 그룹 방향
        childs: []                                     // 이 그룹에 포함될 하위 컬럼들
      };

      // 3. 현재 월에 해당하는 날짜별로 컬럼 추가
      dateHeaderMap.forEach(item => {
        if (item.PLAN_DATE.slice(0, 7) === weekGroup) {
          let dateHeaderSplit = item.PLAN_DATE.split("-");
          const date = new Date(dateHeaderSplit[0], dateHeaderSplit[1] - 1, dateHeaderSplit[2]);

          // 4. 날짜별로 3개의 컬럼을 생성해서 그룹에 추가
          weekCol.childs.push(
            // 4-1. 실제 표시될 수량(QTY) 컬럼
            {
              name: item.PLAN_DATE + "_QTY",            // 예: 2025-07-03_QTY
              dataType: 'number',
              visible: true,
              width: 80,
              header: {
                text: date.format("MM-dd"),             // 헤더에 MM-dd 형식으로 날짜 표시
                styleName: item.HOLIDAY_YN == 'Y' ? 'holid-text' : '', // 휴일이면 스타일 적용
              },
              // 셀에 동적으로 스타일을 적용하는 콜백 함수
              styleCallback: function (grid, dataCell) {
                let ret = {};
                let colcd = grid.getValue(dataCell.index.itemIndex, item.PLAN_DATE + "_COL_CD");
                let edityn = grid.getValue(dataCell.index.itemIndex, item.PLAN_DATE + "_EDIT_YN");

                // 편집 가능 여부와 배경 스타일 설정
                if (edityn == 'Y') {
                  ret.styleName = `${dataCell.dataColumn.styleName} editable-column`;
                  ret.editable = true;
                } else {
                  const colorKey = typeof colcd === 'string' ? colcd.replaceAll("#", "") : '';
                  ret.styleName = `${dataCell.dataColumn.styleName} ` + grid.dynamicCSSSelector({ background: colcd }, `QTY_COLOR_${colorKey}`);
                  ret.editable = false;
                }

                // 값이 음수이면 특수 스타일 추가
                if (Number(dataCell.value) && Number(dataCell.value) < 0) {
                  ret.styleName += ` cell-minus `;
                }

                return ret;
              }
            },
            // 4-2. 컬럼 색상 코드 (보이진 않음)
            { name: item.PLAN_DATE + "_COL_CD", dataType: 'text', headerText: date.format("yyyy/MM/dd"), visible: false, editable: false, width: 80 },
            // 4-3. 편집 가능 여부 (보이진 않음)
            { name: item.PLAN_DATE + "_EDIT_YN", dataType: 'text', headerText: date.format("yyyy/MM/dd"), visible: false, editable: false, width: 80 }
          );
        }
      });

      // 구성된 월별 컬럼 그룹을 최종 배열에 추가
      dynamicCols.push(weekCol);
    });
    //console.log(dynamicCols)
    // 5. 기존 컬럼들과 새로 생성된 동적 컬럼들을 결합하여 그리드에 추가
    grid1.addGridItems(grid1Items.concat(dynamicCols), true);
  }

  function setCrossTabGridData(dateHeaders, data) {
    let jsonData = [];
    data.map(function (dataRow) {
      let obj = {};
      obj = Object.assign(obj, dataRow);
      dateHeaders.map(function (val, idx) {
        obj[val+"_QTY"] = dataRow["QTY"][idx];
        obj[val+"_COL_CD"] = dataRow["COL_CD"][idx];
        obj[val+"_EDIT_YN"] = dataRow["EDIT_YN"][idx];
      });
      jsonData.push(obj);
    });

    grid1.dataProvider.fillJsonData(jsonData);
  }

  // 저장
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

  return (
    <ContentInner>
      <SearchArea>
        <InputField type="select" name="gender" control={control} label={transLangKey('GENDER')} options={genderOption} />
        <InputField type="datetime" name="startDt" control={control} label={transLangKey('START_DT')} dateformat="yyyy-MM-dd"/>
      </SearchArea>
      <WorkArea>
        <ButtonArea>
          <LeftButtonArea>
          </LeftButtonArea>
          <RightButtonArea>
            <GridSaveButton grid="grid1" onClick={() => { saveData();}} />
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <Box style={{ height: "100%" }}>
            <BaseGrid id="grid1" items={grid1Items} afterGridCreate={afterGrid1Create} dynamic={true}/>
          </Box>
        </ResultArea>
      </WorkArea>
    </ContentInner>
  );
}

export default Practice10;