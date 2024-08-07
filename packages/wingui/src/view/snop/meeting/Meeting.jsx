import React, { useState, useEffect, useRef } from "react";
import _ from 'lodash'
import {
  ContentInner, ButtonArea, LeftButtonArea, RightButtonArea, SearchArea, WorkArea,
  CommonButton, zAxios,getContentStore,
  InputField,  GridAddRowButton, GridDeleteRowButton, useViewStore, useUserStore
} from "@wingui/common/imports";

import { List, ListItem, Divider, ListItemText, ListItemAvatar, Typography, Box, Button, Paper,
  IconButton, Drawer, Tabs, Tab, Avatar, Chip, } from "@mui/material";
import { useForm } from "react-hook-form";

import { PeopleAlt, EventNote,  PsychologyAlt, Visibility, Delete, Save,
  ChevronRight, AccountCircleOutlined, RemoveFromQueueSharp, VisibilityOff, CopyAll } from '@mui/icons-material'

import "./Meeting.css";
import PopSelectUserM from "./PopSelectUserM";
import PopupIssue from '@zionex/wingui-core/utils/issue/PopIssue';

import { SplitPanel, ZEditor, VLayoutBox } from "@zionex/wingui-core";
import AgendaList from "./AgendaList";
import FileList from "./FileList";
import MenuList from "./MenuList";
import AgendaContentEditor from './AgendaContentEditor'
import SnopIssueList from "./SnopIssueList";
import PopDataCopy from "./PopDataCopy";
import {useSnopMeetingStore} from './meetingStore'

createCSSSelector(
  "dateIn",
  JSonToStyleString({
    color: "white",
    "&:hover, &:focus": {
      "background-color": "grey",
    },
    "background-image": "url('/images/icons/calSelect.png')",
    "background-repeat": "no-repeat",
    "background-position": "50% bottom",
    "background-size": "20%",
    "border-top-left-radius": "50%",
    "border-bottom-left-radius": "50%",
    "border-top-right-radius": "50%",
    "border-bottom-right-radius": "50%",
  })
);

const MeetingEditor= React.forwardRef((props , ref)=> {

  const [orgMeetingData,minutes,setMinutes] = useSnopMeetingStore(s => [s.orgMeetingData,s.minutes,s.setMinutes]);

  const onChange=(val)=>{
      setMinutes(val)
  }

  return (<Box style={{ width: '100%', padding: 0, height: '98.5%', maxWidth: 'unset', flex: 1 }}>
              <ZEditor
                value={minutes}
                onChange={onChange}
                locale={props.languageCode}
                placeholder={transLangKey('내용을 입력해주세요.')}
                width="100%"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
                readonly={!orgMeetingData}
              />
        </Box>)
})

const ContentBox = {
  padding: '0 4px 0 4px',
}


