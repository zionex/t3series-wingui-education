import React, { useEffect, useState, useRef } from 'react';
import { Box, Button } from '@mui/material';
import { BaseGrid, PopupDialog, zAxios, SearchArea, InputField, useUserStore, ButtonArea, RightButtonArea, GridAddRowButton, GridDeleteRowButton, useViewStore, getActiveViewId, GridSaveButton, GridExcelExportButton, GridExcelImportButton } from '@wingui/common/imports';
import { useForm } from "react-hook-form";
import { LeftButtonArea } from '@zionex/wingui-core';

let inkOrdDistPopup2GridColumns1 = [
  {
    name: 'PURC_DT', dataType: 'text', headerText: 'PK_PURC_DT', visible: true, editable: false, width: 70, textAlignment: "center",
    displayCallback: (grid, index, value) => {
      return value ? value.slice(0, 4) + "-" + value.slice(4, 6) + "-" + value.slice(6, 8) : value;
    }
  },
  { name: 'VENDOR_CD', dataType: 'text', headerText: 'PK_VENDOR', visible: true, editable: false, width: 70, textAlignment: "center" },
  { name: 'VENDOR_NM', dataType: 'text', headerText: 'PK_VENDOR_NM', visible: true, editable: false, width: 120 },
  { name: 'PURC_SEQ', dataType: 'number', headerText: 'PK_PURC_SEQ', visible: true, editable: false, width: 40, textAlignment: "center" },
  { name: 'PURC_YN', dataType: 'text', header: { text: transLangKey('PK_PURC_SEND_YN'), styleName: "multi-line-css" }, visible: true, editable: false, width: 40, textAlignment: "center" },
]

let inkOrdDistPopup2GridColumns2 = [
  { name: 'PLANT_CD', dataType: 'text', headerText: 'PLANT_CD', visible: false, editable: false },
  { name: 'VENDOR_CD', dataType: 'text', headerText: 'VENDOR_CD', visible: false, editable: false },
  { name: 'PURC_SEQ', dataType: 'number', headerText: 'PK_PURC_SEQ', visible: false, editable: false },
  { name: 'PURC_DT', dataType: 'text', headerText: 'PURC_DT', visible: false, editable: false },
  { name: 'DEL_YN', dataType: 'boolean', headerText: 'DEL_YN', visible: true, editable: true, width: 35 },
  { name: 'INK_CD', dataType: 'text', headerText: 'PK_INK_CD', visible: true, editable: false, width: 65, textAlignment: "center" },
  { name: 'INK_NM', dataType: 'text', headerText: 'PK_INK_NM', visible: true, editable: false, width: 140 },
  { name: 'REQ_UOM_NM', dataType: 'text', headerText: 'REQ_UOM_NM', visible: true, editable: false, width: 40, textAlignment: "center" },
  { name: 'PURC_QTY', dataType: 'number', headerText: 'PK_PURC_QTY', visible: true, editable: false, width: 50, numberFormat: '#,###' },
  { name: 'GR_PLANT_CD', dataType: 'text', headerText: 'GR_PLANT', visible: true, editable: true, width: 80, useDropdown: true, lookupDisplay: true },
  { name: 'DLV_REQ_DT', dataType: 'text', headerText: 'DLV_REQ_DT', visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: 'DLV_REQ_TIME', dataType: 'number', headerText: 'DLV_REQ_TIME', visible: true, editable: false, width: 55, numberFormat: '#,###', textAlignment: "center" },
  { name: 'DLV_REQ_RMK', dataType: 'text', headerText: 'DLV_REQ_RMK', visible: true, editable: true, width: 100 },
]

