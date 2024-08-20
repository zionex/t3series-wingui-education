import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { ContentInner, ViewPath, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridExcelExportButton, GridExcelImportButton,
  GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, PopupDialog, GridCnt, useViewStore, useContentStore, useStyles, zAxios, useUserStore, WorkArea
} from "@wingui/common/imports";
import PopName  from './PopName';

let grid1Items = [
  { name: "dataGroup", dataType: "group", orientation: "horizontal", headerText: "인적사항", headerVisible: true, hideChildHeaders: false,
    childs: [
      {name: "KORNAME", dataType: "text", headerText :"KORNAME" , visible: true, editable: false, width: 100, button: "action", buttonVisibility: "always"},
      {name: "GENDER", dataType: "text", headerText :"GENDER" , visible: true, editable: true, width: 100, useDropdown: true, lookupDisplay: true},
    ]
  },
  {name: "AGE", dataType: "number", headerText :"AGE" , visible: true, editable: true, width: 100 },
  {name: "PHONE", dataType: "text", headerText :"PHONE" , visible: true, editable: true, width: 100},
  {name: "PRODUCTID", dataType: "text", headerText :"PRODUCTID" , visible: false, editable: true, width: 100},
  {name: "KORCOUNTRY", dataType: "text", headerText :"KORCOUNTRY" , visible: false, editable: true, width: 100},
  {name: "ORDERDATE", dataType: "datetime", headerText :"ORDERDATE" , visible: true, editable: true, width: 100, format: "yyyy-MM-dd"},
  {name: "ACTIVE", dataType: "boolean", headerText :"ACTIVE" , visible: true, editable: true, width: 100},
];

function Practice06() {
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
  
  // popup
  const [namePopupOpen, setNamePopupOpen] = useState(false);
  const [namePopupOpen2, setNamePopupOpen2] = useState(false);
  

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

    //grid button click
    gridView.onCellButtonClicked = (grid, itemIndex, column) => {
      if (column.fieldName === "KORNAME") {
        setNamePopupOpen(true);
      }
    };
  };

  // grid1 조회
  const loadData = () => {
    let data = [
      {
        KORNAME: "박OO",
        GENDER: "남",
        AGE: "71",
        PHONE: "(025)6563-2802",
        PRODUCTID: "198160731-00008",
        KORCOUNTRY: "모잠비크",
        ORDERDATE: "2021-01-16",
        ACTIVE: "Y",
      },
      {
        KORNAME: "조OO",
        GENDER: "남",
        AGE: "62",
        PHONE: "(093)8809-8696",
        PRODUCTID: "571215854-00001",
        KORCOUNTRY: "캐나다",
        ORDERDATE: "2019-07-29",
        ACTIVE: true,
      },
      {
        KORNAME: "김OO",
        GENDER: "남",
        AGE: "45",
        PHONE: "(010)1234-5678",
        PRODUCTID: "123456789-00003",
        KORCOUNTRY: "한국",
        ORDERDATE: "2020-05-23",
        ACTIVE: false,
      },
      {
        KORNAME: "이OO",
        GENDER: "여",
        AGE: "32",
        PHONE: "(010)8765-4321",
        PRODUCTID: "987654321-00004",
        KORCOUNTRY: "미국",
        ORDERDATE: "2020-11-11",
        ACTIVE: "Y",
      },
      {
        KORNAME: "한OO",
        GENDER: "여",
        AGE: "29",
        PHONE: "(010)5555-6666",
        PRODUCTID: "55556666-00005",
        KORCOUNTRY: "호주",
        ORDERDATE: "2021-03-14",
        ACTIVE: "Y",
      },
      {
        KORNAME: "장OO",
        GENDER: "남",
        AGE: "39",
        PHONE: "(010)7777-8888",
        PRODUCTID: "77778888-00006",
        KORCOUNTRY: "영국",
        ORDERDATE: "2018-09-17",
        ACTIVE: "N",
      },
      {
        KORNAME: "송OO",
        GENDER: "여",
        AGE: "35",
        PHONE: "(010)9999-0000",
        PRODUCTID: "99990000-00007",
        KORCOUNTRY: "프랑스",
        ORDERDATE: "2021-06-21",
        ACTIVE: "N",
      }
    ]
    ;
     
    grid1.dataProvider.fillJsonData(data);
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
  
  const confirmNamePopup = (dataRows) => {
    let itemIndex = grid1.gridView.getCurrent().itemIndex;
    grid1.gridView.beginUpdateRow();  
    grid1.gridView.setValue(itemIndex, "KORNAME", dataRows[0].NAME);
  }

  const confirmNamePopup2 = (dataRows) => {
    setValue('action', dataRows[0].NAME);
  }

  return (
    <>
    <ContentInner>
      <SearchArea>
        <InputField type="select" name="gender" control={control} label={transLangKey('GENDER')} options={genderOption} />
        <InputField type="datetime" name="startDt" control={control} label={transLangKey('START_DT')} dateformat="yyyy-MM-dd"/>
        <InputField type="action" name="action" label={transLangKey("팝업")} control={control} onClick={()=> setNamePopupOpen2(true)}><Icon.Search /></InputField>
      </SearchArea>
      <WorkArea>
        <ButtonArea>
          <LeftButtonArea>
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
    {namePopupOpen && <PopName open={namePopupOpen} onClose={() => setNamePopupOpen(false)} confirm={confirmNamePopup} />}
    {namePopupOpen2 && <PopName open={namePopupOpen2} onClose={() => setNamePopupOpen2(false)} confirm={confirmNamePopup2} />}
    </>
  );
}

export default Practice06;