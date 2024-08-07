import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box, IconButton } from "@mui/material";
import {
  InputField, useViewStore, useIconStyles, PopupDialog, SearchArea, SearchRow, BaseGrid,
} from "@wingui/common/imports";
import "./Meeting.css"

function PopShowList(props) {
  const iconClasses = useIconStyles();
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, setValue, getValues, control, formState: { errors }, clearErrors, watch } = useForm({
    defaultValues: {
      layout1: [],
      layout2: [],
      layout3: [],
      layout4: [],
      layout5: [],
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
    setValue('layout5', props.data.layout5[0] === "Y" ? ["Y"] : []);
  }
  
  // popup 확인
  const saveSubmit = () => {
    let layoutShowList = {'layout1': getValues("layout1")
                       , 'layout2': getValues("layout2")
                       , 'layout3': getValues("layout3")
                       , 'layout4': getValues("layout4")
                       , 'layout5': getValues("layout5")};

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
              label: 'Calenar, 참석자',
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
              label: 'Agenda',
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
              label: '화면, 첨부',
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
              label: 'ISSUE',
              value: 'Y',
            }
          ]}
        />
        <InputField 
          type="check"
          name={"layout5"}
          control={control}
          options={[
            {
              label: '회의체',
              value: 'Y',
            }
          ]}
        />
      </Box>
    </PopupDialog>
  );
}
export default PopShowList;