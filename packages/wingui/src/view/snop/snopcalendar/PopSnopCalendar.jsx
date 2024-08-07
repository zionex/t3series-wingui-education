import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from 'react-router-dom';
import { Box, Grid, Tooltip, IconButton } from '@mui/material';
import { PopupDialog, InputField, zAxios, useUserStore, CommonButton, getContentStore } from '@wingui/common/imports';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { generateId, transLangKey } from "@zionex/wingui-core";
import PopSaveOption from "./PopSaveOption";
import PopDeleteOption from "./PopDeleteOption";
import UserSearchInput from "./UserSearchInput";
import { useTheme } from '@mui/material/styles';

function PopSnopCalendar(props) {
  const theme = useTheme();
  const themeType = theme.type; // "system" or "dark"
  const userSearchInputRef = useRef();
  const [currentUserRef, setCurrentUserRef] = useState();
  const [categories, setCategories] = useState([]);
  const [fullDayYn, setFullDayYn] = useState(false);
  const [meetingYn, setMeetingYn] = useState(false);              // 참석자 컴포넌트 on/off
  const [meetId, setMeetId] = useState(props.editProps.meetId);   // meeting 화면 id로 사용될 meetId
  const [activeRepeat, setActiveRepeat] = useState(false);
  const [activeRepeat2, setActiveRepeat2] = useState(false);
  const [popSaveOptionOpen, setPopSaveOptionOpen] = useState(false);
  const [popDeleteOptionOpen, setPopDeleteOptionOpen] = useState(false);
  const [snopYn, setSnopYn] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([])
  const username = useUserStore(state => state.username);
  const [AttachFiles, setAttachFiles] = useState([]);

  const [meetingDisabledYn, setMeetingDisabledYn] = useState(false);

  const [systemAdmin] = useUserStore((state) => [state.systemAdmin]);

  const repeatType = [
    { label: transLangKey('FP_NOT_REPEAT'), value: 'N' },
    { label: transLangKey('FP_REPEAT_DAILY'), value: 'D' },
    { label: transLangKey('FP_REPEAT_WEEKLY'), value: 'W' },
    { label: transLangKey('FP_REPEAT_MONTHLY'), value: 'M' },
    { label: transLangKey('REPEAT_YEARLY'), value: 'Y' }
  ];

  const repeatOptions = [
    { label: transLangKey('TIMES'), value: 'N' },
    { label: transLangKey('DATE'), value: 'D' }
  ];

  const { handleSubmit, reset, control, getValues, setValue, watch, register, formState: { errors }, clearErrors } = useForm({
    defaultValues: {}
  });

  useEffect(() => {
    if (props.editProps) {
      const editProps = props.editProps
      //editting
      if (editProps.id) {
        loadFiles(props.editProps.schId);

        setValue('category', editProps.categoryId);
        setValue('title', editProps.title);
        setValue('startDate', editProps.start);
        setValue('endDate', editProps.end);
        setValue('startTime', dayjs(editProps.start));
        setValue('endTime', dayjs(editProps.end));
        setValue('fullDay', editProps.fullDay);
        setValue('meetYn', meetId ? ['Y'] : "");
        setValue('content', editProps.memo ?? "");

        const repeatType = editProps.repeatTp ? editProps.repeatTp.slice(0, 1) : "N";
        const repeatOption = editProps.repeatTp ? editProps.repeatTp.slice(1, 2) : "N"
        const repeatEndDate = repeatType !== "N" ? new Date(editProps.repeatTp.substr(2)) : new Date();
        const repeatNumber = repeatType !== "N" ? Number(editProps.repeatTp.slice(2)) : 0
        setValue('repeatType', repeatType);
        setValue('repeatOption', repeatOption);
        setValue('repeatEndDate', repeatEndDate);
        setValue('repeatNumber', repeatNumber);
      } else {
        //신규
        //calendar에서 넘어오는 start /end 의 값을 보정해줘야 한다.
        //예를 들어 2023-01-01를 선택하면 start: 2023-01-01:00:00:00 , end:2023-01-02:00:00:00
        //로 들어온다. 2023-01-01:00:00:00 ~ 2023-01-01:23:59:59로 보정
        let endDt = new Date(editProps.end)
        endDt.setTime(endDt.getTime() - 1000) //1초 전

        setValue('category', editProps.categoryId || "");
        setValue('title', editProps.title || "");
        setValue('startDate', editProps.start);
        setValue('endDate', endDt);
        setValue('startTime', dayjs(editProps.start));
        setValue('endTime', dayjs(endDt));
        setValue('fullDay', ['Y']);
        setValue('meetYn', "");
        setValue('repeatType', "N");
        setValue('repeatOption', "N");
        setValue('repeatEndDate', new Date());
        setValue('repeatNumber', 0);
      }
    }
  }, [props.editProps])

  useEffect(() => {
    if (props.category.length > 0) {
      let arr = [];
      props.category.forEach(function (data) {
        if (data.CATEGORY_ID.trim() !== 'SNOP') {
          if (systemAdmin) {
            arr.push({ value: data.CATEGORY_ID, label: transLangKey(data.CATEGORY_NM) });
          } else {
            if (data.CATEGORY_NM !== 'S&OP') {
              arr.push({ value: data.CATEGORY_ID, label: transLangKey(data.CATEGORY_NM) });
            }
          }
        }
      });
      setCategories(arr);
    }
  }, []);
  useEffect(() => {
    if (meetingYn && userSearchInputRef) {
      if (userSearchInputRef.current) {
        setCurrentUserRef(userSearchInputRef.current);
      }
    }
  }, [meetingYn]);

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  useEffect(() => {
    for (let i = 0; i < props.category.length; i++) {
      if (props.category[i].CATEGORY_ID === getValues("category") && props.category[i].CAN_DELETE === "N" && props.category[i].CATEGORY_NM === "S&OP") {
        setSnopYn(true);
        return;
      } else {
        setSnopYn(false);
      }
    }
  }, [watch("category")]);

  useEffect(() => {
    if (getValues("fullDay")[0] === "Y") {
      setFullDayYn(false)
    } else {
      setFullDayYn(true)
    }
  }, [watch("fullDay")]);

  useEffect(() => {
    if (getValues("meetYn")[0] === "Y") {
      setMeetingYn(true)
    } else {
      setMeetingYn(false)
    }
  }, [watch("meetYn")]);

  useEffect(() => {
    if (!getValues("endDate") || new Date(getValues("startDate")) > new Date(getValues("endDate"))) {
      setValue("endDate", new Date(getValues("startDate")));
    }
    setValue("startTime", dayjs(getValues("startDate")))

    if (getValues("startDate").getFullYear() === getValues("endDate").getFullYear()
      && getValues("startDate").getMonth() === getValues("endDate").getMonth()
      && getValues("startDate").getDate() === getValues("endDate").getDate()) {
      setMeetingDisabledYn(false);
    } else {
      setMeetingDisabledYn(true);
    }
  }, [watch("startDate")]);

  useEffect(() => {
    if (!getValues("endTime") || new Date(getValues("startTime")) > new Date(getValues("endTime"))) {
      setValue("endTime", dayjs(getValues("startTime")));
    }
  }, [watch("startTime")]);

  useEffect(() => {
    if (!getValues("startDate") || new Date(getValues("startDate")) > new Date(getValues("endDate"))) {
      setValue("startDate", new Date(getValues("endDate")));
    }
    setValue("endTime", dayjs(getValues("endDate")))

    if (getValues("startDate").getFullYear() === getValues("endDate").getFullYear()
      && getValues("startDate").getMonth() === getValues("endDate").getMonth()
      && getValues("startDate").getDate() === getValues("endDate").getDate()) {
      setMeetingDisabledYn(false);
    } else {
      setMeetingDisabledYn(true);
    }
  }, [watch("endDate")]);

  useEffect(() => {
    if (!getValues("startTime") || new Date(getValues("startTime")) > new Date(getValues("endTime"))) {
      setValue("startTime", dayjs(getValues("endTime")));
    }
  }, [watch("endTime")]);

  useEffect(() => {
    if (getValues("repeatType") === "N") {
      setActiveRepeat(false)
    } else {
      setActiveRepeat(true)
    }
  }, [watch("repeatType")]);

  useEffect(() => {
    if (getValues("repeatOption") === "N") {
      setActiveRepeat2(false)
    } else {
      setActiveRepeat2(true)
    }
  }, [watch("repeatOption")]);

  function uuidv4() {
    return ([1e7] + 1e4 + 4e4 + 8e4 + 1e8).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  const onSaveWithOption = (saveType) => {
    saveFile(saveType);
  }

  const onDeleteWithOption = (option) => {
    if (option == 'equal') {
      deleteCalendar()
    } else if (option == 'greaterThenOrEqualTo') {
      deleteCalendarAfter(option)
    }
  }

  const saveSubmit = () => {
    if (props.editProps.repeatTp) {
      setPopSaveOptionOpen(true);
    } else {
      saveFile('equal');
    }
  }

  // 반복 일정 -> 팝업 / 일반 일정 -> 저장
  const saveFile = (saveType) => {
    let formData = new FormData();

    let fileSizeCheck = false;
    let fileExistCheck = false;

    uploadedFiles.map(function (file) {
      if (file !== undefined) {
        fileExistCheck = true;
        formData.append('FILES', file);
        if (file.size === 0 || file.size > 128000000) fileSizeCheck = true
      }
    });


    if (fileExistCheck) {
      formData.append('CATEGORY', 'calendar');
      formData.append('USER_ID', username);
      if (fileSizeCheck) {
        showMessage(transLangKey('WARNING'), transLangKey('MSG_WARNING_FILESIZE'), { close: false });
      } else {
        zAxios.post('file-storage/files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(function (response) {
          if (response.status === HTTP_STATUS.SUCCESS) {
            if (response.data) {
              let data = response.data;
              let fileIdList = [];
              if (data.success === true) {
                data.data.forEach(function (element) {
                  fileIdList.push(element.id);
                });

                saveCalendar(saveType, fileIdList);
              } else if (data.success === false) {
                console.error(data.message);
                showMessage('Error', "파일 업로드를 실패했습니다.", { close: false });
              }
            } else {
              console.log('응답 데이타가 없습니다.')
            }
          } else {
            console.log('응답 상태', response.status)
          }
        }).catch(function (error) {
          console.log(error);
        }).then(function () { });
      }
    } else {
      saveCalendar(saveType, []);
    }
  }

  async function saveCalendar(saveType, fileIdList) {
    const startDate = getValues('startDate');
    const endDate = getValues('endDate');

    const startTime = getValues('startTime')
    const endTime = getValues('endTime')

    const fullDay = getValues('fullDay')[0] === 'Y' ? 'Y' : 'N'
    const meetId = props.editProps.meetId ? props.editProps.meetId : (getValues("meetYn")[0] === "Y" ? generateId() : "");
    const repeatType = getValues('repeatType');
    const repeatOption = getValues('repeatOption');
    const repeatNumber = Number(getValues('repeatNumber'));
    const repeatEndDate = getValues('repeatEndDate');

    //조합1 : 반복여부 + 반복타입이 주기 + 반복종료일 / 조합2: 반복여부 + 반복타입이 횟수 + 반복횟수
    const repeatTp = repeatType === 'N' ? '' : repeatType + repeatOption + (repeatOption === 'N' ? repeatNumber : repeatEndDate.format('yyyy-MM-dd'));

    let schStartDttm = null;
    let schEndDttm = null;

    if (fullDay === 'Y') {
      if (!startDate || !endDate || !startTime || !endTime) {
        showMessage(transLangKey('WARNING'), transLangKey("SPECIFY_DATE"));
        return;
      }
      schStartDttm = startDate;
      schEndDttm = endDate;
    } else {
      if (!startDate || !endDate || !startTime || !endTime) {
        showMessage(transLangKey('WARNING'), transLangKey("SPECIFY_DATE"));
        return;
      }
      schStartDttm = startTime;
      schEndDttm = endTime;
    }

    const data = {
      id: props.editProps.id ? props.editProps.id : null,
      categoryId: getValues('category'),
      schId: props.editProps.schId ? props.editProps.schId : uuidv4(),
      schNm: getValues('title'),
      fullDayYn: fullDay,
      meetId: meetId,
      schStartDttm: schStartDttm,
      schEndDttm: schEndDttm,
      repeatTp: repeatTp,
      memo: getValues('content'),
      meetYn: props.editProps.meetId,
      attendee: [],
      files: fileIdList,
    };

    const meetingData = {
      id: meetId,
      meetSubject: getValues('title'),
      meetOwnerId: "",
      meetStartDttm: schStartDttm,
      meetEndDttm: schEndDttm,
      mailSendYn: "N",
      delYn: "N",
    };

    let attendeeList = [];
    if (meetId) {
      let attendee = JSON.parse(currentUserRef.getItem());
      if (attendee.length > 0) {
        attendee.forEach((row) => attendeeList.push({ userId: row.id, meetId: meetId }));
      }
    }

    let formData = new FormData();
    formData.append('changes', JSON.stringify(data));
    formData.append('meetingChanges', JSON.stringify(meetingData));
    formData.append('attendeeChanges', JSON.stringify(attendeeList));

    formData.append('saveType', saveType);
    formData.append('repeatType', repeatType)
    formData.append('repeatOption', repeatOption);
    if (repeatEndDate) {
      formData.append('repeatEndDate', repeatEndDate.toJSON());
    }
    formData.append('repeatNumber', repeatNumber);

    zAxios({
      method: 'post',
      url: 'calendar',
      data: formData,
      fromPopup: true,
    }).then(function (response) {
      props.confirm();
      props.onClose(false);
    }).catch(function (e) {
      console.error(e);
    });
  }

  function onDeleteCalendar() {
    if (props.editProps.repeatTp) {
      setPopDeleteOptionOpen(true);
    } else {
      deleteCalendar();
    }
  }
  async function deleteCalendar() {
    await zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: 'calendar/delete',
      params: {
        'category-id': getValues('category'),
        'sch-id': props.editProps.schId,
        'id': props.editProps.id,
        'meet-id': props.editProps.meetId
      },
      fromPopup: true,
    }).then(function (response) {
      props.confirm();
      props.onClose(false);
    }).catch(function (e) {
      console.error(e);
    });
  }

  async function deleteCalendarAfter(option) {
    await zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: 'calendar/repeatdelete',
      params: {
        'category-id': getValues('category'),
        'sch-id': props.editProps.schId,
        'id': props.editProps.id,
        'option': option,
        'meet-id': props.editProps.meetId
      },
      fromPopup: true,
    }).then(function (response) {
      props.confirm();
      props.onClose(false);
    }).catch(function (e) {
      console.error(e);
    });
  }

  const handleFileUploaderChange = (choosenFiles) => {
    setUploadedFiles(choosenFiles);
  }

  const loadFiles = (schId) => {
    zAxios.get('calendar-file', {
      params: {
        SCH_ID: schId
      },
      fromPopup: true,
    }).then(function (response) {
      const attachFiles = [];

      if (response.data.length !== 0) {
        response.data.forEach(function (data) {
          var file = {
            id: data.id,
            name: data.fileName,
            size: data.fileSize,
            extension: '.' + data.fileType
          }
          attachFiles.push(file);
        });
      }
      setAttachFiles(attachFiles)
    }).catch(function (error) {
      console.log(error);
      setAttachFiles([])
    })
  }

  const downloadFile = async (id) => {
    return zAxios({
      fromPopup: true,
      method: "GET",
      url: baseURI() + `file-storage/file?ID=${id}`,
      responseType: 'blob'
    }).then(function (response) {
      if (response.status === HTTP_STATUS.SUCCESS) {
        let fileName = decodeURI(response.headers["content-disposition"].split("filename=")[1]);
        fileName = fileName.replaceAll("\"", '')

        if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE variant
          window.navigator.msSaveOrOpenBlob(response.data, fileName);
        } else {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;

          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }
    }).catch(function (err) {
      console.log(err);
    });
  }

  const deleteFile = (id) => {
    showMessage(transLangKey('WARNING'), transLangKey('파일을 삭제하시겠습니까?'), function (answer) {
      if (!answer) {
        return;
      }

      const fileInfo = AttachFiles.find((f) => f.id == id)
      if (!fileInfo) {
        return;
      }

      return zAxios({
        method: "POST",
        data: fileInfo,
        url: `file-storage/files/delete?ID=${id}&USER_ID=${username}`,
        fromPopup: true,
      }).then(function (response) {
        if (response.status === HTTP_STATUS.SUCCESS) {
          let newAttachFiles = [...AttachFiles];
          var index = newAttachFiles.indexOf(fileInfo);
          if (index !== -1) {
            newAttachFiles.splice(index, 1);
          }
          setAttachFiles(newAttachFiles);
        }
      }).catch(function (err) {
        console.log(err);
      });
    })
  }

  return (
    <>
      <PopupDialog onTopPosition={props.onTopPosition} open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title={transLangKey(props.editProps.popupTitle)} resizeHeight={620} resizeWidth={570}>
        <Box style={{ marginTop: "3px", width: "100%", height: "100%" }}>
          <Box sx={{ height: "calc(100% - 50px)" }}>
            <Grid container direction="column">
              <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '100%' }}>
                <InputField name='category' type='select' style={{ width: '120px' }} label={transLangKey('CALENDAR_CATEGORY')} options={categories} control={control} rules={{ required: true }} disabled={props.editProps.popupTitle === "INSERT_SCHEDULE" ? false : true} />
                <InputField name='title' style={{ width: '350px' }} label={transLangKey('TITLE')} control={control} rules={{ required: true }} />
                <CommonButton title={transLangKey('DELETE_CALENDAR')} onClick={onDeleteCalendar} disabled={props.editProps.popupTitle === 'INSERT_SCHEDULE' || props.editProps.canDelete === 'N' ? true : false}><DeleteIcon /></CommonButton>
              </Grid>
              <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '100%' }}>
                <InputField type="check" style={{ width: '85px' }} sx={{ '& .MuiFormControlLabel-root': { margin: '0px' } }} name="fullDay" control={control} options={[{ label: transLangKey('ALL_DAY'), value: 'Y' }]} />
                <InputField name='startDate' style={{ width: '120px' }} type='datetime' label={transLangKey('FROM_DATE')} dateformat="yyyy-MM-dd" control={control} />
                {fullDayYn && <InputField name='startTime' style={{ width: '90px' }} type='time' label={transLangKey('START_TIME')} dateformat="HH:mm" control={control} />}
                <InputField name='endDate' style={{ width: '120px' }} type='datetime' label={transLangKey('TO_DATE')} dateformat="yyyy-MM-dd" control={control} />
                {fullDayYn && <InputField name='endTime' style={{ width: '90px' }} type='time' label={transLangKey('END_TIME')} dateformat="HH:mm" control={control} />}
              </Grid>
              <Grid container direction="row" justifyContent="flex-start" alignItems="center" sx={{ width: '100%' }}>
                <InputField name='repeatType' style={{ width: '100px' }} type='select' label={transLangKey('REPEAT_TP')} options={repeatType} control={control} />
              </Grid>
              {
                activeRepeat &&
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '100%' }}>
                  <InputField type="radio" style={{ width: '150px' }} name="repeatOption" control={control} options={repeatOptions} />
                  {activeRepeat2 && <InputField name="repeatEndDate" type="datetime" label={transLangKey('END_DATE_REPEAT')} dateformat="yyyy-MM-dd" control={control} />}
                  {!activeRepeat2 && <InputField name="repeatNumber" label={transLangKey('REPEAT_TIMES')} control={control} />}
                </Grid>
              }
              <Grid container direction="row" justifyContent="flex-start" alignItems="center" sx={{ width: '100%' }}>
                {systemAdmin && snopYn && <InputField type="check" name="meetYn" style={{ width: '90px' }} control={control} disabled={meetingDisabledYn || props.editProps.popupTitle !== "INSERT_SCHEDULE"} options={[{ label: transLangKey('CREATE_MEETING'), value: 'Y' }]} />}
                {meetingYn && props.editProps.popupTitle === "INSERT_SCHEDULE" && <UserSearchInput ref={userSearchInputRef} placeHolder={transLangKey("USER_NM")} />}
              </Grid>
              <Grid container direction="row" justifyContent="flex-start" alignItems="center" sx={{ width: '100%', height: '230px' }}>
                <InputField
                  id="noticeBoardFileUploader"
                  name='content'
                  control={control}
                  label='내용'
                  placeholder="내용을 입력해주세요."
                  width="100%"
                  initialEditType="wysiwyg"
                  useCommandShortcut={true}
                  type='editor'
                  wrapStyle={{ width: '100%', padding: 0 }}
                  style={{ height: '100%', maxWidth: 'unset', flex: 1, margin: 0, border: '1px solid #e2e2e1', borderRadius: '8px', padding: '8px 20px 0px 10px', color: themeType === 'dark' ? '#fff' : '#000' }}
                  readonly={false}
                  fileupload={true}
                  handleFileUploaderChange={handleFileUploaderChange}
                />
              </Grid>
              <Grid container justifyContent="flex-start" alignItems="flex-start" sx={{ width: '100%' }}>
                {
                  AttachFiles.map((file) => {
                    return <Box key={file.id} style={{ display: 'inline-flex', alignItems: 'center', padding: '0px 2px 0px 2px', marginRight: '10px', marginBottom: '5px', borderRadius: '4px' }}>
                      <NavLink to={'#'} key={`NavLink_${file.id}`} onClick={() => downloadFile(file.id)} >
                        <span key={`ListItemText_${file.id}`}>{file.name}</span>
                      </NavLink>
                      {
                        props.editProps.popupTitle !== "INSERT_SCHEDULE" ? (
                          <div>
                            <IconButton key={`IconButton_${file.id}`} edge="end" aria-label="delete" onClick={() => { deleteFile(file.id) }}>
                              <DeleteIcon key={`DeleteIcon_${file.id}`} size='small' />
                            </IconButton>
                          </div>
                        ) : null
                      }
                    </Box>
                  }
                  )
                }
              </Grid>
            </Grid>
          </Box>
        </Box>
      </PopupDialog>
      {popSaveOptionOpen && (<PopSaveOption open={popSaveOptionOpen} onClose={() => { setPopSaveOptionOpen(false) }} onSaveWithOption={onSaveWithOption}></PopSaveOption>)}
      {popDeleteOptionOpen && (<PopDeleteOption open={popDeleteOptionOpen} onClose={() => { setPopDeleteOptionOpen(false) }} onDeleteWithOption={onDeleteWithOption}></PopDeleteOption>)}
    </>
  );
}

export default PopSnopCalendar;
