import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { ContentInner, ViewPath, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridExcelExportButton, GridExcelImportButton,
  GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, PopupDialog, GridCnt, useViewStore, useContentStore, useStyles, zAxios, useUserStore, WorkArea
} from "@wingui/common/imports";

let grid1Items = [
  {name: "ID", dataType: "text", headerText :"ID" , visible: true, editable: false, width: 100},
  {name: "KORNAME", dataType: "text", headerText :"KORNAME" , visible: true, editable: false, width: 100},
  {name: "GENDER", dataType: "text", headerText :"GENDER" , visible: true, editable: true, width: 100, useDropdown: true, lookupDisplay: true},
  {name: "AGE", dataType: "number", headerText :"AGE" , visible: true, editable: true, width: 100},
  {name: "PHONE", dataType: "text", headerText :"PHONE" , visible: true, editable: true, width: 100},
  {name: "PRODUCTID", dataType: "text", headerText :"PRODUCTID" , visible: false, editable: true, width: 100},
  {name: "KORCOUNTRY", dataType: "text", headerText :"KORCOUNTRY" , visible: false, editable: true, width: 100},
  {name: "ORDERDATE", dataType: "datetime", headerText :"ORDERDATE" , visible: true, editable: true, width: 100, format: "yyyy-MM-dd"},
  {name: "ACTIVE", dataType: "boolean", headerText :"ACTIVE" , visible: true, editable: true, width: 100},
];

//CRUD 예제
function Practice04() {
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
    grid1.gridView.setColumnProperty(
      "GENDER",
      "lookupData",
      {
        value: "CODE",
        label: "NAME",
        list: [
          {NAME: "전체", vaCODElue: "ALL"},
          {NAME: "남자", CODE: "남"},
          {NAME: "여자", CODE: "여"},
        ]
      }
    );
  };

  const afterGrid1Create = (gridObj, gridView, dataProvider) => {
    gridView.setDisplayOptions({ fitStyle: 'even' });
    setVisibleProps(gridObj, true, true, true);
    setGrid1(gridObj);
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
      url: baseURI() + 'practice/q1',
      data: param
    })
    .then(function (res) {
      if (res.status === HTTP_STATUS.SUCCESS) {
        grid1.dataProvider.fillJsonData(res.data);
      }
    })
    .catch(function (err) {
      console.log(err);
    })
  };

  // 저장
  function saveData() {
    grid1.gridView.commit(true);
    const invalids = grid1.gridView.validateCells(null, false);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(
          grid1.dataProvider.getAllStateRows().created,
          grid1.dataProvider.getAllStateRows().updated,
          grid1.dataProvider.getAllStateRows().deleted,
          grid1.dataProvider.getAllStateRows().createAndDeleted
        );

        let changeRowData = [];
        changes.forEach(function (row) {
          changeRowData.push(grid1.dataProvider.getOutputRow({booleanFormat: 'N:Y'}, row));
        });

        let valid = true;
        if(invalids && invalids.length> 0){
          changeRowData.forEach(function (rowData) {
            if (!rowData.PLNT_CD || !rowData.RES_CD || !rowData.ITEM_CD || !rowData.START_DT || !rowData.END_DT || !rowData.LOAD_RATE ) {
              valid = false;
            }
          });
        }

        if (!valid) {
          showMessage(transLangKey("ALERT"), transLangKey("MSG_0006"), { close: false });
          return false;
        }

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {                       
          zAxios({
            method: 'post',
            headers: { 'content-type': 'application/json' },
            url: baseURI() + 'practice/s1',
            data: changeRowData
          })
          .then(function () {
            grid1.gridView.hideToast();
            loadData();
          })
          .catch(function (e) {
            console.error(e);
          });
        }
      }
    });
  }  

  // 삭제
  function deleteData(targetGrid, deleteRows) {
    if (deleteRows.length > 0) {
      zAxios({
        method: 'post',
        url: baseURI() + 'practice/d1',
        headers: { 'content-type': 'application/json' },
        data: deleteRows
      })
      .then(function (response) {
        if (response.status === HTTP_STATUS.SUCCESS) {
          grid1.dataProvider.removeRows(grid1.gridView.getCheckedRows());
          loadData();
        }
      })
      .catch(function (err) {
        console.log(err);
      })
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
            <GridExcelImportButton type="icon" grid="grid1" />
            <GridExcelExportButton type="icon" grid="grid1"/>
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton grid="grid1"></GridAddRowButton>
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
            <BaseGrid id="grid1" items={grid1Items} afterGridCreate={afterGrid1Create} />
          </Box>
        </ResultArea>
      </WorkArea>
    </ContentInner>
  );
}

export default Practice04;