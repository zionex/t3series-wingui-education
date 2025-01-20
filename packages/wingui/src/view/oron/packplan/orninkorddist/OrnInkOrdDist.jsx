import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { Box, Typography } from '@mui/material';
import {
  ContentInner, WorkArea, SearchArea, ButtonArea, LeftButtonArea, RightButtonArea, ResultArea, SplitPanel,
  GridExcelExportButton, GridSaveButton, BaseGrid, InputField, useUserStore, useViewStore, zAxios, CommonButton
} from '@wingui/common/imports';
import PopInkOrdDistPopup1 from './PopInkOrdDistPopup1';
import PopInkOrdDistPopup2 from './PopInkOrdDistPopup2';


let inkOrdDistGridColumns = [
  { name: 'PLANT_CD', dataType: 'text', headerText: 'PLANT_CD', visible: false, editable: false },
  { name: 'INK_CD', dataType: 'text', headerText: 'PK_INK_CD', visible: true, editable: false, textAlignment: "center", width: 80, lookupDisplay: true },
  { name: 'INK_NM', dataType: 'text', headerText: 'PK_INK_NM', visible: true, editable: false, width: 180 },
  { name: 'REQ_UOM_CD', dataType: 'text', headerText: 'REQ_UOM_CD', visible: false, editable: false, textAlignment: "center", width: 80 },
  { name: 'WEIGHT_NUM', dataType: 'number', headerText: 'WEIGHT_NUM', visible: false, editable: false, numberFormat: "#,###.00", width: 50 },
  {
    name: 'REQ_DT', dataType: 'text', headerText: 'PK_REQ_DT', visible: true, editable: false, textAlignment: "center", width: 70,
    displayCallback: (grid, index, value) => {
      return value ? value.slice(0, 4) + "-" + value.slice(4, 6) + "-" + value.slice(6, 8) : value;
    }
  },
  { name: 'REQ_TIME', dataType: 'text', headerText: 'PK_REQ_TIME', visible: true, editable: false, textAlignment: "center", width: 50 },
  { name: 'REQ_QTY', dataType: 'number', headerText: 'PK_CONSUME_QTY', visible: true, editable: false, numberFormat: "#,###.00", width: 60 },
  { name: 'PROD_QTY', dataType: 'number', headerText: 'PK_PLAN_QTY2', visible: true, editable: false, numberFormat: "#,###", width: 60 },
  { name: 'CONV_STOCK_QTY', dataType: 'number', header: { text: transLangKey('PK_STOCK_QTY_CA'), styleName: "multi-line-css" }, visible: true, editable: false, numberFormat: "#,###.0", width: 60 },
  { name: 'STOCK_QTY', dataType: 'number', header: { text: transLangKey('PK_STOCK_QTY_KG'), styleName: "multi-line-css" }, visible: true, editable: false, numberFormat: "#,###.00", width: 60 },
  { name: 'PRE_PURC_QTY', dataType: 'number', headerText: 'PK_PRE_PURC_QTY', visible: false, editable: false, numberFormat: "#,###", width: 80 },
  {
    name: 'GR_DT', dataType: 'text', header: { text: transLangKey('PK_GR_DT1'), styleName: "multi-line-css" }, visible: true, editable: false, textAlignment: "center", width: 60,
    displayCallback: (grid, index, value) => {
      return value ? value.slice(0, 4) + "-" + value.slice(4, 6) + "-" + value.slice(6, 8) : value;
    }
  },
  { name: 'GR_TIME', dataType: 'text', header: { text: transLangKey('PK_GR_TIME'), styleName: "multi-line-css" }, visible: false, editable: false, textAlignment: "center" },
  { name: 'VENDOR_NM', dataType: 'text', headerText: 'PK_VENDOR_NM', visible: true, editable: false, width: 160 },
  { name: 'GR_QTY', dataType: 'number', header: { text: transLangKey('PK_GR_QTY1'), styleName: "multi-line-css" }, visible: true, editable: false, numberFormat: "#,###", width: 60 },
  { name: 'SHORT_QTY', dataType: 'number', headerText: 'PK_SHORT_QTY', visible: true, editable: false, numberFormat: "#,###.00", width: 70 },
  { name: 'CONV_SHORT_QTY', dataType: 'number', header: { text: transLangKey('PK_CONV_SHORT_QTY'), styleName: "multi-line-css" }, visible: true, editable: false, numberFormat: "#,###", width: 50 },
  { name: 'VENDOR_CD', dataType: 'text', headerText: 'PK_PURC_CD', visible: true, editable: true, width: 130, useDropdown: true, lookupDisplay: true },
  { name: 'PURC_QTY', dataType: 'number', headerText: 'PK_PURC_QTY', visible: true, editable: true, numberFormat: "#,###", width: 60 },
  { name: 'CONV_PURC_QTY', dataType: 'number', header: { text: transLangKey('PK_CONV_PURC_QTY'), styleName: "multi-line-css" }, visible: true, editable: false, numberFormat: "#,###.00", width: 60 },
  { name: 'DT_KEY', dataType: 'number', header: { text: transLangKey('PK_DT_KEY'), styleName: "multi-line-css" }, visible: true, editable: true, textAlignment: "center", numberFormat: "#,###", width: 60 },
  { name: 'GR_REQ_DT', dataType: 'datetime', header: { text: transLangKey('PK_GR_REQ_DT'), styleName: "multi-line-css" }, visible: true, editable: true, textAlignment: "center", width: 80, format: "yyyy-MM-dd" },
  { name: 'TIME_KEY', dataType: 'number', header: { text: transLangKey('PK_TIME_KEY'), styleName: "multi-line-css" }, visible: true, editable: true, textAlignment: "center", numberFormat: "#,###", width: 60 },
  { name: 'GR_REQ_TIME', dataType: 'number', headerText: 'PK_GR_REQ_TIME', visible: true, editable: true, textAlignment: "center", width: 60, editor: { min: 1, max: 24 } }
];


