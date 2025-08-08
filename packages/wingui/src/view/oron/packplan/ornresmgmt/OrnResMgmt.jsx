import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import {
  ContentInner, WorkArea, SearchArea, ButtonArea, LeftButtonArea, RightButtonArea, ResultArea, GridExcelExportButton,
  GridSaveButton, BaseGrid, InputField, useUserStore, useViewStore, zAxios
} from '@wingui/common/imports';

let resMgmtGridColumns = [
  { name: 'PLANT_CD', dataType: 'text', headerText: 'PLANT_CD', visible: false, editable: false, width: 100 },
  {
    name: 'PK_ROUTE', dataType: 'group', orientation: 'horizontal', headerText: 'PK_ROUTE', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'ROUTE_CD', dataType: 'text', headerText: 'PK_CODE', visible: true, editable: false, width: 80, textAlignment: "center", mergeRule: { criteria: "value" } },
      { name: 'ROUTE_NM', dataType: 'text', headerText: 'PK_NAME', visible: true, editable: false, width: 80, textAlignment: "center", mergeRule: { criteria: "value" } },
    ]
  },
  {
    name: 'PK_ROUTE_DTL', dataType: 'group', orientation: 'horizontal', headerText: 'PK_ROUTE_DTL', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'ROUTE_DTL_CD', dataType: 'text', headerText: 'PK_CODE', visible: true, editable: false, width: 80, textAlignment: "center", mergeRule: { criteria: "prevvalues + value" } },
      { name: 'ROUTE_DTL_NM', dataType: 'text', headerText: 'PK_NAME', visible: true, editable: false, width: 80, textAlignment: "center", mergeRule: { criteria: "prevvalues + value" } },
    ]
  },
  { name: 'SHIFT_NUM', dataType: 'number', headerText: 'SHIFT_NUM', visible: true, editable: true, width: 60, textAlignment: "center", mergeEdit: true, mergeRule: { criteria: "prevvalues + value" } },
  {
    name: 'PK_LINE', dataType: 'group', orientation: 'horizontal', headerText: 'PK_LINE', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'LINE_CD', dataType: 'text', headerText: 'PK_CODE', visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: 'LINE_NM', dataType: 'text', headerText: 'PK_NAME', visible: true, editable: false, width: 80, textAlignment: "center" },
    ]
  },
  { name: 'SHIFT_DIVS', dataType: 'text', headerText: 'SHIFT_DIVS', visible: true, editable: true, width: 50, textAlignment: "center", useDropdown: true, lookupDisplay: true },//콤보박스 처리
  { name: 'WORK_TIME', dataType: 'number', headerText: 'WORK_TIME', visible: true, editable: true, width: 50 },
  { name: 'SAT_TIME', dataType: 'number', headerText: 'SAT_TIME', visible: true, editable: true, width: 50 },
  { name: 'USE_YN', dataType: 'boolean', headerText: 'USE_YN', visible: true, editable: true, width: 60 },
  {
    name: 'EDIT', dataType: 'group', orientation: 'horizontal', headerText: 'FP_COL_AUDIT', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'CREATE_BY', dataType: 'text', headerText: 'CREATE_BY', visible: true, editable: false, width: 100, groupShowMode: 'expand' },
      { name: 'CREATE_DTTM', dataType: 'datetime', headerText: 'CREATE_DTTM', visible: true, editable: false, width: 140, groupShowMode: 'expand' },
      { name: 'MODIFY_BY', dataType: 'text', headerText: 'MODIFY_BY', visible: true, editable: false, width: 100, groupShowMode: 'always' },
      { name: 'MODIFY_DTTM', dataType: 'datetime', headerText: 'MODIFY_DTTM', visible: true, editable: false, width: 140, groupShowMode: 'expand' }
    ]
  }
];

let routeCdSize = 0;

