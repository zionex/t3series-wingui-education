import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Paper from '@mui/material/Paper';
import { Box, IconButton, Divider, Popper, Typography, Button, ClickAwayListener, MenuList, MenuItem } from "@mui/material";
import {
  InputField, useViewStore, useContentStore, useIconStyles, PopupDialog, SearchArea, SearchRow, BaseGrid
} from "@wingui/common/imports";
import "./Meeting.css"
import {useMenuStore, SearchMenuInput} from '@zionex/wingui-core/index'

function PopSelectMenu(props) {

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const activeViewId = getActiveViewId()
  const { handleSubmit, reset, getValues, watch,  control, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      linkType: 'I'
    }
  });
  const [linkType, setlinkType] = useState('I'); //탭

  useEffect(() => {
  }, [viewData]);

  useEffect(() => {
      let linkType = getValues('linkType')
      setlinkType(linkType)
  }, [watch('linkType')]);

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  // popup 확인
  const onSubmit = () => {
    let settingUrl = {};
    let linkType = getValues('linkType')

    if(linkType === 'I'){ //내부일때
      settingUrl.linkType = linkType
      settingUrl.viewId = getValues('viewId')
      settingUrl.viewTitle = transLangKey(getValues('viewId'))
    }else if(linkType === 'O'){ //외부일때
      settingUrl.linkType = linkType
      settingUrl.urlLink = getValues('urlLink')
      settingUrl.urlTitle = getValues('urlTitle')
    }
    props.confirm(settingUrl);
    props.setOpen(false);
    reset();
  }

  function onClose() {
    if (props.setOpen)
      props.setOpen(false);
      reset();
  }


  return (
    <>
      <Popper
        anchorEl={props.anchorEl}
        open={props.open}
        placement="bottom-start"
        sx={{ mt: 50, zIndex: 100 }}
      >
        <Paper sx={{ padding: 2, width: '350px', display: 'flex', flexDirection: 'column', border: '1px solid rgb(226, 226, 225)'}}>
          <Box style={{ display: "block", height:'40px', backgroundColor: "#F7F9FC" }} >
          </Box>
          <Box mt={2}>
            <InputField
                type="radio"
                name="linkType"
                control={control}
                label={transLangKey("링크 타입")}
                width={'230px'}
                options={[
                  { label: transLangKey("내부 화면 링크"),  value: "I" },
                  { label: transLangKey("외부 링크"),  value: "O" },
                ]}
              />
          </Box>

          {linkType === 'I' ?
          <Box mt={2}>
            <SearchMenuInput view="UI_UT_ISSUE_MGMT" name='viewId' label={transLangKey("VIEW")} control={control} style={{width : '325px'}}></SearchMenuInput>
          </Box>
          :
          <>
            <Box mt={2}>
              <InputField control={control} label={transLangKey("URL")} width={'325px'} name="urlLink" ></InputField>
            </Box>
            <Box mt={2}>
              <InputField control={control} label={transLangKey("URL 제목")} width={'325px'} name="urlTitle" ></InputField>
            </Box>
          </>
          }
          <Box mt={2} sx={{ display: 'flex', paddingBottom:'10px' }}>
            <Button onClick={() => { onSubmit() }} style={{margin: "13px 13px 0 auto"}} variant="outlined"  >
              {transLangKey("입력")}
            </Button>
            <Button onClick={() => { onClose()}} style={{margin: "13px 13px 0 0", color: "#d32f2f", borderColor: "#d32f2f" }}variant="outlined"  >
              {transLangKey("취소")}
            </Button>
          </Box>
        </Paper>
      </Popper>

    </>
  );
}
export default PopSelectMenu;