import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Grid } from '@mui/material';
import { PopupDialog, InputField } from '@wingui/common/imports';

const radioOptions = [
  {
    label: transLangKey('DELETE_CALENDAR_REPEAT_OPTION1'),
    value: "equal",
  },
  {
    label: transLangKey('DELETE_CALENDAR_REPEAT_OPTION2'),
    value: "greaterThenOrEqualTo",
  },
  // {
  //   label: transLangKey('전체 일정 삭제'),
  //   value: "all",
  // }
];

function PopDeleteOption(props) {

  const { handleSubmit, reset, control, getValues, setValue, watch, register, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      type: 'equal',
    }
  });


  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  // 카테고리 저장
  const saveSubmit = () => {
    props.onDeleteWithOption(getValues("type"));
    props.onClose();
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title={transLangKey('CYCL_SCH_EDIT')} resizeHeight={250} resizeWidth={300}>
        <Box style={{ marginTop: "3px", width: "100%", height: "100%" }}>
          <Box sx={{ height: "calc(100% - 50px)" }}>
            <Grid container direction="column">
              <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '100%' }}>
                <InputField type='radio' name='type' label='' control={control} options={radioOptions} />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </PopupDialog>
    </>
  );
}

export default PopDeleteOption;