function PopInkOrdDistPopup1(props) {
  const [inkOrdDistPopup2Grid1, setInkOrdDistPopup2Grid1] = useState(null);
  const [inkOrdDistPopup2Grid2, setInkOrdDistPopup2Grid2] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [getViewIsUpdated] = useViewStore(state => [state.getViewIsUpdated]);
  const activeViewId = getActiveViewId();

  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);

  const { handleSubmit, getValues, setValue, control, clearErrors, watch } = useForm({
    defaultValues: {
      purcPeriod: [
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)
      ],
    },
  });

  function afterPopupGridCreate1(gridObj) {
    setInkOrdDistPopup2Grid1(gridObj);
  }
  function afterPopupGridCreate2(gridObj) {
    setInkOrdDistPopup2Grid2(gridObj);
    gridComboLoad(gridObj, {
      PROCEDURE_NAME: "SP_UI_PK_ORN_GRID_COMBO_Q",
      URL: "common/data",
      CODE_VALUE: "DISP_CD",
      CODE_LABEL: "DISP_NM",
      COLUMN: "GR_PLANT_CD",
      PROP: "lookupData",
      PARAM_KEY: ["P_GRID_VAL_01"],
      PARAM_VALUE: ["PK_GR_PLANT_CD"],
      TRANSLANG_LABEL: true,
    });
  }

  function setInkOrdDistPopup2Grid1Options(gridObj) {
    setVisibleProps(gridObj, false, false, true);
    gridObj.gridView.displayOptions.fitStyle = 'fill';
    gridObj.gridView.header.height = 50;

    gridObj.gridView.onCellClicked = function (grid, clickData) {
      if (clickData.cellType === "data") {
        let row = grid.getValues(clickData.itemIndex);
        if (inkOrdDistPopup2Grid2) {
          loadPopupData2(inkOrdDistPopup2Grid2, row);
        }
      }
    };

    const checkableCallback = (dataSource, item) => {
      const chkYn = dataSource.getValue(item.dataRow, 'PURC_YN');
      return chkYn === "Y" ? false : true;
    }
    gridObj.gridView.setCheckBar({ visible: true, syncHeadCheck: true, checkableCallback });
  }
  function setInkOrdDistPopup2Grid2Options(gridObj) {
    setVisibleProps(gridObj, false, false, false);
    gridObj.gridView.displayOptions.fitStyle = 'fill';
    gridObj.gridView.header.height = 50;
  }

  useEffect(() => {
    if (inkOrdDistPopup2Grid1 && inkOrdDistPopup2Grid2) {
      setInkOrdDistPopup2Grid1Options(inkOrdDistPopup2Grid1);
      setInkOrdDistPopup2Grid2Options(inkOrdDistPopup2Grid2);
      loadPopupData1();
    }
  }, [inkOrdDistPopup2Grid1, inkOrdDistPopup2Grid2])

  useEffect(() => {
    if (getValues('purcPeriod')) {
      if (inkOrdDistPopup2Grid1 && inkOrdDistPopup2Grid2) {
        loadPopupData1();
      }
    }
  }, watch('purcPeriod'))

  function loadPopupData1() {
    let params = {
      P_PURC_ST_DT: new Date(getValues('purcPeriod')[0]).format('yyyyMMdd'),
      P_PURC_END_DT: new Date(getValues('purcPeriod')[1]).format('yyyyMMdd'),
      P_USER_ID: username
    }
    zAxios({
      method: 'post',
      url: 'pk/ordermgmt/inkorddistpopup/q2',
      data: params,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === HTTP_STATUS.SUCCESS) {
          inkOrdDistPopup2Grid1.dataProvider.fillJsonData(res.data);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        let focusCell = inkOrdDistPopup2Grid1.gridView.getCurrent();
        let targetRow = focusCell.itemIndex;
        let index = focusCell.itemIndex === -1 ? { itemIndex: 0 } : { itemIndex: targetRow }
        setTimeout(() => {
          inkOrdDistPopup2Grid1.gridView.setCurrent(index);
          let row = inkOrdDistPopup2Grid1.gridView.getValues(index.itemIndex);
          if (row) {
            loadPopupData2(inkOrdDistPopup2Grid2, row);
          }
        }, 100);
      });
  }

  function loadPopupData2(grid, row) {
    if (row.PURC_YN === "N") {
      setSaveBtnDisabled(false);
    } else {
      setSaveBtnDisabled(true);
    }

    let params = {
      P_PURC_DT: row.PURC_DT,
      P_VENDOR_CD: row.VENDOR_CD,
      P_PURC_SEQ: row.PURC_SEQ,
      P_USER_ID: username
    }
    zAxios({
      method: 'post',
      url: 'pk/ordermgmt/inkorddistpopup/q3',
      data: params,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === HTTP_STATUS.SUCCESS) {
          grid.setData(res.data)
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  //팝업창 닫을때 수정 중인지 확인하는 로직 추가 
  function popClose() {
    let checks = [inkOrdDistPopup2Grid1, inkOrdDistPopup2Grid2];
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

  const purcInkSend = () => {
    let updateRows = [];
    inkOrdDistPopup2Grid1.gridView.getCheckedRows().forEach(function (indx) {
      updateRows.push(indx);
    });

    if (updateRows.length == 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_CHECK_VALID_INPUT'), { close: false });
    } else {
      let dataArr = [];
      updateRows.forEach(function (row) {
        let data = inkOrdDistPopup2Grid1.dataProvider.getJsonRow(row);
        data.USER_ID = username;
        dataArr.push(data);
      });

      zAxios({
        method: 'post',
        headers: { 'content-type': 'application/json' },
        url: baseURI() + 'pk/ordermgmt/inkorddistpopup/send',
        data: dataArr,
        fromPopup: true
      })
        .then(function (res) {
          if (res.status === HTTP_STATUS.SUCCESS) {

            let data = res.data;
            let ifKey = data.P_IF_KEY

            if (ifKey !== '') {
              ifReqSend(ifKey);  //자재 발주 SnOP PR I/F 호출
            }

            showMessage(transLangKey("MSG_CONFIRM"), transLangKey('MSG_SUCCESS_MOVE'), { close: false });
            loadPopupData1();
          } else {
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(res.data.message), { close: false });
          }
        })
        .catch(function (e) {
          console.error(e);
        });
    }
  }

  const ifReqSend = (ifKey) => {
    let data = {
      IF_KEY: ifKey
    }

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'snopif/snoppr',
      data: data
    })
      .then(function (res) {
        if (res.status === HTTP_STATUS.SUCCESS) {
          //showMessage(transLangKey("MSG_CONFIRM"), transLangKey(res.data.message), { close: false });
          //refresh();
        }
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
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
          data.DEL_YN = data.DEL_YN ? "Y" : "N";
          data.USER_ID = username;
          data.DLV_REQ_DT = data.DLV_REQ_DT.split('-').join('');
          changeRowData.push(data);
        });
        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          zAxios({
            method: 'post',
            headers: { 'content-type': 'application/json' },
            url: baseURI() + 'pk/ordermgmt/inkorddistpopup/s1',
            data: changeRowData,
            fromPopup: true
          })
            .then(function (res) {
              if (res.status === HTTP_STATUS.SUCCESS) {
                showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_0001"), { close: false });
                let focusCell = inkOrdDistPopup2Grid1.gridView.getCurrent();
                let grid1Data = inkOrdDistPopup2Grid1.gridView.getValues(focusCell.itemIndex);
                if (grid1Data) {
                  loadPopupData2(inkOrdDistPopup2Grid2, grid1Data);
                }
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
      <PopupDialog open={props.open} onClose={props.onClose} type="CUSTOM" title={transLangKey('PK_PURC_SEARCH')} resizeHeight={400} resizeWidth={1300} checks={[inkOrdDistPopup2Grid1, inkOrdDistPopup2Grid2]}
        buttons={<>
          <Button onClick={() => { saveData(inkOrdDistPopup2Grid2) }} variant={'contained'} disabled={saveBtnDisabled}>{transLangKey("SAVE")}</Button>
          <Button onClick={popClose} variant={'contained'} >{transLangKey("CLOSE")}</Button>
        </>}>
        <SearchArea>
          <InputField type="dateRange" name="purcPeriod" label={[transLangKey("PK_PURC_PERIOD"), null]} control={control} dateformat="yyyy-MM-dd" />
          <Button onClick={() => { purcInkSend() }} variant={'contained'} sx={{ margin: "auto 0 auto 10px" }}>{transLangKey("PK_PRUC_INK_SEND")}</Button>
        </SearchArea>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
          <Box sx={{ flex: 4, paddingRight: '5px' }}>
            <BaseGrid id='inkOrdDistPopup2Grid1' items={inkOrdDistPopup2GridColumns1} afterGridCreate={afterPopupGridCreate1} />
          </Box>
          <Box sx={{ flex: 6, paddingLeft: '5px' }}>
            <BaseGrid id='inkOrdDistPopup2Grid2' items={inkOrdDistPopup2GridColumns2} afterGridCreate={afterPopupGridCreate2} />
          </Box>
        </Box>
      </PopupDialog >
    </>
  );
}

export default PopInkOrdDistPopup1;
