import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box, FormControlLabel, IconButton, Switch, TextField } from "@mui/material";
import {
  InputField, useViewStore, PopupDialog, useContentStore, zAxios
} from '@wingui/common/imports';

function PopNoticeSetting(props) {
  const activeViewId = getActiveViewId()
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, getValues, control, setValue, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      newContentsRangeDays: 1,
      badgeOn: true
    }
  });

  useEffect(() => {
    getNoticeBoardBadge();
  }, []);

  const saveSubmit = () => {
    saveNoticeBoardBadge();
    props.onClose();
  }

  const saveNoticeBoardBadge = () => {
    var useYn = getValues('badgeOn') ? "Y" : "N";
    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: 'system/menus/badges/noticeboard',
      params: {
        USE_YN: useYn,
        EXPIRED_DAYS: getValues('newContentsRangeDays')
      }
    })
      .then(function (response) { })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        getNoticeBoardBadge();
      });
  }

  const getNoticeBoardBadge = () => {
    zAxios.get("system/menus/badges/noticeboard", {
    }).then(function (response) {
      if (response.status === HTTP_STATUS.SUCCESS) {
        if (response.data != null && response.data.menuId != undefined) {
          setValue('badgeOn', true)
          setValue('newContentsRangeDays', response.data.expiredDays);
        }else{
          setValue('badgeOn', false)
          setValue('newContentsRangeDays', 1);
        }
      }
    }).catch(function (err) {
      setValue('badgeOn', false)
      setValue('newContentsRangeDays', 1);
      console.log(err);
    }).then(function () {
    })
  }
  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={saveSubmit} title={transLangKey("NOTICEBOARD_OPTION_SET")} resizeHeight={220} resizeWidth={400}>
      <Box>
        <InputField inputType="labelText" type="custom" name="badgeOn" label={transLangKey("USE_BADGE")} control={control} 
        inputComponent={
          ({defInputWidth, defInputHeight,variant,size,searchPosition,...props}) =>{
            return (
              <Switch onClick={() => { setValue('badgeOn', !getValues('badgeOn')) }}  checked={getValues('badgeOn')} />
          )
          }
        }
        />
        <InputField inputType="labelText" type="number" name="newContentsRangeDays" label={transLangKey("NOTICEBOARD_NEW_CONTENTS_RANGE")} control={control} />
      </Box>
    </PopupDialog>
  );
}
export default PopNoticeSetting;
