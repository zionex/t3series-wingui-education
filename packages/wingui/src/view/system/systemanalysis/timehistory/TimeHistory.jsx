import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup, Box } from '@mui/material';
import {
  ContentInner, WorkArea, SearchArea, ResultArea, SearchRow, InputField, BaseGrid, GridCnt,
  StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, useViewStore, useContentStore, zAxios, GridExcelExportButton, Pagination
} from "@wingui/common/imports";

let thGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "username", dataType: "text", headerText: "USER_ID", visible: true, editable: false, width: 100 },
  { name: "userIp", dataType: "text", headerText: "USER_IP", visible: true, editable: false, width: 100 },
  { name: "userBrowser", dataType: "text", headerText: "USER_BROWSER", visible: true, editable: false, width: 100 },
  { name: "viewCd", dataType: "text", headerText: "MENU_CD", visible: true, editable: false, width: 100 },
  { name: "viewNm", dataType: "text", headerText: "MENU_NM", visible: true, editable: false, width: 100 },
  { name: "executionDttm", dataType: "datetime", headerText: "EXECUTION_DTTM", visible: true, editable: false, width: 80, format: "yyyy-MM-dd HH:mm:ss" },
  { name: "modifyDttm", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: 80, format: "yyyy-MM-dd HH:mm:ss" },
  { name: "runningTime", dataType: "number", headerText: "RUNNING_TIME", visible: true, editable: false, width: 80 },
]

function timehistory() {
  const activeViewId = getActiveViewId()
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [thGrid, setThGrid] = useState(null);
  const [disabledPagination, setDisabledPagination] = useState(true);
  const { control, getValues, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      username: "", menuCd: "", menuName: "",
      dateRage: [(new Date().format("yyyy-MM-dd")), (new Date().format("yyyy-MM-dd"))],
    }
  });

  const gridId = useRef(null);
  if (!gridId.current) {
    gridId.current = generateId();
  }

  const [settings, setSettings] = useState({
    currentPage: 0, // 현재 페이지
    totalPages: 1, // 전체 페이지
    perPageSize: 20, // 페이지 수 기본 값 설정
  })

  useEffect(() => {
    if (thGrid && settings.localDataSource) {
      thGrid.dataProvider.fillJsonData(settings.localDataSource);
    }
  }, [settings])

  const globalButtons = [
    { name: "search", action: (e) => { onSubmit() }, visible: true, disable: false }
  ]

  useEffect(() => {
    if (thGrid) {
      setViewInfo(activeViewId, 'globalButtons', globalButtons)
    }
  }, [thGrid])

  const afterGridCreate = (gridObj, gridView) => {
    setThGrid(gridObj)
    gridView.displayOptions.fitStyle = "fill";
    gridView.displayOptions.rowHeight = 30;
    
		gridView.excelExportOptions = {
      lookupDisplay: false,
      separateRows: true,
      footer: "default",
      headerDepth: 2,
      importExceptFields: { 0: "id" },
		};
  };

  const onSubmit = () => {
    loadData(1);
  };

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function loadData(page) {
    let dateRange = getValues("dateRage");
    let fromdate = dateRange ? new Date(dateRange[0]).format('yyyyMMdd') : new Date('1970', '00', '01').format('yyyyMMdd');
    let todate = dateRange ? new Date(dateRange[1]).format('yyyyMMdd') : new Date().format('yyyyMMdd');

    let params = {
      'page': Math.max(page, 1) - 1,
      'size': settings.perPageSize,
      'startDate': fromdate,
      'endDate': todate,
      'menuCd': getValues("menuCd"),
      'menuNm': getValues("menuName"),
      'username': getValues("username")
    }
    zAxios({
      method: "get",
      header: { "content-type": "application/json" },
      url: "system/logs/view-execution",
      params: params,
      selector: `TimeHistory-${gridId.current}`

    }).then(function (res) {
      let newSetting = { ...settings }
      if (res.status === HTTP_STATUS.SUCCESS) {
        if (res.data.totalPages === 0) {
          setDisabledPagination(true);
        } else {
          setDisabledPagination(false);
        }
        newSetting.currentPage = res.data.number + 1;
        newSetting.totalPages = res.data.totalPages;
        newSetting.mTotal = res.data.totalElements;
        newSetting.localDataSource = res.data.content;
        setSettings(newSetting);
      } else if (res.status === HTTP_STATUS.NO_CONTENT) {
        thGrid.dataProvider.clearRows();
      }
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
    });
  }

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField type="dateRange" name={"dateRage"} width={"426px"} control={control} displayType={"date"} rules={{ required: '기간은 필수값입니다.' }}/>
          <InputField name="menuCd" label={transLangKey("MENU_CD")} readonly={false} disabled={false} control={control} />
          <InputField name="menuName" label={transLangKey("MENU_NM")} readonly={false} disabled={false} control={control} />
          <InputField name="username" label={transLangKey("USER_NAME")} readonly={false} disabled={false} control={control} />
        </SearchRow>
      </SearchArea>
      <WorkArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="thGrid" />
          </LeftButtonArea>
          <RightButtonArea></RightButtonArea>
        </ButtonArea>
        <Box style={{ height: "88%" }} id={`TimeHistory-${gridId.current}`}>
          <BaseGrid id={gridId.current} items={thGridItems} afterGridCreate={afterGridCreate}></BaseGrid>
          <Pagination sx={{ display: 'flex', justifyContent: 'center'}} disabled={disabledPagination} settings={settings} onClick={loadData} />
        </Box>
      </WorkArea>
    </ContentInner>
  )
}

export default timehistory
