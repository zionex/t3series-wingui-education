import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box, IconButton } from "@mui/material";
import {
  InputField, useViewStore, useIconStyles, PopupDialog, SearchArea, SearchRow, BaseGrid,
} from '@wingui/common/imports';

function PopShowList(props) {
  const iconClasses = useIconStyles();
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, setValue, getValues, control, formState: { errors }, clearErrors, watch } = useForm({
    defaultValues: {
      layout1: [],
      layout2: [],
      layout3: [],
      layout4: [],
    }
  });

  useEffect(() => {
    popupLoadData();
  }, [viewData]);

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
    setValue('layout1', props.data.layout1[0] === "Y" ? ["Y"] : []);
    setValue('layout2', props.data.layout2[0] === "Y" ? ["Y"] : []);
    setValue('layout3', props.data.layout3[0] === "Y" ? ["Y"] : []);
    setValue('layout4', props.data.layout4[0] === "Y" ? ["Y"] : []);
  }

  // popup 확인
  const saveSubmit = () => {
    let layoutShowList = {'layout1': getValues("layout1")
                       , 'layout2': getValues("layout2")
                       , 'layout3': getValues("layout3")
                       , 'layout4': getValues("layout4")};

    props.confirm(layoutShowList);
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title={transLangKey("Layout List")} resizeHeight={400} resizeWidth={250}>
      <Box style={{ height: "100%" }}>
        <InputField
          type="check"
          name={"layout1"}
          control={control}
          options={[
            {
              label: transLangKey('MONTHLY_CALENDAR'),
              value: 'Y',
            }
          ]}
        />
        <InputField
          type="check"
          name={"layout2"}
          control={control}
          options={[
            {
              label: transLangKey('SEARCH_SCHEDULE'),
              value: 'Y',
            }
          ]}
        />
        <InputField
          type="check"
          name={"layout3"}
          control={control}
          options={[
            {
              label: transLangKey('CALENDAR_CATEGORY'),
              value: 'Y',
            }
          ]}
        />
        <InputField
          type="check"
          name={"layout4"}
          control={control}
          options={[
            {
              label: transLangKey('CALENDAR'),
              value: 'Y',
            }
          ]}
          disabled={true}
        />
      </Box>
    </PopupDialog>
  );
}
export default PopShowList;