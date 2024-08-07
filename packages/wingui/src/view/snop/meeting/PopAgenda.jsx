import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box, IconButton } from "@mui/material";
import {
  InputField, useViewStore, useIconStyles, PopupDialog, SearchArea, SearchRow, BaseGrid
} from "@wingui/common/imports";
import "./Meeting.css"

function PopAgenda(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, getValues, control, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
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

  // popup 확인
  const saveSubmit = () => {
    let agendaTitle = getValues("AGENDA_TITLE");
    let agendaContents = getValues("AGENDA_CONTENTS");
    let agendaData = [{agendaTitle: agendaTitle, agendaContents: agendaContents}];

    props.confirm(agendaData);
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title={transLangKey("Agenda 등록")} resizeHeight={400} resizeWidth={770}>
      <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }} >
        <InputField
          name="AGENDA_TITLE"
          type="text"
          label="Agenda 제목"
          control={control}
          style={{ width: "99%" }}
        />
        <InputField
          name="AGENDA_CONTENTS"
          type="textarea"
          label="Detail"
          control={control}
          style={{ width: "99%", height: "100%", maxWidth: "unset", maxHeight: "unset" }}
        />
      </Box>
    </PopupDialog>
  );
}
export default PopAgenda;