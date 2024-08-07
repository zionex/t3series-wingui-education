import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { ContentInner, ViewPath, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridExcelExportButton, GridExcelImportButton,
  GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, PopupDialog, GridCnt, useViewStore, useContentStore, useStyles, zAxios, useUserStore, WorkArea
} from "@wingui/common/imports";

let grid1Items = [
  {name: "PLANT_ID", dataType: "text", headerText :"PLANT_ID" , visible: true, editable: false, width: 100},
  {name: "DEMAND_ID", dataType: "text", headerText :"DEMAND_ID" , visible: true, editable: false, width: 100},
  {name: "ROUTE_CODE", dataType: "text", headerText :"ROUTE_CODE" , visible: true, editable: false, width: 100},
  {name: "ROUTE_NAME", dataType: "text", headerText :"ROUTE_NAME" , visible: true, editable: false, width: 100},
  {name: "RESOURCE_CODE", dataType: "text", headerText :"RESOURCE_CODE" , visible: true, editable: false, width: 100},
  {name: "RESOURCE_NAME", dataType: "text", headerText :"RESOURCE_NAME" , visible: true, editable: false, width: 100},
];

//Pivot 예제
function Practice05() {
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

  const beforeGrid1Create = (gridObj, gridView, dataProvider) => {
    gridView.dynamic = true;
  };

  const afterGrid1Create = (gridObj, gridView, dataProvider) => {
    gridView.setDisplayOptions({ fitStyle: 'even' });
    setVisibleProps(gridObj, true, true, true);
    setGrid1(gridObj);
    gridView.setFixedOptions({ colCount: 4 });
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
      url: baseURI() + 'practice/q3',
      data: param
    })
    .then(function (res) {
      if (res.status === HTTP_STATUS.SUCCESS) {
        makeCrossTabFieldsAndColumns(res.data.header);
        setCrossTabGridData(res.data.header, res.data.data);
      }
    })
    .catch(function (err) {
      console.log(err);
    })
  };

  
  function makeCrossTabFieldsAndColumns(dateHeaders) {
    let dynamicCols = [];
    dateHeaders.forEach( dateHeader => {
      let dateHeaderSplit = dateHeader.split("-");
      const date = new Date(dateHeaderSplit[0], dateHeaderSplit[1]-1, dateHeaderSplit[2]);
      dynamicCols.push(
        { name: dateHeader, 
          dataType: 'number',
          headerText: date.format("yyyy/MM/dd"),
          visible: true,
          editable: true, 
          width: 80,
        },
      );
    });   
    grid1.addGridItems(grid1Items.concat(dynamicCols), true);
  }

  function setCrossTabGridData(dateHeaders, data) {
    let jsonData = [];
    data.map(function (dataRow) {
      let obj = {};
      obj = Object.assign(obj, dataRow);
      dateHeaders.map(function (val, idx) {
        obj[val] = dataRow["QTY"][idx];
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

  // 삭제
  function deleteData(grid1, deleteRows) {
    if (deleteRows.length > 0) {
      console.log("deleteData")
    }
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
            <GridDeleteRowButton grid="grid1" onDelete={deleteData}></GridDeleteRowButton>
            <GridSaveButton
              grid="grid1"
              onClick={() => {
                saveData();
              }}
            />
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

export default Practice05;