function Meeting() {

  /*************************** 변수선언 ***************************/
  const activeViewId = getActiveViewId()
  // const username = useUserStore(state => state.username);
  //1. view 페이지 데이타 store
  const [setViewInfo] = useViewStore(state => [state.setViewInfo]);
  const languageCode = getContentStore(state => state.languageCode);

  //미팅정보 Store 함수
  const [
    initStore,
    orgMeetingData,
    setOrgMeetingData,
    selAgenda,
    getEditingMeetingData,
    isMeetingUpdated,
    addNewAgenda,
    removeAgenda,
    curAttendeeList, setCurAttendeeList,
  ] =
  useSnopMeetingStore(s => [
    s.initStore,
    s.orgMeetingData,
    s.setOrgMeetingData,
    s.selAgenda,
    s.getEditingMeetingData,
    s.isMeetingUpdated,
    s.addNewAgenda,
    s.removeAgenda,
    s.curAttendeeList, s.setCurAttendeeList,
  ]);

  const issueListRef = useRef(null)
  const [option1, setOption1] = useState([]);
  const [meetListOptions, setmeetListOptions] = useState([]);
  const prevMeetDt = useRef(null);

  //3. 상태 메시지
  const [message, setMessage] = useState();

  //4. FORM 데이터 처리
  const { handleSubmit, reset, control, getValues, setValue, watch, register, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      MEET_DT: new Date(),
      START_DTM: new Date(),
      FINISH_DTM: new Date(),
      meetList: null,
    },
  });

  // popup
  const [popSelectUserM, setPopSelectUserM] = useState(false);  // 참석자 리스트 조회 팝업
  const [issueOpen, setIssueOpen] = useState(false);  // 이슈등록팝업
  const [popDataCopy, setPopDataCopy] = useState(false) //일정복사 팝업

  // 화면 layout
  const [drawerOpen, setDrawerOpen] = useState(false); //참석자 슬라이드
  const [tabValue, setTabValue] = useState('tab_agenda'); //탭
  const [menuFileHidden, setMenuFileHidden] = useState(true); //화면+첨부파일 hidden여부

  const fileListRef = useRef({});

  const globalButtons = [
    { name: "search", action: (e) => { onSubmit(); }, visible: true, disable: false },
    { name: "refresh", action: (e) => { refresh(); }, visible: true, disable: false },
  ];

  const onClearFile = () => {
    if(fileListRef.current)
      fileListRef.current.clearFiles();
  }
  //초기화
  const initCurMeetingData=()=>{
    onClearFile();
    initStore();
  }

  /*************************** EVENT ***************************/
  // 날짜를 선택할 경우
  useEffect(() => {
      const selDate = getValues('MEET_DT');

      if(selDate &&  prevMeetDt.current && (prevMeetDt.current != selDate)){
        if( prevMeetDt.current.getTime() != selDate.getTime()){ //클릭날짜와 현재날짜가 다를 시에만 조회
            if(isMeetingUpdated()){ //저장안된 데이터 확인
              showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5142"), function (answer) {
                if (answer) {
                  loadMeeting()
                }else{
                  setValue("MEET_DT", prevMeetDt.current); //클릭전 날짜로 변경
                  return;
                }
              })
            }else{
              loadMeeting()
            }
        }
    }else{
      loadMeeting()
    }

  }, [watch('MEET_DT')]);

  function loadMeeting() {
    prevMeetDt.current = getValues('MEET_DT');
    onClearFile();
    loadMeetingDates();
  }

  /** 회의 목록 */
  useEffect(() => {
    initCurMeetingData()

    const meetListData = getValues("meetList");
    let meetdt = getValues('MEET_DT')
    if (meetdt && meetListData) {
      loadMeetingMaster(meetListData) // 조회
    }
  }, [watch('meetList')]);

  useEffect(() => {
    setViewInfo(activeViewId, 'globalButtons', globalButtons);
    loadMeetingDates();
  }, []);


  /* 조회버튼 */
  function onSubmit() {

    initCurMeetingData();

    const meetListData = getValues("meetList");
    if (meetListData) {
      loadMeetingMaster(meetListData)// 조회
      if(issueListRef.current)
        issueListRef.current.loadPage(1)
    }
  }

  /* 에러처리 */
  function onError(errors, e) {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(
          transLangKey("WARNING"),
          `[${value.ref.name}] ${value.message}`
        );
        clearErrors();
        return false;
      });
    }
  }

  function refresh() {
    reset();
    initCurMeetingData()
  }

  /*****************************************************************************************
   *
   * Function
   * 1.회의록이 작성된 모든일자 조회
   * 2.캘린더에 일자 셋팅 _ 검색조건
   * 3.현재캘린더 날짜와 일치하는 회의목록 셋팅 _검색조건
   * 4.회의시간이 일치한 회의데이터 조회(마스터 -> 아젠다,참석자,화면,첨부,회의록,이슈 조회)
   * 5.조회된 데이터를 각 화면에 display
   *
   * ****************************************************************************************/
  // 1. 회의록을 작성했던 모든 일자를 불러오기
  function loadMeetingDates() {

    initCurMeetingData()

    zAxios({
      method: "get",
      header: { "content-type": "application/json" },
      url: "meeting/dates"
    }).then(function (res) {
        let meetDt = []; //캘린더셋팅용

        let meetDttmObj; //회의목록 셋팅용
        let meetDttmArr = [];

        let currentDate = getValues("MEET_DT").format("yyyy-MM-dd") //현재 캘린더의 날짜
        res.data.forEach(function (row) {
          //전체 캘린더에 데이터셋팅
          row.meetDt = new Date(row.meetStartDttm).format("yyyy-MM-dd");
          meetDt.push(row.meetDt);

          //현재날짜와 일치한 회의리스트 셋팅_getValue("meetList")
          if(row.meetDt == currentDate){
            let StaTime = new Date(row.meetStartDttm).format("hh:mm")
            let EndTime = new Date(row.meetEndDttm).format("hh:mm")
            let subject = row.meetSubject
            meetDttmObj = { value: row.id , StartDttm: row.meetEndDttm, EndDttm: row.meetEndDttm, label: subject + "(" +StaTime + " ~ "+ EndTime + ")" };
            meetDttmArr.push(meetDttmObj)
          }
        });
        setOption1(meetDt);
        setmeetListOptions(meetDttmArr)
        if(meetDttmArr.length > 0){
          setValue("meetList", meetDttmArr[0].value);
        }else{
          setValue("meetList", null);
          setMenuFileHidden(true) //화면+첨부 hidden=true 디폴트
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  // 회의마스터 조회
  function loadMeetingMaster() {
    let param = {
      "meet-id": getValues("meetList") //선택된 회의를 가져온다.
    };
    return zAxios({
      method: "get",
      header: { "content-type": "application/json" },
      url: "meeting",
      params: param,
    })
    .then(function (res) {
        if (res.data) {
          setOrgMeetingData(res.data)
        } else {  // 조회된 데이터가 없는 경우
          initCurMeetingData()
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  /******************************************
   *
   * 셋팅관련
   *
  ******************************************/

  /* 카렌다 양식(회의록이 있는 일자 배경) */
  const dayClassName = (date) => {
    const idx = option1 ? option1.findIndex(d => isDateDayEqual(d, date)) : -1;
    return idx >= 0 ? "dateIn" : undefined;
  };
  /* 화면+첨부 숨김버튼 클릭 */
  const ClickMenuFile = () => {
    if(menuFileHidden){
      setMenuFileHidden(false);
    }else{
      setMenuFileHidden(true);
    }
  };
  /* 탭 클릭 */
  const changeTab = (event, newValue) => {
    setTabValue(newValue)
  }

  /******************************************
   *
   * 회의 저장 (회의저장 버튼 클릭)
   *
  ******************************************/
  function saveMeeting() {
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        // 회의 저장
        saveMeetingMaster()
      }
    })
  }

  function saveMeetingMaster() {

    let curMeetingData=getEditingMeetingData();

    const promised=[];
    //회의록 저장
    if(curMeetingData.minutes != orgMeetingData.minutes) {
      promised.push(
        zAxios({
          method: "post",
          headers: { "content-type": "application/json" },
          url: "meeting",
          data: {...curMeetingData, minutes: curMeetingData.minutes},
        })
      )
    }
    // 아젠다 저장
    if(curMeetingData.agenda) {
      const newOrUpdated = curMeetingData.agenda.filter(a => a._stat_ =='created' || a._stat_ =='updated')
      if(newOrUpdated.length > 0)
        promised.push(saveAgenda(newOrUpdated));
    }
    // 화면 저장
    if(curMeetingData.menu) {
      const newOrUpdated = curMeetingData.menu.filter(a => a._stat_ =='created' || a._stat_ =='updated')
      if(newOrUpdated.length > 0){
        newOrUpdated.forEach(function (row) {
          if(row.linkType === "O"){
            row["urlTitle"] = row.urlTitle;
            row["urlLink"] = row.urlLink;
          }else if(row.linkType === "I"){
            row["menuCd"] = row.urlLink;
            row["urlTitle"] = null;
            row["urlLink"] = null;
          }
        });
        promised.push(saveMenu(newOrUpdated));
      }
    }
    //첨부저장
    if(curMeetingData.files) {
      const newOrUpdated = curMeetingData.files.filter(a => a._stat_ =='created' || a._stat_ =='updated')
      if(newOrUpdated.length > 0)
        promised.push(fileListRef.current.saveAgendAtchFile(newOrUpdated));
    }
    Promise.all(promised).then(()=>{
      //todo 저장되었습니다. 다시 로드할까요?
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey('MSG_0001'))
      onSubmit();
    })
  }

  function saveAgenda(agendaData) {
    if(agendaData && agendaData.length > 0) {
      return zAxios({
        method: "post",
        headers: { "content-type": "application/json" },
        url: "meeting/agenda",
        data: agendaData,
      })
    }else {
      return Promise.reject(-1)
    }
  }

  function saveMenu(menuData) {
    if (menuData && menuData.length > 0) {
      return zAxios({
        method: "post",
        headers: { "content-type": "application/json" },
        url: "meeting/menu",
        data: menuData,
      })
    }else {
      return Promise.reject(-1)
    }
  }

  /******************************************
   *
   * 회의 삭제 (회의삭제 버튼 클릭)
   *
  ******************************************/
  function cancelMeeting() {
    showMessage(transLangKey("DELETE"), transLangKey("MSG_DELETE"), function (answer) {
      if (answer) {
        zAxios({
          method: "post",
          headers: { "content-type": "application/json" },
          url: "meeting/delete",
          params: {
            'meet-id': getValues("meetList")
          },
        })
          .then(function (response) {
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey('MSG_0002'))
            onClearFile();
            loadMeetingDates();
          })
          .catch(function (e) {
            console.error(e);
          });
      }
    }
    );
  }

  /******************************************
   *
   * agenda 셋팅, 추가, 삭제
   *
  ******************************************/
  /* agenda 삭제*/
  function deleteSelAgenda() {

    let changeRowData = [];
    if(selAgenda) {
      if(selAgenda._stat_ =='created') {
        removeAgenda();
        showToast(transLangKey('MSG_0002'), 2000);
        return;
      }
      changeRowData.push(selAgenda)
    }

    if (changeRowData.length > 0) {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_DELETE"), function (answer) {
        if (answer) {
          return zAxios({
            method: "post",
            url: 'meeting/agenda/delete',
            headers: { "content-type": "application/json" },
            data: changeRowData,
          })
          .then(function (response) {
            removeAgenda();
            showToast(transLangKey('MSG_0002'), 2000);
          })
          .catch(function (e) {
            console.error(e);
          });
        }
      })
    }
  }


  /******************************************
   *
   * 참석자 셋팅, 추가, 삭제
   *
  ******************************************/
  const ClickDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(!open);
  };

  // 참석자 조회
  function loadAtandee(meetId) {
    return zAxios({
      method: "get",
      header: { "content-type": "application/json" },
      url: "meeting/attendee",
      params: {
        'meet-id': meetId
      },
    })
    .then(function (res) {
      setCurAttendeeList(res.data)
      return res.data;
    })
    .catch(function (err) {
      console.log(err);
    })
  }

  // 사용자 추가 팝업 닫기 (gridAttendee)
  function insertAtandee(users) {
    if(!orgMeetingData)
      return;

    let insertData = users;
    let meetId = orgMeetingData.id;

    insertData.forEach(function (user) {
      user.userId = user.id
      user.meetId = meetId
    })

    if (insertData.length > 0) {
      zAxios({
        method: "post",
        headers: { "content-type": "application/json" },
        url: "meeting/attendee",
        data: insertData,
      })
      .then(function (res) {
        attendeeDrawer();
        loadAtandee(meetId)
      })
      .catch(function (e) {
          console.error(e);
      });
    }
  }

  const attendeeDrawer = () => {

    return (
      <Drawer
        variant="persistent"
        anchor={"right"}
        open={drawerOpen}
        sx={{"& .MuiDrawer-paper": { top: '92px', height: 'calc(100% - 92px)' },
          '& > .MuiPaper-root':
            { position: 'absolute',
              boxShadow: '0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)'
            }}}
        >
        <ButtonArea sx={{ backgroundColor: "#F7F9FC"}}>
          <Box style={{ display: "block", textAlign: "left", margin: "5px 0 5px 10px", fontWeight: "bold", }} >
            <IconButton onClick={ClickDrawer(drawerOpen)}>
              <ChevronRight />
            </IconButton>
          </Box>
        </ButtonArea>
        <ButtonArea>
          <Box style={{ display: "block", textAlign: "left", margin: "10px 0 0 10px", fontWeight: "bold" }} >
            <PeopleAlt />{transLangKey("참석자")}
          </Box>
          <Box sx={{ flex: 1 }} style={{ textAlign: "right", marginRight: '10px' }}>
            <CommonButton title={transLangKey("ADD_USER")} onClick={() => { setPopSelectUserM(true) }}><Icon.UserPlus /></CommonButton>
          </Box>
        </ButtonArea>
      <List sx={{ width: 300, bgcolor: 'background.paper'}}>
      {curAttendeeList && curAttendeeList.length > 0 &&
          curAttendeeList.map((item,index) => {

            const attendeeDeleteClick = () => {
              let changeRowData = [];
              changeRowData.push(item);

              showMessage(transLangKey("DELETE"), transLangKey("MSG_DELETE"), function (answer) {
                if (answer) {
                  zAxios({
                    method: "post",
                    url: 'meeting/attendee/delete',
                    headers: { "content-type": "application/json" },
                    data: changeRowData,
                  })
                  .then(function (response) {
                    if (response.status === HTTP_STATUS.SUCCESS) {
                      attendeeDrawer();
                      let meetId = orgMeetingData.id;
                      loadAtandee(meetId)
                    }
                  })
                  .catch(function (e) {
                    console.error(e);
                  });
                }
              })
            };

            return (
              <React.Fragment key={`attendee_${index}`}>
                <ListItem alignItems="flex-start"
                  key={index}
                  secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={attendeeDeleteClick}>
                    <Delete />
                  </IconButton>
                }>
                <ListItemAvatar><Avatar alt={`${item.username}`}/></ListItemAvatar>
                <ListItemText
                  primary={`${item.username} ${item.department ? '/' + item.department : ''}`}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        email: {item.email}
                      </Typography>
                    </React.Fragment>
                  }
                />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            )
          })}
      </List>
      </Drawer>
    );
  };

  // 참석자 수 조회
  function getCountAttendee() {
    if(!curAttendeeList)
      return 0;
    else
      return curAttendeeList.length
  }

  const viewAttendee = () => {
    return (
      <Chip
        onClick={ClickDrawer(drawerOpen)}
        sx={{ width: 150, height: 40, marginTop: '8px', backgroundColor:'#F7F9FC' }}
        icon={<AccountCircleOutlined sx={{ width: 25, height: 25, }} />}
        label={'회의 참석자('+ getCountAttendee() +'명)'}
        disabled={ !orgMeetingData}
      />
    );
  };


  /******************************************
   *
   * 이슈 삭제
   *
  ******************************************/
  function deleteIssue() {

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_DELETE"), function (answer) {
      if (answer) {
        if(issueListRef.current) {
          issueListRef.current.deleteIssue();
        }
      }
    })
  }

  /******************************************************
   * Layout
  ******************************************************/
  return (
    <ContentInner searchPosition={'top'}>
        <SearchArea>
            <InputField
                inputType='floating'
                type={"datetime"}
                name="MEET_DT"
                label={transLangKey('S&OP회의일')}
                dateformat="yyyy-MM-dd"
                useLabel={false}
                dayClassName={dayClassName} // 회의록이 존재 할 경우 해당 일자 배경 처리
                control={control}
              />
            <InputField inputType='floating'
              name='meetList' type='select' label={transLangKey('S&OP 회의 목록')} control={control} options={meetListOptions} width="250px"></InputField>
            {viewAttendee()}
            <Button onClick={() => { saveMeeting() }} style={{margin: "13px 13px 0 auto"}}
              startIcon={<Save />} variant="outlined" disabled={ !orgMeetingData} >
              {transLangKey("회의 저장")}
            </Button>
            <Button onClick={() => { setPopDataCopy(true) }} style={{margin: "13px 13px 0 0"}}
              startIcon={<CopyAll />} variant="outlined" disabled={ !orgMeetingData} >
              {transLangKey("회의 복사")}
            </Button>
            <Button onClick={() => { cancelMeeting() }}   style={{margin: "13px 13px 0 0", color: "#d32f2f", borderColor: "#d32f2f", opacity: orgMeetingData ? 1 : 0.3 }}
              startIcon={<RemoveFromQueueSharp />} variant="outlined" disabled={ !orgMeetingData} >
              {transLangKey("회의 삭제")}
            </Button>
        </SearchArea>

        <WorkArea >
          <SplitPanel sizes={[70, 30]} >
            {/* 회의/Agenda 영역 */}
            <VLayoutBox >
              <Box sx={{ display: "flex", width: "100%",height: "100%" ,  flexDirection: "row", alignContent: "stretch", alignItems: "stretch" }} >
                <SplitPanel sizes={[20, 80]} direction={"horizontal"} minSize={290}>
                  {/* 아젠다 리스트 */}
                  <Box sx={{ display: "flex", height: "100%", width: "25%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }} style={ContentBox}>
                    <ButtonArea sx={{ width: "100%", display: 'flex' }} p={1}>
                      <LeftButtonArea sx={{ flexGrow: 1 }}>
                        <Box style={{ display: "block", textAlign: "left", fontWeight: "bold", }} >
                          <EventNote style={{height:'40px'}}/>{transLangKey("AGENDA")}
                          <Chip
                            onClick={() => ClickMenuFile()}
                            sx={{ width: 110, height: 30,  backgroundColor:'#F7F9FC', marginLeft:'10px'}}
                            icon={menuFileHidden ? <Visibility sx={{ width: 25, height: 25 }} /> : <VisibilityOff sx={{ width: 25, height: 25 }} />}
                            label={menuFileHidden ? '화면+첨부' : '화면+첨부'}
                            disabled={ !orgMeetingData}
                          />
                        </Box>
                      </LeftButtonArea>
                      <RightButtonArea sx={{}}>
                        { orgMeetingData ?
                          <>
                          <GridAddRowButton onClick={() => { addNewAgenda(); }} />
                          <GridDeleteRowButton onClick={()=> deleteSelAgenda()} />
                          </>
                          :''
                        }
                      </RightButtonArea>
                    </ButtonArea>
                    <Box style={{ height: "100%", paddingBottom: '4px' }}>
                        {/* 아젠다 목록 */}
                        <AgendaList/>
                    </Box>
                  </Box>
                  {/* 아젠다 상세 및 회의록 */}
                  <Box sx={{ display: "flex", height: "100%", flexDirection: "column", width: "75%", alignContent: "stretch", alignItems: "stretch" }} >
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={tabValue} onChange={changeTab} >
                        <Tab label={'Agenda 상세'} value="tab_agenda" />
                        <Tab label={'회의록'} value="tab_minute" />
                      </Tabs>
                    </Box>
                    {/* 아젠다 상세 */}
                    <Box sx={{ display: tabValue === "tab_agenda" ? 'flex' : 'none', height: "100%", width: "100%", flexDirection: "row", alignContent: "stretch", alignItems: "stretch", borderBottom: '2px solid #EEEEEE' }} style={{padding: '0 0 4px 0'}}>
                        <Box sx={{display:'flex', height: "100%", flexDirection: "column", width: menuFileHidden ? "100%" : "65%", alignContent: "stretch", alignItems: "stretch", borderRight: selAgenda ? '' : '1px solid #EEEEEE' }}>
                          <AgendaContentEditor />
                        </Box>
                        <Box hidden={menuFileHidden} sx={{display:'flex', flexDirection: "column", width: "35%", height: "100%", alignContent: "stretch", alignItems: "stretch" }} >
                          {/* 화면 */}
                          <MenuList contentBoxStyle={ContentBox} />
                          {/* 첨부 */}
                          <FileList ref={fileListRef} contentBoxStyle={ContentBox}/>
                        </Box>
                    </Box>
                    {/* 회의록 */}
                    <Box sx={{ display: tabValue === "tab_minute" ? 'flex' : 'none', width: "100%", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch"}}  >
                      <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }} >
                          <MeetingEditor languageCode={languageCode}/>
                      </Box>
                    </Box>
                  </Box>
                </SplitPanel>
              </Box>
            </VLayoutBox>
            {/* 이슈영역 */}
            <VLayoutBox >
              <Box sx={{ display: "flex", width: "100%", height: "100%" , flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }} >
                <ButtonArea>
                  <LeftButtonArea>
                    <Box style={{ display: "block", textAlign: "left", fontWeight: "bold", }} >
                      <PsychologyAlt style={{height:'40px'}}/>{transLangKey("ISSUE")}
                    </Box>
                  </LeftButtonArea>
                  <RightButtonArea>
                    { orgMeetingData ?
                      <>
                      <GridAddRowButton onClick={() => { setIssueOpen(true); }} ></GridAddRowButton>
                      <GridDeleteRowButton  onClick={deleteIssue} ></GridDeleteRowButton>
                      </> :''
                    }
                  </RightButtonArea>
                </ButtonArea>
                <Box style={{ height: "100%" }}>
                  <SnopIssueList ref={issueListRef}></SnopIssueList>
                </Box>
              </Box>
            </VLayoutBox>
          </SplitPanel>
          {attendeeDrawer()}
        </WorkArea>
        {popSelectUserM && <PopSelectUserM id={'selectUserPop'} open={popSelectUserM} onClose={() => setPopSelectUserM(false)} confirm={insertAtandee} ></PopSelectUserM>}
        {issueOpen && (<PopupIssue popupMode='NEW' snopIssue={true} open={issueOpen} onClose={() => setIssueOpen(false)} />)}
        {popDataCopy && <PopDataCopy open={popDataCopy} onClose={() => setPopDataCopy(false)} meetingData={orgMeetingData}></PopDataCopy>}
    </ContentInner>
  );
}

export default Meeting
