import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  ContentInner, WorkArea, StatusArea,
  InputField, GridDeleteRowButton, BaseGrid, zAxios, useUserStore, useViewStore, Pagination, ResultArea,
  ButtonArea, LeftButtonArea, RightButtonArea, SearchArea,
  SearchMenuInput, transLangKey, useContentStore, useSearchPositionStore 
} from '@zionex/wingui-core/index'

import PopIssue from "@zionex/wingui-core/utils/issue/PopIssue";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './issuemgmt.css'

import { Box } from "@mui/system";
import { Button, ButtonGroup, ClickAwayListener, FormGroup, Grow, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const statusOptions = [
  { value: 'A', label: transLangKey('ALL') },
  { value: 'O', label: transLangKey('OPEN') },
  { value: 'C', label: transLangKey('CLOSED') }
];

const options = [{ value: 'all', label: transLangKey('ALL_ISSUE') }, { value: 'assigned', label: transLangKey('ASSIGNED_ISSUE') }, { value: 'assign', label: transLangKey('ALL_MY_ISSUE') }];

function IssueMgmt() {
  const activeViewId = getActiveViewId()
  const [setSearchPosition] = useSearchPositionStore(state => [state.setSearchPosition])
  const [username, systemAdmin] = useUserStore((state) => [state.username, state.systemAdmin]);
  const [setViewInfo] = useViewStore(state => [state.setViewInfo]);
  const [diabledPagination, setDisabledPagination] = useState(true);
  const [issueMgmtItems, setissueMgmtItems] = useState([
    { name: "id", dataType: "text", headerText: "issueId", visible: false, editable: false, width: "50" },
    {
      name: "status", dataType: "text", headerText: "STATUS", visible: true, editable: false, width: "50", textAlignment: "center",
      displayCallback: function (grid, index, value) {
        return value === 'O' ? transLangKey('OPEN') : transLangKey('CLOSED');
      }
    },
    {
      name: "menuCd", dataType: "text", headerText: "VIEW_NAME", visible: true, editable: false, width: "100",
      displayCallback: function (grid, index, value) {
        return value === 'COMMON' ? transLangKey('COMMON_ISSUE') : transLangKey(value);
      }
    },
    {
      name: "title", dataType: "text", headerText: "TITLE", visible: true, editable: false, width: "300",
    },
    {
      name: "priority", dataType: "text", headerText: "IMPORTANCE", visible: true, editable: false, width: "50", textAlignment: "center", lookupDisplay: true, values: ['H', 'M', 'L'], labels: [transLangKey('HIGH'), transLangKey('MEDIUM'), transLangKey('LOW')],
      styleCallback: function (grid, dataCell) {
        let ret = {};
        let priority = grid.getValue(dataCell.index.itemIndex, "priority");
        let status = grid.getValue(dataCell.index.itemIndex, "status");
        if (priority == 'H' && status == 'O') {
          ret.styleName = "issue-open-status";
        }
        return ret;
      },
    },
    { name: "assignees", dataType: "text", headerText: "ASSIGNEE", visible: true, editable: false, width: "100", textAlignment: "center" },
    { name: "grpAssignYn", dataType: "boolean", headerText: "GRP_AGGIN_YN", visible: false, editable: false, width: "50", textAlignment: "center" },
    { name: "startDttm", dataType: "datetime", headerText: "STRT_DTTM", visible: true, editable: false, width: "100", textAlignment: "center" },
    { name: "endDttm", dataType: "datetime", headerText: "END_DTTM", visible: true, editable: false, width: "100", textAlignment: "center" },
    { name: "content", dataType: "text", headerText: "content", visible: false, editable: false, width: "100", textAlignment: "center" },
    { name: "createByDisplayName", dataType: "text", headerText: "WRITER", visible: true, editable: false, width: "100", textAlignment: "center" },
    { name: "createBy", dataType: "text", headerText: "createBy", visible: false, editable: false, width: "100", textAlignment: "center" },
    { name: "createDttm", dataType: "datetime", headerText: "NB_POST_DATE", visible: true, editable: false, width: "100", textAlignment: "center" },
    { name: "modifyBy", dataType: "text", headerText: "modifyBy", visible: false, editable: false, width: "100", textAlignment: "center" },
    { name: "modifyDttm", dataType: "datetime", headerText: "modifyDttm", visible: false, editable: false, width: "100", textAlignment: "center" },
    { name: "commentYn", dataType: "boolean", headerText: "commentYn", visible: false, editable: false, width: "50", textAlignment: "center" },
    { name: "publicYn", dataType: "text", headerText: "publicYn", visible: false, editable: false, width: "50", textAlignment: "center" },
    {
      name: "deleteYn", dataType: "boolean", headerText: "NB_DELETE_YN", visible: true, editable: false, width: "50", textAlignment: "center",
      styleCallback: function (grid, dataCell) {
        let ret = {};
        let createBy = grid.getValue(dataCell.index.itemIndex, 'createBy')
        if (systemAdmin || username === createBy) {
          ret.editable = true;
          ret.renderer = { editable: true };
          ret.styleName = 'editable-column';
        } else {
          ret.styleName = 'text-center';
        }
        return ret;
      }
    },
    { name: "deleteBy", dataType: "text", headerText: "deleteBy", visible: false, editable: false, width: "100", textAlignment: "center" },
    { name: "deleteDttm", dataType: "datetime", headerText: "deleteDttm", visible: false, editable: false, width: "100", textAlignment: "center" },
    { name: "files", dataType: "text", headerText: "files", visible: false, editable: false, width: "50", textAlignment: "center" },
    { name: "issueType", dataType: "text", headerText: "IssueType", visible: false, editable: false, width: "50", textAlignment: "center" },
  ]);

  const { handleSubmit, reset, control, setValue, getValues, watch, register, clearErrors } = useForm({
    defaultValues: {
      option: '1',
      search: '',
      after15days: [],
      issueOptions: 'all',
      status: 'A'
    }
  });

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [issueMgmt, setissueMgmt] = useState(null);
  const [settings, setSettings] = useState({
    currentPage: 0, // 현재 페이지
    totalPages: 1, // 전체 페이지
    perPageSize: 20, // 페이지 수 기본 값 설정
  })
  const [currentIssue, setcurrentIssue] = useState(null)
  const [openDetailPop, setOpenDetailPop] = useState(false);
  const [popupMode, setPopupMode] = useState('READ')

  useEffect(() => {
    setSearchPosition(activeViewId, "top");
  }, []);
  
  useEffect(() => {
    if (issueMgmt) {
      const globalButtons = [
        {
          name: "search",
          action: (e) => { loadPage(1) },
          visible: true,
          disable: false
        }
      ]
      setViewInfo(activeViewId, 'globalButtons', globalButtons)
    }
  }, [selectedIndex, issueMgmt])
  const afterGridCreate = (gridObj, gridView, dataProvider) => {
    setissueMgmt(gridObj);
    gridView.setDisplayOptions({ rowHeight: 31 });
  };
  const openPopupCellDblClicked = (grid, clickData) => {
    if (clickData.cellType != "check" && clickData.column != "head" && clickData.cellType == "data" && clickData.column == 'title') {
      const dataPropvider = grid.getDataSource();
      const data = dataPropvider.getJsonRow(clickData.dataRow)
      if (data != null) {
        setcurrentIssue(data)
        setPopupMode('READ');
        setOpenDetailPop(true);
      }
    }
  }
  const getRadioValue = (value) => {
    if (Array.isArray(value) && value.length > 0)
      return value[0]
    else
      return value;
  }

  const loadPage = (page) => {
    let status = getValues('status') ? getRadioValue(getValues('status')) : '';
    let assigned = null;
    let selectOption = getValues('issueOptions');
    if (selectOption === 'assign') {
      assigned = false;
    } else if (selectOption === 'assigned') {
      assigned = true;
    }

    zAxios.get(baseURI() + 'issue', {
      params: {
        'search': getValues('search'),
        'option': getValues('option'),
        'view-cd': getValues('viewId') === 'COMMON_ISSUE' ? 'COMMON' : (getValues('viewId') || ''),
        'is-assigned': assigned,
        'status': status === 'A' ? '' : status,
        'after15days': getValues('after15days')[0] === 'Y' ? 'Y' : '',
        'page': Math.max(page, 1) - 1,
        'size': settings.perPageSize
      }
    }).then(function (response) {
      let newSetting = { ...settings }
      if (response.status === HTTP_STATUS.SUCCESS) {
        if (response.data.pageContent.totalPages == 0) {
          setDisabledPagination(true)
        } else {
          setDisabledPagination(false)
        }
        newSetting.currentPage = response.data.pageContent.number + 1;
        newSetting.totalPages = response.data.pageContent.totalPages

        newSetting.mTotal = response.data.pageContent.totalElements;

        let localDataSource = [];

        if (response.data.pageContent.content) {
          response.data.pageContent.content.forEach(content => {
            let el = { ...content };
            let reciever = ''
            if (content.assignees) {
              reciever = content.assignees.toString()
            }
            el['assignees'] = reciever
            localDataSource.push(el)
          })
        }
        newSetting.localDataSource = localDataSource;
        setSettings(newSetting)
        issueMgmt.dataProvider.fillJsonData(newSetting.localDataSource)
      }
    })
      .catch(function (error) {
        console.log(error);
      })
      .then(function (response) { });
  }
  const deleteBoard = () => {
    issueMgmt.gridView.commit();
    let deleteRows = issueMgmt.gridView.getJsonRows().filter(r => r.deleteYn == true)
    if (deleteRows.length == 0) {
      showMessage(transLangKey('WARNING'), transLangKey('MSG_SELECT_DELETE'), { close: false })
      return;
    }

    let deleteIds = [];
    deleteRows.forEach(function (row) {
      deleteIds.push(row.id);
    });

    zAxios({
      method: 'post',
      url: baseURI() + 'issue/delete',
      data: deleteIds
    }).catch(function (error) {
      console.log(error);
    }).then(function () {
      loadPage(settings.currentPage);
    });
  }

  const handleMenuItemClick = (event, index, value) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  return (
    <ContentInner>
      <WorkArea>
        <SearchArea>
          <InputField type="select" name="issueOptions" label={transLangKey("이슈 타입")} control={control} options={options}></InputField>
          <InputField type="select" name='status' label={transLangKey("STATUS")} control={control} options={statusOptions}></InputField>
          <InputField name='search' label={transLangKey("FIND_ISSUE")} placeholder={transLangKey("FIND_ISSUE")} control={control} enterSelect></InputField>
          <SearchMenuInput view="UI_UT_ISSUE_MGMT" name='viewId' label={transLangKey("VIEW")} control={control}></SearchMenuInput>
          <InputField type="check" name='after15days' control={control} options={[{ label: transLangKey("15일 경과 제외"), value: "Y" }]} />
        </SearchArea>
        <ButtonArea sx={{ width: "100%", display: 'flex' }} p={1}>
          <LeftButtonArea>
            {/* </Box> */}
          </LeftButtonArea>
          <RightButtonArea sx={{ display: 'flex', alignItems: 'center' }}>
            <GridDeleteRowButton grid='noticeGrid' onClick={deleteBoard}></GridDeleteRowButton>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea style={{ height: '84%' }}>
          <BaseGrid id="issueMgmt" items={issueMgmtItems} afterGridCreate={afterGridCreate} onCellDblClicked={openPopupCellDblClicked} className="issue-mgmt" ></BaseGrid>
        </ResultArea>
        <Pagination diabled={diabledPagination} settings={settings} onClick={loadPage} />
        <StatusArea></StatusArea>
      </WorkArea>
      {openDetailPop ? <PopIssue open={openDetailPop} data={currentIssue} loadPage={() => loadPage(settings.currentPage)} popupMode={popupMode} onClose={() => setOpenDetailPop(false)} /> : null}
    </ContentInner >
  )
}

export default IssueMgmt;