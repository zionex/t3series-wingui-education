import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, Tooltip } from "@mui/material";
import TextField from "@mui/material/TextField";
import {
  ContentInner, WorkArea, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, CommonButton,
  BaseGrid, useViewStore, useContentStore, zAxios, SplitPanel, VLayoutBox
} from '@wingui/common/imports';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

let servGridItems = [
  { name: "SERVER_ID", headerText: "SERVER_ID", dataType: "text", width: "150", editable: false, visible: true },
  { name: "STATUS", headerText: "STATUS", dataType: "text", width: "100", editable: false, visible: true },
  { name: "EXPIRE_DATE", headerText: "EXPIRE_DATE", dataType: "text", width: "100", editable: false, visible: true },
  { name: "MESSAGE", headerText: "MSG", dataType: "text", width: "500", editable: false, visible: true },
]

let possessionItems = [
  { name: "SERVER_ID", headerText: "SERVER_ID", dataType: "text", width: "150", editable: false, visible: true },
  { name: "VERSION", headerText: "VERSION", dataType: "text", width: "80", editable: false, visible: true },
  { name: "PRODUCT", headerText: "PRODUCT", dataType: "text", width: "100", editable: false, visible: true },
  { name: "HWADDR", headerText: "HARDWARE_ADDRESS", dataType: "text", width: "150", editable: false, visible: true },
  { name: "EXPIRE_DATE", headerText: "EXPIRE_DATE", dataType: "text", width: "80", editable: false, visible: true },
  { name: "INSTANCE_COUNT", headerText: "INSTANCE_COUNT", dataType: "text", width: "120", editable: false, visible: true },
  { name: "DIR", headerText: "DIR", dataType: "text", width: "400", editable: false, visible: true },
]

function License() {
  const [servGrid, setservGrid] = useState(null);
  const [servDetailGrid, setservDetailGrid] = useState(null);
  const [licenseInfo, setLicenseInfo] = useState('');
  const activeViewId = getActiveViewId()
  const [setViewInfo] = useViewStore(state => [state.setViewInfo])
  const { control, getValues, formState: { errors } } = useForm({
    defaultValues: {
    }
  })
  const globalButtons = [
    { name: "search", action: (e) => { getLicenseResult() }, visible: true, disable: false }
  ]

  const afterServGridGridCreate = (gridObj, gridView, dataProvider) => {
    setservGrid(gridObj)
    setOption(gridObj);
  };

  const afterGridCreate = (gridObj, gridView, dataProvider) => {
    setservDetailGrid(gridObj)
  };

  useEffect(() => {
    if (servGrid) {
      setViewInfo(activeViewId, 'globalButtons', globalButtons)

      getLicenseResult()
      getLicensePossession()
    }
  }, [servGrid]);

  function setOption(gridObj) {
    gridObj.gridView.onCellEdited = function (grid) {
      grid.commit(true);
    }
  }
  function getLicenseResult() {
    servGrid.gridView.commit(true);

    servGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios({
      method: 'post',
      url: 'engine/LicenseServer/GetLicenseResultInfo',
      headers: { 'content-type': 'application/json' },
      params: {
        timeout: 0,
        PREV_OPERATION_CALL_ID: 'validate_wait_on',
        CURRENT_OPERATION_CALL_ID: 'loadNorthGrid'
      },
      waitOn: false
    }).then(function (res) {
      servGrid.dataProvider.fillJsonData(res.data[RESULT_DATA]);
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
      servGrid.gridView.hideToast();
    })
  }
  function getLicensePossession() {
    servDetailGrid.gridView.commit(true);

    servDetailGrid.gridView.showToast(progressSpinner + 'Load Data...', true);
    zAxios({
      method: 'post',
      url: 'engine/LicenseServer/GetLicensePossessionInfo',
      headers: { 'content-type': 'application/json' },
      params: {
        timeout: 0,
        PREV_OPERATION_CALL_ID: 'loadNorthGrid',
        PREV_OPERATION_RESULT_CODE: 'RESULT_CODE_SUCCESS',
        PREV_OPERATION_RESULT_MESSAGE: 'SUCCESS',
        PREV_OPERATION_RESULT_SUCCESS: true,
        CURRENT_OPERATION_CALL_ID: 'reloadCenterGrid'
      },
      waitOn: false
    }).then(function (res) {
      servDetailGrid.dataProvider.fillJsonData(res.data[RESULT_DATA]);
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
      servDetailGrid.gridView.hideToast();
    })
  }
  function getServerLicenseInfo() {
    zAxios({
      method: 'post',
      url: 'engine/LicenseServer/GetServerLicenseInfo',
      headers: { 'content-type': 'application/json' },
      params: {
        timeout: 0,
        CURRENT_OPERATION_CALL_ID: 'LoadTextArea'
      },
      waitOn: false
    }).then(function (res) {
      setLicenseInfo(res.data[RESULT_DATA]['SERVER_LICENSE_INFO'])
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
    })
  }
  return (
    <ContentInner>
      <WorkArea>
        <SplitPanel direction={'vertical'} sizes={[30, 30, 40]}>
          <Box>
            <ButtonArea title={transLangKey('LICENSE_CONFIRMATION_INFO')} >
              <LeftButtonArea></LeftButtonArea>
              <RightButtonArea></RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px)" }}>
              <BaseGrid title={transLangKey('LICENSE_CONFIRMATION_INFO')} id="servGrid" items={servGridItems} afterGridCreate={afterServGridGridCreate}></BaseGrid>
            </Box>
          </Box>
          <Box>
            <ButtonArea title={transLangKey('LICENSE_POSSESSION_INFO')} >
              <LeftButtonArea></LeftButtonArea>
              <RightButtonArea>
                <CommonButton title={transLangKey('LICENSE_POSSESSION_INFO')} onClick={() => { getLicensePossession() }} ><Icon.Search /></CommonButton>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px)" }}>
              <BaseGrid id="servDetailGrid" items={possessionItems} afterGridCreate={afterGridCreate}></BaseGrid>
            </Box>
          </Box>
          <Box>
            <ButtonArea title={transLangKey('LICENSE_KEY_INFO')}>
              <LeftButtonArea></LeftButtonArea>
              <RightButtonArea>
                <CommonButton title={transLangKey('LICENSE_KEY_CREATION')} startIcon={<ArrowCircleDownIcon />} type='text' onClick={() => { getServerLicenseInfo() }}><ArrowCircleDownIcon /></CommonButton>
              </RightButtonArea>
            </ButtonArea>
            <TextField 
              value={licenseInfo}
              multiline
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  height: "300px",
                  alignItems: "flex-start", 
                  padding: "10px"
                },
                "& .MuiOutlinedInput-input": {
                  height: "100% !important",
                  overflow: "auto !important"
                },
              }}
            />
          </Box>
        </SplitPanel>
      </WorkArea>
    </ContentInner >
  )
}

export default License;