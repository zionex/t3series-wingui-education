import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useHistory } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/material';
import { PopupDialog, InputField, CommonButton, useUserStore, zAxios, FormRow, VLayoutBox, useViewStore } from '@wingui/common/imports';
import { IconButton } from "@mui/material";
import { useTheme } from '@mui/material/styles';

function PopNoticeDetail(props) {
  const theme = useTheme();
  const themeType = theme.type; // "system" or "dark"
  const [username] = useUserStore((state) => [state.username]);
  const getNoticeValue = (propName, def) => {
    if (props.notice) {
      return props.notice[propName];
    }
    else return def;
  }
  const { handleSubmit, getValues, setValue, control, formState: { errors }, clearErrors, watch } = useForm({
    defaultValues: {
      'createDttm': getNoticeValue('createDttm'),
      'createByDisplayName': getNoticeValue('createByDisplayName'),
      'content': getNoticeValue('content'),
      // 'noticeYn': [],
    }
  });

  const [popupMode, setPopupMode] = useState(props.popupMode)
  const [AttatchFiles, setAttachFiles] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])

  useEffect(() => {
    if (props.open === true && props.notice) {
      loadFiles(props.notice.id);
      setValue('createDttm', getNoticeValue('createDttm'))
      setValue('createByDisplayName', getNoticeValue('createByDisplayName'))
      setValue('content', getNoticeValue('content'))
      setValue('noticeYn', getNoticeValue('noticeYn', false) === true ? ['Y'] : [''])
    }
    if (popupMode === 'NEW') {
      setValue('title', '')
    } else {
      setValue('title', getNoticeValue('title'))
    }
  }, [props.open, props.notice, popupMode])

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  const loadFiles = (board_id) => {
    zAxios.get('noticeboard-file', {
      params: {
        BOARD_ID: board_id
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

  const handleFileUploaderChange = (choosenFiles) => {
    setUploadedFiles(choosenFiles)
  }

  const saveData = (notice, mode) => {
    if (mode === 'MODIFY') {
      const updateData = {
        id: notice.id,
        title: notice.title,
        content: notice.content,
        createDttm: notice.createDttm,
        createBy: notice.createBy,
        modifyBy: username,
        deleteYn: 'N',
        noticeYn: notice.noticeYn ? 'Y' : 'N',
        files: notice.files
      };

      let formData = new FormData();
      formData.append('changes', JSON.stringify(updateData));

      zAxios.post(baseURI() + 'noticeboard', formData).then(function (response) {
      }).catch(function (response) {
        console.log('err', response)
      }).then(function () {
        if (props.loadPage)
          props.loadPage(1);
      });
    } else {
      const createData = {
        title: notice.title,
        content: notice.content,
        createBy: username,
        deleteYn: 'N',
        noticeYn: notice.noticeYn,
        files: notice.files
      };

      let formData = new FormData();
      formData.append('changes', JSON.stringify(createData));

      zAxios.post(baseURI() + 'noticeboard', formData).then(function (response) {
      }).catch(function (response) {
        console.log('err', response)
      }).then(function () {
        if (props.loadPage)
          props.loadPage(1);
      });
    }
  }

  const saveFiles = (notice, files, mode) => {
    let formData = new FormData();

    let fileSizeCheck = false;
    let fileExistCheck = false;
    files.map(function (file) {
      if (file !== undefined) {
        fileExistCheck = true;
        formData.append('FILES', file);
        if (file.size === 0 || file.size > 128000000) fileSizeCheck = true
      }
    });

    if (fileSizeCheck) {
      showMessage(transLangKey('WARNING'), transLangKey('MSG_WARNING_FILESIZE'), { close: false })
    } else {
      formData.append('CATEGORY', 'noticeboard');
      formData.append('USER_ID', username);
      if (fileExistCheck) {
        zAxios.post('file-storage/files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).then(function (response) {
          if (response.status === HTTP_STATUS.SUCCESS) {
            if (response.data) {
              let data = response.data;
              if (data.success === true) {
                data.data.forEach(function (element) {
                  notice.files.push(element.id);
                });

                saveData(notice, mode);
              } else if (data.success === false) {
                console.error(data.message);
                showMessage('Error', "파일 업로드를 실패했습니다.", { close: false });
              }
            }
            else {
              console.log('응답 데이타가 없습니다.')
            }
          } else {
            console.log('응답 상태', response.status)
          }
        }).catch(function (error) {
          console.log(error);
        }).then(function () { });
      } else {
        saveData(notice, mode);
      }
    }
  }

  const confirmDetailPop = (notice, uploadedFiles, mode) => {
    saveFiles(notice, uploadedFiles, mode);
  }

  const getCheckValue=(vals, defValue)=> {
    if(!vals || vals.length ==0)
      return defValue;
    else {
      let ret=[]
      vals.forEach(v => {
        if(v)
          ret.push(v)
      })
      return ret.length > 1 ? ret : ret[0] ? ret[0] : defValue;
    }
  }
  const saveSubmit = () => {
    if (popupMode !== 'READ') {
      let notice = props.notice ? props.notice : {}


      let noticeYnArr = getValues('noticeYn')
      notice.content = getValues('content')
      notice.title = getValues('title')
      notice.noticeYn = getCheckValue(noticeYnArr,"N");
      if (!notice.noticeYn) {
        notice.noticeYn = 'N';
      }

      if (!notice.files) {
        notice.files = [];
      }

      if (props.onConfirm)
        props.confirm(notice, uploadedFiles, popupMode);
      else
        confirmDetailPop(notice, uploadedFiles, popupMode);
    }
    props.onClose(false);
  }

  const deleteFile = (id) => {
    showMessage(transLangKey('WARNING'), transLangKey('파일을 삭제하시겠습니까?'), function (answer) {
      if (!answer) {
        return;
      }

      const fileInfo = AttatchFiles.find((f) => f.id == id)
      if (!fileInfo) {
        return;
      }

      return zAxios({
        method: "POST",
        data: fileInfo,
        url: `file-storage/files/delete?ID=${id}&USER_ID=${username}`,
        fromPopup: true,
      }
      ).then(function (response) {
        if (response.status === HTTP_STATUS.SUCCESS) {
          let newAttatchFiles = [...AttatchFiles];
          var index = newAttatchFiles.indexOf(fileInfo);
          if (index !== -1) {
            newAttatchFiles.splice(index, 1);
          }
          setAttachFiles(newAttatchFiles);
        }
      }).catch(function (err) {
        console.log(err);
      });
    })
  }

  const downloadFile = async (id) => {
    return zAxios({
      fromPopup: true,
      method: "GET",
      url: baseURI() + `file-storage/file?ID=${id}`,
      responseType: 'blob'
    }
    ).then(function (response) {
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
  function checkUpdate() {
    if (popupMode == 'NEW') {
      if (getValues('content') !== undefined) {
        showMessage(transLangKey('WARNING'), transLangKey('MSG_5142'), function (answer) {
          if (answer) {
            props.onClose()
          }
        })
      } else {
        props.onClose()
      }
    } else if (popupMode === 'MODIFY') {
      if (props.notice.content !== getValues('content')) {
        showMessage(transLangKey('WARNING'), transLangKey('MSG_5142'), function (answer) {
          if (answer) {
            props.onClose()
          }
        })
      } else {
        props.onClose()
      }
    } else if (popupMode === 'READ') {
      props.onClose()
    }
  }
  return (
    <>
      <PopupDialog type={popupMode == 'READ' ? 'OK' : 'OKCANCEL'} open={props.open} onConfirm={checkUpdate} onClose={checkUpdate} onSubmit={handleSubmit(saveSubmit, onError)} 
        checks={[]} title={getNoticeValue('title')} resizeHeight={650} resizeWidth={1050}>
        <VLayoutBox id="popNoticeDetail" style={{ height: '100%', borderRadius: '15px', padding: '15px', boxShadow: themeType === 'dark' ? '0' : '3px 3px 3px rgb(240 240 240), 0em 0em 0.4em rgb(240 240 240)', border: '1px solid #d8d8d8' }} type={'noWrapFlex'}>
          {
            popupMode !== 'READ' ? (
              <FormRow>
                <InputField name='title' control={control} width="300px" label={transLangKey('NB_POST_TITLE')} style={{ color: themeType === 'dark' ? '#fff' : '#000' }}></InputField>
                <InputField type="check" name={"noticeYn"} label="" control={control} options={[{ label: transLangKey("NB_NOTICE"), value: "Y" }]} />
              </FormRow>
            ) : null
          }
          {
            popupMode === 'READ' ? (
              <FormRow>
                <InputField name='createDttm' control={control} label={transLangKey('NB_POST_DATE')} type='datetime' readonly={true}></InputField>
                <InputField name='createByDisplayName' control={control} label={transLangKey('WRITER')} readonly={true} value={getNoticeValue('createBy')}></InputField>
                {getNoticeValue('createBy') === username ? (<Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}><CommonButton type="text" onClick={() => setPopupMode('MODIFY')}>{transLangKey('MODIFY')}</CommonButton></Box>) : null}
              </FormRow>
            ) : null
          }
          <FormRow style={{ flex: 'auto' }}>
            <InputField
              id="noticeBoardFileUploader"
              name='content'
              control={control}
              width="100%"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
              type='editor'
              //className={{ width: '100%', padding: 0 }}
              style={{ height: '100%', maxWidth: 'unset', flex: 1, margin: 0, border: '1px solid #e2e2e1', borderRadius: '8px', padding: '8px 20px 0px 10px', color: themeType === 'dark' ? '#fff' : '#000' }}
              readonly={popupMode === 'READ' ? true : false}
              fileupload={true}
              handleFileUploaderChange={handleFileUploaderChange}
            />
          </FormRow>
          <FormRow>
            <Box style={{ paddingTop: '10px', overflow: 'auto', height: '100%', width: '100%' }}>
              {
                AttatchFiles.map((file) => {
                  return <Box key={file.id} style={{ display: 'inline-flex', alignItems: 'center', padding: '0px 2px 0px 2px', marginRight: '10px', marginBottom: '5px', borderRadius: '4px' }}>
                    <NavLink to={'#'} key={`NavLink_${file.id}`} onClick={() => downloadFile(file.id)} >
                      <span key={`ListItemText_${file.id}`}>{file.name}</span>
                    </NavLink>
                    {
                      popupMode != 'READ' ? (
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
            </Box>
          </FormRow>
        </VLayoutBox>
      </PopupDialog>
      {themeType === 'dark' && React.createElement("style", null,
        `
            #popNoticeDetail .toastui-editor-contents p {
              color: #fff!important;
            }

            #popNoticeDetail input { 
              color: #c8c8c8!important;
            }

            #popNoticeDetail .ww-mode p {
              color: #222!important;
            }
            `
      )}
    </>
  );
}

PopNoticeDetail.displayName = 'PopNoticeDetail'

export default PopNoticeDetail;
