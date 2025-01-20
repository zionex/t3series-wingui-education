import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import {
  ContentInner, WorkArea, SearchArea, ButtonArea, LeftButtonArea, RightButtonArea, ResultArea, GridExcelExportButton,GridExcelImportButton,
  GridSaveButton, BaseGrid, InputField, useUserStore, useViewStore, zAxios
} from '@wingui/common/imports';


let matMgmtGridColumns = [
  { name: 'PLANT_CD', dataType: 'text', headerText: 'PLANT_CD', visible: false, editable: false, width: 100 },
  { name: 'MAT_CD', dataType: 'text', headerText: 'PK_MAT_CD', visible: true, editable: false, width: 60, textAlignment: "center" },
  { name: 'MAT_NM', dataType: 'text', headerText: 'PK_MAT_NM', visible: true, editable: false, width: 140 },
  { name: 'MAT_LV_02', dataType: 'text', headerText: 'MAT_LV_02', visible: true, editable: false, width: 50, textAlignment: "center", displayCallback: (grid, index, value) => {
    return transLangKey(value);
    },
  },
  {
    name: 'MAT_LV_03', dataType: 'group', orientation: 'horizontal', headerText: 'MAT_LV_03', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'MAT_LV_03', dataType: 'text', headerText: 'PK_CODE', visible: true, editable: false, width: 40, textAlignment: "center" },
      { name: 'MAT_LV_03_NM', dataType: 'text', headerText: 'PK_NAME', visible: true, editable: false, width: 50, textAlignment: "center" },
    ]
  },
  {
    name: 'PK_MAT_TP', dataType: 'group', orientation: 'horizontal', headerText: 'PK_MAT_TP', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'MAT_TP_CD', dataType: 'text', headerText: 'PK_CODE', visible: true, editable: false, width: 40, textAlignment: "center" },
      { name: 'MAT_TP_NM', dataType: 'text', headerText: 'PK_NAME', visible: true, editable: false, width: 50, textAlignment: "center" },
    ]
  },
  {
    name: 'PK_MAT_ATTR', dataType: 'group', orientation: 'horizontal', headerText: 'PK_MAT_ATTR', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'THICK_NUM', dataType: 'number', headerText: 'THICK_NUM', visible: true, editable: false, width: 50, numberFormat: "#,###" },
      { name: 'WID_NUM', dataType: 'number', headerText: 'WID_NUM', visible: true, editable: false, width: 50, numberFormat: "#,###" },
      { name: 'LEN_NUM', dataType: 'number', headerText: 'LEN_NUM', visible: true, editable: false, width: 50, numberFormat: "#,###" },
      { name: 'SPEC_NUM', dataType: 'number', headerText: 'SPEC_NUM', visible: true, editable: false, width: 50, numberFormat: "#,###.##" },
      { name: 'WEIGHT_NUM', dataType: 'number', headerText: 'WEIGHT_NUM', visible: true, editable: false, width: 50, numberFormat: "#,###.##" },
    ]
  },
  { name: 'PAP_UOM', dataType: 'text', headerText: 'PAP_UOM', visible: true, editable: false, width: 50, textAlignment: "center" },
  { name: 'USE_YN', dataType: 'boolean', headerText: 'USE_YN', visible: true, editable: false, width: 50, textAlignment: "center" },
  { name: 'PURC_YN', dataType: 'boolean', header: { text: transLangKey('PK_PURC_YN'), styleName: "multi-line-css" }, visible: true, editable: true, width: 50, textAlignment: "center" },
  { name: 'PURC_LT', dataType: 'number', header: { text: transLangKey('PK_PURC_LT'), styleName: "multi-line-css" }, visible: true, editable: false, width: 45, numberFormat: "#,###" },
  { name: 'PURC_DIVS', dataType: 'text', headerText: 'PK_PURC_DIVS', visible: true, editable: false, width: 50, textAlignment: "center" },
  { name: 'INS_DT', dataType: 'text', headerText: 'PK_INS_DT', visible: true, editable: false, width: 60, textAlignment: "center" },
  { name: 'DISP_DT', dataType: 'text', headerText: 'PK_DISP_DT', visible: true, editable: false, width: 60, textAlignment: "center" },
  {
    name: 'EDIT', dataType: 'group', orientation: 'horizontal', headerText: 'FP_COL_AUDIT', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'CREATE_BY', dataType: 'text', headerText: 'CREATE_BY', visible: true, editable: false, width: 70, groupShowMode: 'expand' },
      { name: 'CREATE_DTTM', dataType: 'datetime', headerText: 'CREATE_DTTM', visible: true, editable: false, width: 110, groupShowMode: 'expand' },
      { name: 'MODIFY_BY', dataType: 'text', headerText: 'MODIFY_BY', visible: true, editable: false, width: 70, groupShowMode: 'always' },
      { name: 'MODIFY_DTTM', dataType: 'datetime', headerText: 'MODIFY_DTTM', visible: true, editable: false, width: 110, groupShowMode: 'expand' }
    ]
  }
];

let matTpCdSize = 0;

