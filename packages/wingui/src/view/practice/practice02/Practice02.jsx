import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { ContentInner, ViewPath, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridExcelExportButton, GridExcelImportButton,
  GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, PopupDialog, GridCnt, useViewStore, useContentStore, useStyles, zAxios, useUserStore, WorkArea, CommonButton, SplitPanel
} from "@wingui/common/imports";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";

let grid1Items = [
  {name: "KORNAME", dataType: "text", headerText :"KORNAME" , visible: true, editable: false, width: 100},
  {name: "GENDER", dataType: "text", headerText :"GENDER" , visible: true, editable: true, width: 100, useDropdown: true, lookupDisplay: true},
  {name: "AGE", dataType: "number", headerText :"AGE" , visible: true, editable: true, width: 100},
  {name: "PHONE", dataType: "text", headerText :"PHONE" , visible: true, editable: true, width: 100},
  {name: "PRODUCTID", dataType: "text", headerText :"PRODUCTID" , visible: false, editable: true, width: 100},
  {name: "KORCOUNTRY", dataType: "text", headerText :"KORCOUNTRY" , visible: false, editable: true, width: 100},
  {name: "ORDERDATE", dataType: "datetime", headerText :"ORDERDATE" , visible: true, editable: true, width: 100, format: "yyyy-MM-dd"},
  {name: "ACTIVE", dataType: "boolean", headerText :"ACTIVE" , visible: true, editable: true, width: 100},
];

function Practice01() {
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
          {NAME: "전체", CODE: "ALL"},
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
  const loadData = (type = 'sp') => {
    let param = {
      p_GENDOR : getValues('gender'),
      P_START_DT : getValues('startDt'),
    };    

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + (type === 'sp' ? 'practice/q1' : 'practice/q2'),
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
    console.log("saveData")
  }  

  // 삭제
  function deleteData(targetGrid, deleteRows) {
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
            <ButtonGroup variant="outlined">
              <CommonButton type="text" title={transLangKey("SP 호출")} startIcon={<SyncIcon />} onClick={() => { loadData('sp') }}></CommonButton>
              <CommonButton type="text" title={transLangKey("쿼리 호출")} startIcon={<SyncIcon />} onClick={() => { loadData('query') }}></CommonButton>
            </ButtonGroup>
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

export default Practice01;