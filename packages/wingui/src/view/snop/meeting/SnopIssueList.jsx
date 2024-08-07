import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import {
  ContentInner, WorkArea, StatusArea,
  InputField, GridDeleteRowButton, BaseGrid, zAxios, useUserStore, useViewStore, Pagination, ResultArea,
  ButtonArea, LeftButtonArea, RightButtonArea,
  SearchMenuInput, transLangKey, useContentStore
} from '@zionex/wingui-core/index'

import PopIssue from "@zionex/wingui-core/utils/issue/PopIssue";

import { Box } from "@mui/system";
import { Button, ButtonGroup, ClickAwayListener, FormGroup, Grow, MenuItem, MenuList, Paper, Popper } from "@mui/material";
const statusOptions = [
  { value: '', label: 'ALL' },
  { value: 'O', label: 'OPEN' },
  { value: 'C', label: 'CLOSE' },
];

const SnopIssueList= forwardRef((props,ref) => {
    
  const activeViewId = getActiveViewId()
  const [username, systemAdmin] = useUserStore((state) => [state.username, state.systemAdmin]);
  const [setViewInfo] = useViewStore(state => [state.setViewInfo]);
  const [setIssueDrawerOpen] = useViewStore(state => [state.setIssueDrawerOpen]);

  const [diabledPagination, setDisabledPagination] = useState(true);
  const [issueMgmtItems, setissueMgmtItems] = useState([
    { name: "id", dataType: "text", headerText: "issueId", visible: false, editable: false, width: "50" },
    {
      name: "status", dataType: "text", headerText: "STATUS", visible: true, editable: false, width: "50", textAlignment: "center",
      displayCallback: function (grid, index, value) {
        return value === 'O' ? transLangKey('OPEN') : transLangKey('CLOSE');
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
      styleCallback: function (grid, dataCell) {
        let ret = {};
        let priority = grid.getValue(dataCell.index.itemIndex, "priority");
        let status = grid.getValue(dataCell.index.itemIndex, "status");
        if (priority == 'H' && status == 'O') {
          ret.styleName = "issueOpenStatus column-textAlignt-near";
        }
        else if (status == 'C') {
          ret.styleName = "issueCloseStatus column-textAlignt-near ";
        }
        return ret;
      },
    },
    { name: "priority", dataType: "text", headerText: "IMPORTANCE", visible: true, editable: false, width: "50", textAlignment: "center", lookupDisplay: true, values: ['H', 'M', 'L'], labels: [transLangKey('HiGH'), transLangKey('MEDIUM'), transLangKey('LOW')] },
    {
      name: "reciever", dataType: "text", headerText: "ASSIGNEE", visible: true, editable: false, width: "150",
      displayCallback: function (grid, index, value) {
        const dataPropvider = grid.getDataSource()
        const recieverDisplayName = dataPropvider.getValue(index.dataRow, 'recieverDisplayName');
        return recieverDisplayName;
      }
    },
    {
      name: "recieverList", dataType: "object", headerText: "ASSIGNEE", visible: false, editable: false, width: "150",
    },
    { name: "startDttm", dataType: "datetime", headerText: "START_DTTM", visible: true, editable: false, width: "100", textAlignment: "center" },
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
    { name: "recieverDisplayName", dataType: "text", headerText: "files", visible: false, editable: false, width: "50", textAlignment: "center" },
    { name: "issueType", dataType: "text", headerText: "IssueType", visible: false, editable: false, width: "50", textAlignment: "center" },
  ]);

  const { handleSubmit, reset, control, setValue, getValues, watch, register, clearErrors } = useForm({
    defaultValues: {
      option: '1',
      search: '',
      after15days: []
    }
  });

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

  useEffect(()=>{
    loadPage(1)
  },[])
  
  const afterGridCreate = (gridObj, gridView, dataProvider) => {
    setissueMgmt(gridObj);
  };
  const openPopupCellDblClicked = (grid, clickData) => {
    if (clickData.cellType != "check" && clickData.column != "head" && clickData.cellType == "data" && clickData.column == 'title') {
      const dataPropvider = grid.getDataSource();
      const data = dataPropvider.getJsonRow(clickData.dataRow)
      if (data != null) {
        //Popup Detail화면으로 열경우
        // setcurrentIssue(data)
        // setPopupMode('READ');
        // setOpenDetailPop(true);

        //Drawer로 열경우
        let issueId = data.id;
        setIssueDrawerOpen(issueId);

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
    if (!issueMgmt) {
      return;
    }

    let status = getValues('status') ? getRadioValue(getValues('status')) : '';

    zAxios.get(baseURI() + 'issue', {
      params: {
        'search': getValues('search'),
        'option': getValues('option'),
        'view-cd': getValues('viewId') === 'COMMON_ISSUE' ? 'COMMON' : (getValues('viewId') || ''),
        'issue-type': 'S',
        'status': status,
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
          response.data.pageContent.content.forEach(e => {
            let el = { ...e };
            let reciever = []
            if (e.recieverList) {
              e.recieverList.forEach(r => {
                reciever.push(r.displayName)
              });
            }
            el['recieverDisplayName'] = reciever.join(",");
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

  const deleteIssue = () => {
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
  
  useImperativeHandle(ref,() => (
    {
        loadPage:loadPage,
        deleteIssue:deleteIssue
    })
  );

  return (
    <>
      <Box style={{width:'100%', height:'100%'}}>
        {/* <ButtonArea sx={{ width: "100%", display: 'flex' }} p={1}>
          <LeftButtonArea sx={{ flexGrow: 1, display:'flex',alignItems:'center'}}>
            <FormGroup row sx={{ display: 'flex', alignItems:'center' }}>                
                <InputField inputType="floating" name='search' label={transLangKey("FIND_ISSUE")} placeholder={transLangKey("FIND_ISSUE")} control={control} />
            </FormGroup>
            <InputField inputType="floating" type="check" name='after15days' control={control} options={[{ label: transLangKey("15일 경과 제외"), value: "Y" }]} />
          </LeftButtonArea>
          <RightButtonArea sx={{display:'flex',alignItems:'center'}}>
            <Box style={{ display: 'inline-flex',alignItems:'center' }}>
              <InputField inputType="floating" name='status' width="250px" label={transLangKey("STATUS")} type='radio' control={control} options={statusOptions}></InputField>              
            </Box>
          </RightButtonArea>
        </ButtonArea> */}
        <BaseGrid id="issueMgmt" 
            items={issueMgmtItems} 
            afterGridCreate={afterGridCreate} 
            onCellDblClicked={openPopupCellDblClicked} className="issue-mgmt" ></BaseGrid>
        <Pagination diabled={diabledPagination} settings={settings} onClick={loadPage} />
      </Box>
      {openDetailPop ? <PopIssue open={openDetailPop} data={currentIssue} loadPage={() => loadPage(settings.currentPage)} popupMode={popupMode} onClose={() => setOpenDetailPop(false)} /> : null}
    </>
  )
})

export default SnopIssueList;