function OrnMatMgmt() {
  const activeViewId = getActiveViewId();
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [matMgmtGrid, setMatMgmtGrid] = useState(null);
  const [isCombosLoaded, setIsCombosLoaded] = useState(false);

  const [matTpCdList, setMatTpCdList] = useState([]);

  const { control, getValues, setValue, watch, reset } = useForm({
    defaultValues: {
      matTpCd: [""],
      matVal: "",
      useYn: ["Y", "N"],
      purcYn: ["Y", "N"],
      dispYn: []
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ];

  const exportOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false,
    booleanCallback: function (index, name, value) {
      if (value == false) {
        return "N"
      } else if (value == true) {
        return "Y"
      }
    }
  };

  useEffect(() => {
    loadCombos();
  }, []);

  useEffect(() => {
    if (matMgmtGrid) {
      setViewInfo(activeViewId, 'globalButtons', globalButtons);
      setGridOption(matMgmtGrid);
    }
  }, [matMgmtGrid]);

  useEffect(() => {
    if (isCombosLoaded) {
      onSubmit(); // 콤보 데이터가 모두 로드되면 데이터 로드
      setIsCombosLoaded(!isCombosLoaded);
    }
  }, [isCombosLoaded]);

  const loadCombos = async () => {
    try {
      const matTpCdOptions = await loadComboList({
        PROCEDURE_NAME: "SP_UI_PK_ORN_COMM_SRH_Q",
        URL: "common/data",
        CODE_KEY: "DISP_CD",
        CODE_VALUE: "DISP_NM",
        PARAM: {
          P_SRH_CD: "PK_MAT_TP_CD",
        },
        TRANSLANG_LABEL: true,
        ALLFLAG: false
      });
      if (matTpCdOptions.length > 0) {
        setMatTpCdList(matTpCdOptions);
        matTpCdSize = matTpCdOptions.length;
        let values = matTpCdOptions.map(option => option.value);
        setValue('matTpCd', values);
      }

      setIsCombosLoaded(true);

    } catch (error) {
      console.error("Error loading combo data:", error);
      setIsCombosLoaded(false); // 실패 시 false로 설정
    }

  }

  const onSubmit = () => {
    loadData();
  };

  const refresh = () => {
    reset();
    matMgmtGrid.dataProvider.clearRows();
    loadCombos();
  }

  function afterGridCreate(gridObj) {
    setMatMgmtGrid(gridObj);
  }

  const setGridOption = (grid) => {
    setVisibleProps(grid, true, true, false);

    grid.gridView.displayOptions.fitStyle = 'fill';
  }

  function loadData() {
    let matTpCdArr = getValues('matTpCd');
    let purcYnArr = getValues('purcYn');
    let useYnArr = getValues('useYn');
    let params = {
      P_MAT_TP_CD: matTpCdArr.length == matTpCdSize ? "" : matTpCdArr.join(","),
      P_MAT_VAL: getValues('matVal'),
      P_USE_YN: useYnArr.length == 2 ? "" : useYnArr[0],
      P_PURC_YN: purcYnArr.length == 2 ? "" : purcYnArr[0],
      P_DISP_YN: getValues('dispYn').join("") === "Y" ? "Y" : "N",
      P_USER_ID: username
    };

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'pk/master/matmgmt/q1',
      data: params
    })
      .then(function (res) {
        if (res.status === HTTP_STATUS.SUCCESS) {
          matMgmtGrid.setData(res.data);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveData() {
    matMgmtGrid.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(
          matMgmtGrid.dataProvider.getAllStateRows().created,
          matMgmtGrid.dataProvider.getAllStateRows().updated,
          matMgmtGrid.dataProvider.getAllStateRows().deleted,
          matMgmtGrid.dataProvider.getAllStateRows().createAndDeleted
        );

        let changeRowData = [];
        changes.forEach(function (row) {
          let data = matMgmtGrid.dataProvider.getJsonRow(row);
          data.PURC_YN = data.PURC_YN ? "Y" : "N";
          data.USER_ID = username;
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });

        } else {
          zAxios({
            method: 'post',
            headers: { 'content-type': 'application/json' },
            url: baseURI() + 'pk/master/matmgmt/s1',
            data: changeRowData
          })
            .then(function (res) {
              if (res.status === HTTP_STATUS.SUCCESS) {
                showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_0001"), { close: false });
                onSubmit();
              } else {
                showMessage(transLangKey("MSG_CONFIRM"), transLangKey(res.data.message), { close: false });
              }
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      }
    });
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <InputField type="multiSelect" name="matTpCd" control={control} label={transLangKey("PK_MAT_TP")} options={matTpCdList} />
          <InputField type="text" name="matVal" control={control} label={transLangKey("PK_MAT")} enterSelect />
          <InputField type="multiSelect" name="useYn" control={control} label={transLangKey("USE_YN")}
            options={[
              { label: transLangKey('Y'), value: 'Y' },
              { label: transLangKey('N'), value: 'N' }
            ]}
          />
          <InputField type="multiSelect" name="purcYn" control={control} label={transLangKey("PK_PURC_YN_INPUT")}
            options={[
              { label: transLangKey('Y'), value: 'Y' },
              { label: transLangKey('N'), value: 'N' }
            ]}
          />
          <InputField type="check" name="dispYn" control={control} options={[{ label: transLangKey("DISP_MAT_YN"), value: 'Y' }]} />
        </SearchArea>
        <WorkArea>
          <ButtonArea>
            <LeftButtonArea>
              <GridExcelExportButton type='icon' grid='matMgmtGrid' options={exportOptions} />
              <GridExcelImportButton type="icon" grid='matMgmtGrid'></GridExcelImportButton>
            </LeftButtonArea>
            <RightButtonArea>
              <GridSaveButton type='icon' onClick={() => { saveData() }} />
            </RightButtonArea>
          </ButtonArea>
          <ResultArea>
            <BaseGrid id='matMgmtGrid' items={matMgmtGridColumns} afterGridCreate={afterGridCreate}></BaseGrid>
          </ResultArea>
        </WorkArea>
      </ContentInner>
    </>
  )
}

export default OrnMatMgmt;