function OrnInkOrdDist() {
  const activeViewId = getActiveViewId();
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [inkOrdDistGrid, setInkOrdDistGrid] = useState(null);
  const [isCombosLoaded, setIsCombosLoaded] = useState(false);
  const [planVerList, setPlanVerList] = useState([]);

  const [inkOrdDistPopup1Open, setInkOrdDistPopup1Open] = useState(false); //팝업 1 오픈
  const [inkOrdDistPopup2Open, setInkOrdDistPopup2Open] = useState(false); //팝업 2 오픈
  const [popup1Data, setPopup1Data] = useState(null); //팝업에 넘길 데이터
  const [popup2Data, setPopup2Data] = useState(null); //팝업에 넘길 데이터

  const { control, getValues, setValue, watch, reset } = useForm({
    defaultValues: {
      stockDt: new Date(new Date().setDate(new Date().getDate() - 1)), // 당일  -1일
      planPeriod: [
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 6)
      ],
      reqQty: "N",
      prePurc: []
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
    separateRows: false,
  };

  useEffect(() => {
    loadCombos();
  }, []);

  useEffect(() => {
    if (inkOrdDistGrid) {
      inkOrdDistGrid.gridView.setColumnProperty('PRE_PURC_QTY', 'visible', getValues('prePurc')[0] === 'Y');//검색조건 체크박스
    }
  }, [watch('prePurc')]);

  useEffect(() => {
    if (inkOrdDistGrid) {
      setViewInfo(activeViewId, 'globalButtons', globalButtons);
      setGridOption1(inkOrdDistGrid);
    }
  }, [inkOrdDistGrid]);

  useEffect(() => {
    if (isCombosLoaded) {
      onSubmit(); // 콤보 데이터가 모두 로드되면 데이터 로드
      setIsCombosLoaded(!isCombosLoaded);
    }
  }, [isCombosLoaded]);

  const loadCombos = async () => {
    try {
      const planVerOptions = await loadComboList({
        PROCEDURE_NAME: "SP_UI_PK_ORN_COMM_SRH_Q",
        URL: "common/data",
        CODE_KEY: "DISP_CD",
        CODE_VALUE: "DISP_NM",
        PARAM: {
          P_SRH_CD: "PK_PLAN_VER",
        },
        TRANSLANG_LABEL: true,
        ALLFLAG: false
      });
      if (planVerOptions.length > 0) {
        setPlanVerList(planVerOptions);
        setValue('planVer', planVerOptions[0].value);
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
    inkOrdDistGrid.dataProvider.clearRows();
    loadCombos();
  }

  function afterGridCreate1(gridObj) {
    setInkOrdDistGrid(gridObj);
  }

  const setGridOption1 = (grid) => {
    setVisibleProps(grid, true, true, false);

    grid.gridView.displayOptions.fitStyle = 'fill';
    grid.gridView.header.height = 50;

    grid.gridView.onCellDblClicked = function (grid, clickData) {
      if (clickData.cellType === 'data') {
        if (clickData.column === "INK_NM") {
          const clickedRow = grid.getValues(clickData.itemIndex);
          setPopup1Data({ ...clickedRow, 'PLAN_VER_ID': getValues('planVer'), 'PLAN_PERIOD': getValues("planPeriod") });
          setInkOrdDistPopup1Open(true);
        }
      }
    }

    grid.gridView.onCellClicked = function (grid, clickData) {
      if (clickData.cellType === 'data') {
        if (clickData.column === ('GR_REQ_DT') && !grid.isEditing()) {
          grid.setValue(clickData.itemIndex, 'GR_REQ_DT', new Date());
        }
      }
    }

    grid.gridView.onCellEdited = function (grid, itemIndex, dataRow, field) {
      let dataProvider = grid.getDataSource();
      let dtKeyIdx = dataProvider.getFieldIndex("DT_KEY"); //단축키(요청일)
      let timeKeyIdx = dataProvider.getFieldIndex("TIME_KEY"); //단축키(입고시간)
      let purcQtyIdx = dataProvider.getFieldIndex("PURC_QTY"); //수량

      if (field === dtKeyIdx) {// 단축키 입력시 입고예정일 데이터를 셋해줌
        grid.commit();
        let dtKeyVal = grid.getValue(itemIndex, 'DT_KEY');
        if (dtKeyVal === 1) { //1 입력시 오늘
          grid.setValue(itemIndex, 'GR_REQ_DT', new Date());
        } else if (dtKeyVal === 2) {//2 입력시 오늘 + 1
          grid.setValue(itemIndex, 'GR_REQ_DT', new Date(new Date().setDate(new Date().getDate() + 1)));
        } else if (dtKeyVal === 3) {//3 입력시 오늘 + 2
          grid.setValue(itemIndex, 'GR_REQ_DT', new Date(new Date().setDate(new Date().getDate() + 2)));
        } else if (dtKeyVal === 4) {//4 입력시 오늘 + 3
          grid.setValue(itemIndex, 'GR_REQ_DT', new Date(new Date().setDate(new Date().getDate() + 3)));
        } else if (dtKeyVal === 5) {//5 입력시 오늘 + 4
          grid.setValue(itemIndex, 'GR_REQ_DT', new Date(new Date().setDate(new Date().getDate() + 4)));
        } else {//그 외의 숫자 입력시 단축키 셀을 비운다.
          grid.setValue(itemIndex, 'DT_KEY', null);
          grid.setValue(itemIndex, 'GR_REQ_DT', "");
        }
      }

      if (field === timeKeyIdx) {// 단축키 입력시 입고시간 데이터를 셋해줌
        grid.commit();
        let dtTimeVal = grid.getValue(itemIndex, 'TIME_KEY');
        if (dtTimeVal === 1) { //1 입력시 08:00
          grid.setValue(itemIndex, 'GR_REQ_TIME', '8');
        } else if (dtTimeVal === 2) {//2 입력시 10:00
          grid.setValue(itemIndex, 'GR_REQ_TIME', '10');
        } else if (dtTimeVal === 3) {//3 입력시 12:00
          grid.setValue(itemIndex, 'GR_REQ_TIME', '12');
        } else if (dtTimeVal === 4) {//4 입력시 14:00
          grid.setValue(itemIndex, 'GR_REQ_TIME', '14');
        } else if (dtTimeVal === 5) {//5 입력시 16:00
          grid.setValue(itemIndex, 'GR_REQ_TIME', '16');
        } else {//그 외의 숫자 입력시 단축키 셀을 비운다.
          grid.setValue(itemIndex, 'TIME_KEY', null);
          grid.setValue(itemIndex, 'GR_REQ_TIME', null);
        }
      }

      if (field === purcQtyIdx) {//qty입력시 계산해서 캔환산 무게 세팅해주기
        grid.commit();
        let weightNumVal = grid.getValue(itemIndex, 'WEIGHT_NUM');
        let purcQtyVal = grid.getValue(itemIndex, 'PURC_QTY');
        let multipleVal = weightNumVal * purcQtyVal;
        grid.setValue(itemIndex, 'CONV_PURC_QTY', multipleVal);
      }

    }
  }

  function loadData() {
    let planStart = getValues('planPeriod')[0];
    let planEnd = getValues('planPeriod')[1];
    let params = {
      P_PLAN_VER_ID: getValues('planVer'),
      P_STOCK_DT: getValues('stockDt').format('yyyyMMdd'),
      P_PLAN_ST_DT: planStart.format('yyyyMMdd'),
      P_PLAN_END_DT: planEnd.format('yyyyMMdd'),
      P_REQ_YN: getValues('reqQty'),
      P_USER_ID: username
    };

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'pk/ordermgmt/inkorddist/q1',
      data: params
    })
      .then(async function (res) {
        if (res.status === HTTP_STATUS.SUCCESS) {
          inkOrdDistGrid.setData(res.data);
          setLookupData(inkOrdDistGrid);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const setLookupData = (targetGrid) => {

    let params = {
      P_GRID_VAL_01: 'PK_PURC_CD'
    }

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'pk/ordermgmt/inkorddistcombo/lookup',
      data: params,
      waitOn: false
    })
      .then(async function (res) {
        if (res.status === HTTP_STATUS.SUCCESS) {
          let dataList = res.data;
          let lv2Keys = [];
          let lv2Values = [];

          dataList.forEach((data) => {
            lv2Keys.push([data.ITEM_CD, data.DISP_CD]);
            lv2Values.push([data.DISP_NM]);
          });

          // 룩업 설정: 모든 데이터 추가 후 한 번에 설정
          targetGrid.gridView.setLookups([
            {
              id: "lv2",
              levels: 2,
              keys: lv2Keys,
              values: lv2Values
            }
          ]);

          targetGrid.gridView.setColumnProperty("VENDOR_CD", 'lookupSourceId', 'lv2');
          targetGrid.gridView.setColumnProperty("VENDOR_CD", 'lookupKeyFields', ["INK_CD", "VENDOR_CD"]);
        }
      }).catch(function (err) {
        console.log(err);
      });
  }

  function saveData(targetGrid) {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let vendorCdFlag = false;
        let purcQtyFlag = false;
        let reqDtFlag = false;
        let reqTimeFlag = false;
        let changes = [];
        changes = changes.concat(
          targetGrid.dataProvider.getAllStateRows().created,
          targetGrid.dataProvider.getAllStateRows().updated,
          targetGrid.dataProvider.getAllStateRows().deleted,
          targetGrid.dataProvider.getAllStateRows().createAndDeleted
        );
        let changeRowData = [];
        changes.forEach(function (row) {
          let data = targetGrid.dataProvider.getJsonRow(row);
          data.USER_ID = username;
          data.GR_REQ_DT = data.GR_REQ_DT ? new Date(data.GR_REQ_DT).format("yyyyMMdd") : null;
          changeRowData.push(data);
          //라인 또는 수량을 하나만 채우고 빠트린경우
          if (!data.VENDOR_CD) {
            vendorCdFlag = true;
          } else if (!data.PURC_QTY) {
            purcQtyFlag = true;
          } else if (!data.GR_REQ_DT) {
            reqDtFlag = true;
          } else if (!data.GR_REQ_TIME) {
            reqTimeFlag = true;
          }
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else if (vendorCdFlag) {//vendor Cd empty value
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('PK_INK_ORD_DIST_SAVE_MSG_01'), { close: false });

        } else if (purcQtyFlag) {//purcqty empty value
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('PK_INK_ORD_DIST_SAVE_MSG_02'), { close: false });

        } else if (reqDtFlag) {//grreqdt empty value
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('PK_INK_ORD_DIST_SAVE_MSG_03'), { close: false });

        } else if (reqTimeFlag) {//grreqtime empty value
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('PK_INK_ORD_DIST_SAVE_MSG_04'), { close: false });
        } else {
          zAxios({
            method: 'post',
            headers: { 'content-type': 'application/json' },
            url: baseURI() + 'pk/ordermgmt/inkorddist/s1',
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

  const fncKeyBox = () => {
    let innerboxStyle = {
      display: 'flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '20px', border: '1px solid #a1a5ab'
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', height: '24px', width: '430px' }}>
          <Box sx={innerboxStyle}>단축키</Box>
          <Box sx={innerboxStyle}>1</Box>
          <Box sx={innerboxStyle}>2</Box>
          <Box sx={innerboxStyle}>3</Box>
          <Box sx={innerboxStyle}>4</Box>
          <Box sx={innerboxStyle}>5</Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', height: '24px', width: '430px' }}>
          <Box sx={innerboxStyle}>입고요청일</Box>
          <Box sx={innerboxStyle}>오늘</Box>
          <Box sx={innerboxStyle}>오늘+1</Box>
          <Box sx={innerboxStyle}>오늘+2</Box>
          <Box sx={innerboxStyle}>오늘+3</Box>
          <Box sx={innerboxStyle}>오늘+4</Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', height: '24px', width: '430px' }}>
          <Box sx={innerboxStyle}>입고시간</Box>
          <Box sx={innerboxStyle}>08:00</Box>
          <Box sx={innerboxStyle}>10:00</Box>
          <Box sx={innerboxStyle}>12:00</Box>
          <Box sx={innerboxStyle}>14:00</Box>
          <Box sx={innerboxStyle}>16:00</Box>
        </Box>
      </Box>
    )
  }

  const grIf = () => {

  }

  const purcSearch = () => {
    setInkOrdDistPopup2Open(true);
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <InputField type="select" name="planVer" control={control} label={transLangKey("PK_PLAN_VER")} options={planVerList} disabled={true} />
          <InputField type="datetime" name="stockDt" control={control} label={transLangKey("PK_STOCK_DT")} dateformat="yyyy-MM-dd" />
          <InputField type="dateRange" name="planPeriod" label={[transLangKey("PK_PLAN_PERIOD"), null]} control={control} dateformat="yyyy-MM-dd" />
          <InputField type="select" name="reqQty" control={control} label={transLangKey("PK_REQ_QTY")} options={
            [
              { label: transLangKey("ALL"), value: "N" },
              { label: transLangKey("Y"), value: "Y" },
            ]
          } width={100} />
          <InputField type="check" name="prePurc" control={control} options={[{ label: transLangKey("PK_PRE_PURC"), value: "Y" }]} />
          <Box sx={{ display: 'flex', alignItems: "center", marginLeft: 'auto', marginRight: '20px' }}>
            {fncKeyBox()}
          </Box>
        </SearchArea>
        <WorkArea>
          <ButtonArea sx={{ display: 'flex', flexDirection: 'row', alignItems: "center", paddingTop: '6px' }}>
            <LeftButtonArea>
              <GridExcelExportButton type='icon' grid='inkOrdDistGrid' options={exportOptions} />
              <CommonButton type="text" title={transLangKey("PK_GR_IF")} onClick={() => { grIf() }} />
              <CommonButton type="text" title={transLangKey("PK_PURC_SEARCH")} onClick={() => { purcSearch() }} />
              <Typography style={{ display: 'inline-block', color: '#0d5bdc', marginLeft: '20px' }}>{transLangKey("PK_INK_ORD_DIST_MSG")}</Typography>
            </LeftButtonArea>
            <RightButtonArea sx={{ display: 'flex', alignItems: 'center' }}>
              <GridSaveButton type='icon' onClick={() => { saveData(inkOrdDistGrid) }} />
            </RightButtonArea>
          </ButtonArea>
          <ResultArea>
            <BaseGrid id='inkOrdDistGrid' items={inkOrdDistGridColumns} afterGridCreate={afterGridCreate1}></BaseGrid>
          </ResultArea>
        </WorkArea>
      </ContentInner>
      {inkOrdDistPopup1Open && <PopInkOrdDistPopup1 open={inkOrdDistPopup1Open} onClose={() => { setInkOrdDistPopup1Open(false) }} data={popup1Data} />}
      {inkOrdDistPopup2Open && <PopInkOrdDistPopup2 open={inkOrdDistPopup2Open} onClose={() => { setInkOrdDistPopup2Open(false) }} data={popup2Data} />}
    </>
  )
}

export default OrnInkOrdDist;