function OrnResMgmt() {
  const activeViewId = getActiveViewId();
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [resMgmtGrid, setResMgmtGrid] = useState(null);
  const [isCombosLoaded, setIsCombosLoaded] = useState(false);

  const [routeCdList, setRouteCdList] = useState([]);
  const { control, getValues, setValue, watch, reset } = useForm({
    defaultValues: {
      routeCd: [""],
      useYn: ["Y", "N"],
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ];

  const exportOptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    loadCombos();
  }, [])

  useEffect(() => {
    if (resMgmtGrid) {
      setViewInfo(activeViewId, 'globalButtons', globalButtons);
      setGridOption(resMgmtGrid);
    }
  }, [resMgmtGrid]);

  useEffect(() => {
    if (isCombosLoaded) {
      onSubmit(); // 콤보 데이터가 모두 로드되면 데이터 로드
      setIsCombosLoaded(!isCombosLoaded);
    }
  }, [isCombosLoaded]);

  const loadCombos = async () => {
    try {
      const routeCdListOptions = await loadComboList({
        PROCEDURE_NAME: "SP_UI_PK_ORN_COMM_SRH_Q",
        URL: "common/data",
        CODE_KEY: "DISP_CD",
        CODE_VALUE: "DISP_NM",
        PARAM: {
          P_SRH_CD: "PK_ROUTE_CD",
        },
        ALLFLAG: false
      });
      if (routeCdListOptions.length > 0) {
        setRouteCdList(routeCdListOptions);
        routeCdSize = routeCdListOptions.length;
        let values = routeCdListOptions.map(option => option.value);
        setValue('routeCd', values);
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
    resMgmtGrid.dataProvider.clearRows();
    loadCombos();
  }

  function afterGridCreate(gridObj) {
    setResMgmtGrid(gridObj);
    gridComboLoad(gridObj, {
      PROCEDURE_NAME: "SP_UI_PK_ORN_COMM_SRH_Q",
      URL: "common/data",
      CODE_VALUE: "DISP_CD",
      CODE_LABEL: "DISP_NM",
      COLUMN: "SHIFT_DIVS",
      PROP: "lookupData",
      PARAM_KEY: ["P_SRH_CD"],
      PARAM_VALUE: ["SHIFT_DIVS"],
      TRANSLANG_LABEL: true,
    });
  }

  const setGridOption = (grid) => {
    setVisibleProps(grid, true, true, false);

    grid.gridView.displayOptions.fitStyle = 'none';

    grid.gridView.pasteOptions.convertLookupLabel = true;
    grid.gridView.editOptions.commitByCell = true;
  }

  function loadData() {
    let routeCdArr = getValues('routeCd');
    let useYnArr = getValues('useYn');
    let params = {
      P_ROUTE_CD: routeCdArr.length == routeCdSize ? "" : routeCdArr.join(","),
      P_USE_YN: useYnArr.length == 2 ? "" : useYnArr[0],
      P_USER_ID: username
    }

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'pk/master/resmgmt/q1',
      data: params
    })
      .then(function (res) {
        if (res.status === HTTP_STATUS.SUCCESS) {
          resMgmtGrid.setData(res.data);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveData() {
    resMgmtGrid.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(
          resMgmtGrid.dataProvider.getAllStateRows().created,
          resMgmtGrid.dataProvider.getAllStateRows().updated,
          resMgmtGrid.dataProvider.getAllStateRows().deleted,
          resMgmtGrid.dataProvider.getAllStateRows().createAndDeleted
        );

        let changeRowData = [];
        changes.forEach(function (row) {
          let data = resMgmtGrid.dataProvider.getJsonRow(row);
          data.USE_YN = data.USE_YN ? "Y" : "N";
          data.USER_ID = username;
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });

        } else {
          zAxios({
            method: 'post',
            headers: { 'content-type': 'application/json' },
            url: baseURI() + 'pk/master/resmgmt/s1',
            data: changeRowData
          })
            .then(function (res) {
              if (res.status === HTTP_STATUS.SUCCESS) {
                showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_0001"), { close: false });
                loadData();
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
          <InputField type="multiSelect" name="routeCd" control={control} label={transLangKey('PK_ROUTE')} options={routeCdList} />
          <InputField type="multiSelect" name="useYn" control={control} label={transLangKey('USE_YN')}
            options={[
              { label: transLangKey('Y'), value: 'Y' },
              { label: transLangKey('N'), value: 'N' }
            ]}
          />
        </SearchArea>
        <WorkArea>
          <ButtonArea>
            <LeftButtonArea>
              <GridExcelExportButton type='icon' grid='resMgmtGrid' options={exportOptions} />
            </LeftButtonArea>
            <RightButtonArea>
              <GridSaveButton type='icon' onClick={() => { saveData() }} />
            </RightButtonArea>
          </ButtonArea>
          <ResultArea>
            <BaseGrid id='resMgmtGrid' items={resMgmtGridColumns} afterGridCreate={afterGridCreate}></BaseGrid>
          </ResultArea>
        </WorkArea>
      </ContentInner>
    </>
  )
}

export default OrnResMgmt;
