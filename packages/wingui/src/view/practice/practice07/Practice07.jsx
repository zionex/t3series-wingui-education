import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { ContentInner, ViewPath, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridExcelExportButton, GridExcelImportButton,
  GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, PopupDialog, GridCnt, useViewStore, useContentStore, useStyles, zAxios, useUserStore, WorkArea
} from "@wingui/common/imports";
import { onErrorInput } from "@zionex/wingui-core/utils/common";


let grid1Items = [
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
  {name: "START_DT", dataType: "datetime", headerText: "START_DT", editable: true, width: 100, format: "yyyy-MM-dd" },
  {name: "END_DT", dataType: "datetime", headerText: "END_DT", editable: true, width: 100, format: "yyyy-MM-dd" },
];

function Practice07() {
  const activeViewId = getActiveViewId();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [
    state.viewData,
    state.getViewInfo,
    state.setViewInfo,
  ]);

  // SearchArea
  const [genderOption, setGenderOption] = useState([]);
  const [moduleCdOption, setModuleCdOption] = useState([]);

  // grid
  const [grid1, setGrid1] = useState(null);

  // default
  const { control, getValues, setValue, watch, reset, handleSubmit } = useForm({
    defaultValues: {
      plantCd: [],
      startDt: new Date(),
    },
  });

   // globalButtons
  const globalButtons = [
    { name: 'search', action: (e) => { handleSubmit(loadData, onErrorInput)() }, visible: true, disable: false },
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

    //db 호출
    const moduleArr = await loadComboList({
      PROCEDURE_NAME: "SP_COMM_SRH_COMBO_LIST_Q",
      URL: "common/data",
      CODE_KEY: "CODE",
      CODE_VALUE: "NAME",
      PARAM: {
        P_CODE: "MODULE_TP", 
        P_ALL_GBN: "",
        P_ATTR1: "",
        P_ATTR2: "",
        P_ATTR3: "",
        P_ATTR4: "",
        P_ATTR5: "",
      },
    });

    setModuleCdOption(moduleArr);
    setValue("module", moduleArr.length > 0 ? moduleArr[0].value : "");
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

    await gridComboLoad(grid1, {
      URL: "common/data",
      CODE_VALUE: "CODE",
      CODE_LABEL: "NAME",
      COLUMN: "MODULE_CD",
      PROP: "lookupData",
      PARAM_KEY: ["PROCEDURE_NAME", "P_CODE"],
      PARAM_VALUE: ["SP_COMM_SRH_COMBO_LIST_Q", "MODULE_TP"],
      TRANSLANG_LABEL: false,
    });
  };

  const afterGrid1Create = (gridObj, gridView, dataProvider) => {
    gridView.setDisplayOptions({ fitStyle: 'even' });
    setVisibleProps(gridObj, true, true, true);
    setGrid1(gridObj);

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
  };

  // grid1 조회
  const loadData = () => {
    let data = [];
     
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

  return (
    <ContentInner>
      <SearchArea>
        <InputField type="select" name="gender" control={control} label={transLangKey('GENDER')} options={genderOption} rules={{ required: transLangKey('FP_MSG_FIELD_REQUIRED') }}/>
        <InputField type="text" name="test" control={control} label={transLangKey('TEST')} rules={{ required: transLangKey('FP_MSG_FIELD_REQUIRED') }}/>
        <InputField type="number" name="test2" control={control} label={transLangKey("TEST2")}
          rules={{
            maxLength: {
              value: 2,
              message: "error message",
            },
          }}
        />
        <InputField type="text" name="test3" control={control} label={transLangKey("TEST3")}
          rules={{
            pattern: {
              value: /[A-Za-z]{3}/,
              message: 'error message' 
            }
          }}
        />
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
  );
}

export default Practice07;