import React, { useEffect, useState, useRef } from 'react';
import { Box, Button } from '@mui/material';
import { BaseGrid, PopupDialog, zAxios, SearchArea, InputField, useUserStore, ButtonArea, RightButtonArea, GridAddRowButton, GridDeleteRowButton, useViewStore, getActiveViewId, GridSaveButton, GridExcelExportButton, GridExcelImportButton } from '@wingui/common/imports';
import { useForm } from "react-hook-form";
import { LeftButtonArea } from '@zionex/wingui-core';

let inkOrdDistPopup1GridColumns = [
  { name: 'ITEM_CD', dataType: 'text', headerText: 'PK_ITEM_CD', visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'PK_ITEM_NM', visible: true, editable: false, width: 200 },
  { name: 'SPEC_DESC', dataType: 'text', headerText: 'PK_SPEC_DESC', visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: 'LINE_CD', dataType: 'text', headerText: 'PK_LINE', visible: true, editable: false, width: 50, textAlignment: "center" },
  { name: 'PLAN_DT', dataType: 'text', headerText: 'PK_PLAN_DT', visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: 'OPER_TIME', dataType: 'number', headerText: 'PK_PLAN_TIME', visible: true, editable: false, width: 60, textAlignment: "center", numberFormat: '#,###.00' },
  { name: 'PROD_QTY', dataType: 'number', headerText: 'PK_PLAN_QTY3', visible: true, editable: false, width: 65, numberFormat: '#,###' },
  { name: 'REQ_QTY', dataType: 'number', headerText: 'PK_CONSUME_QTY', visible: true, editable: false, width: 55, numberFormat: '#,###' },
  { name: 'PLAN_RMK', dataType: 'text', headerText: 'REMARK', visible: true, editable: false, width: 100 },
]

function PopInkOrdDistPopup1(props) {
  const [inkOrdDistPopup1Grid, setInkOrdDistPopup1Grid] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [getViewIsUpdated] = useViewStore(state => [state.getViewIsUpdated]);
  const activeViewId = getActiveViewId();

  const { handleSubmit, getValues, setValue, control, clearErrors, watch } = useForm({
    defaultValues: {
      planVer: props.data.PLAN_VER_ID,
      matCd: props.data.INK_CD + " : " + props.data.INK_NM,
      planPeriod: [new Date(props.data.PLAN_PERIOD[0]), new Date(props.data.PLAN_PERIOD[1])],
    },
  });

  function afterPopupGridCreate(gridObj) {
    setInkOrdDistPopup1Grid(gridObj);
    setPackDailyPlanPopup1Options(gridObj);
  }

  function setPackDailyPlanPopup1Options(gridObj) {
    setVisibleProps(gridObj, false, false, false);
    gridObj.gridView.displayOptions.fitStyle = 'fill';
  }

  useEffect(() => {
    if (inkOrdDistPopup1Grid) {
      loadPopupData();
    }
  }, [inkOrdDistPopup1Grid])


  function loadPopupData() {
    let params = {
      P_PLAN_VER_ID: getValues('planVer'),
      P_MAT_CD: props.data.INK_CD,
      P_PLAN_ST_DT: new Date(getValues('planPeriod')[0]).format('yyyyMMdd'),
      P_PLAN_END_DT: new Date(getValues('planPeriod')[1]).format('yyyyMMdd'),
      P_USER_ID: username
    }
    zAxios({
      method: 'post',
      url: 'pk/ordermgmt/inkorddistpopup/q1',
      data: params,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === HTTP_STATUS.SUCCESS) {
          inkOrdDistPopup1Grid.dataProvider.fillJsonData(res.data);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  //팝업창 닫을때 수정 중인지 확인하는 로직 추가 
  function popClose() {
    let checks = [inkOrdDistPopup1Grid];
    if (getViewIsUpdated(activeViewId, checks)) {
      showMessage(transLangKey('WARNING'), transLangKey('MSG_5142'), function (answer) {
        if (answer) {
          if (checks) {
            checks.forEach(grid => {
              grid.dataProvider.clearRowStates(true);
            })
          }
          props.onClose();
        }
      });
    } else {
      props.onClose();
    }
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} type="CUSTOM" title={transLangKey('PK_HALB_PLAN')} resizeHeight={400} resizeWidth={1000} checks={[inkOrdDistPopup1Grid]}
        buttons={<>
          <Button onClick={popClose} variant={'contained'} >{transLangKey("CLOSE")}</Button>
        </>}>
        <SearchArea>
          <InputField type="text" name="planVer" control={control} label={transLangKey("PK_PLAN_VER")} disabled style={{ display: 'none' }} />
          <InputField type="text" name="matCd" control={control} label={transLangKey("PK_SEL_ITEM")} disabled width={240} />
          <InputField type="dateRange" name="planPeriod" label={[transLangKey("PK_PLAN_PERIOD"), null]} control={control} dateformat="yyyy-MM-dd" disabled />
        </SearchArea>
        <Box style={{ height: '100%' }}>
          <BaseGrid id='inkOrdDistPopup1Grid' items={inkOrdDistPopup1GridColumns} afterGridCreate={afterPopupGridCreate} />
        </Box>
      </PopupDialog >
    </>
  );
}

export default PopInkOrdDistPopup1;
