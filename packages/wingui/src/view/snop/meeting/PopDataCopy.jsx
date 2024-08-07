import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box, IconButton } from "@mui/material";
import {
  InputField, useViewStore, useIconStyles, PopupDialog, SearchArea, SearchRow, BaseGrid, zAxios
} from "@wingui/common/imports";

import {CalendarMonth, SettingsSuggestOutlined} from '@mui/icons-material'
import "./Meeting.css"

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

function PopDataCopy(props) {

  const [sourceMeetingData,] = useState(props.meetingData);
  const [targetDate,setTargetDate] = useState([])

  console.log('sourceMeetingData',sourceMeetingData)

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, setValue, getValues, control, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
    }
  });
  const [option1, setOption1] = useState([]);

  useEffect(() => {
    popupLoadData();
  }, []);

  useEffect(()=>{
    if(option1 && option1.length > 0) {
      let sourceDate = new Date(props.meetingData.meetStartDttm);
      const filterArr = option1.filter(data=> data > sourceDate);
      setTargetDate(filterArr)
    }
  },[option1])

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  // 조회
  const popupLoadData = () => {
    // 회의록을 작성했던 모든 일자를 불러오기
    zAxios({
      method: "get",
      header: { "content-type": "application/json" },
      url: "meeting/dates"
    })
    .then(function (res) {
      if(res.data.length > 0){
        setOption1(res.data.map(row => new Date(row.meetStartDttm)));
        setValue('MEET_DT', new Date(res.data[res.data.length - 1].meetDt.substring(0, 4) + '-' + res.data[res.data.length - 1].meetDt.substring(4, 6) + '-' + res.data[res.data.length - 1].meetDt.substring(6, 8)));
      }else{
        setValue('MEET_DT', new Date());
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  // 카렌다 양식(회의록이 있는 일자 배경)
  const dayClassName = date => {
    const idx = option1 ? option1.findIndex(d => isDateDayEqual(d, date)) : -1;
    return idx >= 0 ? "dateIn" : undefined;
  };

  // 회의록이 있는 일자만 선택가능
  const isPossibleDay = date => {
    let returnVal = false;
    let filterArr = [];
    let sourceDate = new Date(props.meetingData.meetStartDttm);
    let today= new Date();

    //선택한 회의 날짜 및 오늘 이후 날짜만 복사가능
    filterArr = option1.filter(data => isDateDayEqual(data,date) && data > sourceDate && data >= today);

    if(filterArr.length > 0){
      returnVal = true;
    }

    return returnVal;
  };

  // popup 확인
  const saveSubmit = () => {
    // 이전 회의록 복사
    const id= props.meetingData.id;
    const targetDt = getValues('MEET_DT');
    const postApply = getValues("postApply");
    const keyCopy = getValues("keyCopy");
    const extraCopy = getValues("extraCopy");

    if(!id || !targetDt) {
      return;
    }

    showMessage( transLangKey("MSG_CONFIRM"), transLangKey("선택된 날짜의 데이터를 복사하시겠습니까?"), function (answer) {
        if (answer) {
          zAxios({
            method: "post",
            headers: { "content-type": "application/json" },
            url: "meeting/copy",
            data: {
              meetId: id,
              targetDt: getValues("MEET_DT") === undefined ? "" : getValues("MEET_DT"),
              postApply:postApply && postApply.length > 0 ? postApply[0] :'N',
              keyCopy: keyCopy,
              extraCopy:extraCopy
            },
          })
          .then(function (response) {
            props.confirm();
            props.onClose(false);
          })
          .catch(function (e) {
            console.error(e);
            props.onClose(false);
          });
        }
      }
    );
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title={transLangKey("회의 복사")}
            resizeHeight={450} resizeWidth={550}>
      <Box sx={{ display: "flex", height: "100%",
                flexDirection: "row",
                alignItems:'baseline'}}
      >
        <Box sx={{ display: "flex", flexDirection: 'column', padding:'10px'}} >
          <Box style={{ display: "flex", textAlign: "left",fontWeight: "bold", }} >
            <CalendarMonth/>{transLangKey("복사할 날짜")}
          </Box>
          <InputField
            inputType='floating'
            height='100%'
            width='100%'
            type={"datetime"}
            value={targetDate && targetDate.length > 0 ? targetDate[0] : undefined}
            inputBoxClass={{alignItems:'baseline'}}
            inline
            name="MEET_DT"
            label={transLangKey('S&OP회의일')}
            dateformat="yyyy-MM-dd"
            useLabel={false}
            dayClassName={dayClassName} // 회의록이 존재 할 경우 해당 일자 배경 처리
            control={control}
            wrapStyle={{ padding: 0 }}
            style={{ width: "initial", maxWidth: "initial" }}
            filterDate={isPossibleDay}
          />
        </Box>

        <Box style={{ display: "flex", flexDirection:'column', padding:'10px'}} >
          <Box style={{ display: "flex", textAlign: "left", fontWeight: "bold", }} >
            <SettingsSuggestOutlined/>{transLangKey("Option")}
          </Box>

          <InputField inputType='floating' type='check' control={control} name='postApply' options={[{ label: '이후 일정 적용', value: 'Y', }, ]} />
          <InputField inputType='floating' label={transLangKey('Copy Target')} type='check'
                      value={['AGENDA', 'ATTENDEE']} disabled
                      control={control}
                      name='keyCopy'
                      options={[
                                { label: transLangKey('Agenda'), value: 'AGENDA', },
                                { label: transLangKey('참석자'), value: 'ATTENDEE', },
                              ]}
          />
          <InputField inputType='floating' label={transLangKey('Extra Copy')} type='check' control={control} name='extraCopy'
                        options={[
                          { label: transLangKey('회의내용'), value: 'CONTENT', },
                          { label: transLangKey('Agenda Detail'), value: 'AGENDADETAIL', },
                          { label: transLangKey('화면링크'), value: 'MENU', },
                          { label: transLangKey('첨부파일'), value: 'ATTACH', },
                        ]}
          />
        </Box>
      </Box>
    </PopupDialog>
  );
}
export default PopDataCopy;