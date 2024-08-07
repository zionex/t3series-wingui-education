import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box, IconButton } from "@mui/material";
import {
  InputField, useViewStore, useContentStore, useIconStyles, PopupDialog, SearchArea, SearchRow, BaseGrid, zAxios
} from "@wingui/common/imports";
import "./Meeting.css"

const popupGrid1Items = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "email", dataType: "text", headerText: "EMAIL", visible: false, editable: false, width: 100 },
  { name: "phone", dataType: "text", headerText: "PHONE", visible: false, editable: false, width: 100 },
  { name: "username", dataType: "text", headerText: "USER_NM", editable: false, width: 100 },
  // { name: "DISPLAY_NAME", dataType: "text", headerText: "USER_NM", editable: false, width: 100 },
  { name: "department", dataType: "text", headerText: "DEPARTMENT", editable: false, width: 100 },
  { name: "business_value", dataType: "text", headerText: "BUSINESS", editable: false, width: 100 },
];

function PopSelectUserM(props) {
  const iconClasses = useIconStyles()
  const [userSelectGrid, setUserSelectGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const activeViewId = getActiveViewId()
  const { handleSubmit, getValues, setValue, control, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      USERNAME: "",
      // DISPLAY_NAME: "",
    }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(activeViewId, `${props.id}_grid1`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (userSelectGrid != grdObjPopup)
          setUserSelectGrid(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (userSelectGrid) {
      settingOption();
      popupLoadData();
    }
  }, [userSelectGrid]);

  const settingOption = () => {
    userSelectGrid.gridView.setDisplayOptions({ fitStyle: "evenFill" });
    userSelectGrid.gridView.setCheckBar({ visible: true })

    userSelectGrid.gridView.onCellDblClicked = function (grid, clickData) {
      if (clickData.cellType === 'data') {
        let clickedRows = [];
        clickedRows.push(grid.getValues(clickData.itemIndex));
        props.confirm(clickedRows);
        props.onClose();
      }
    };
  }

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
    let param = {
      'username': getValues("USERNAME") === undefined ? "" : getValues("USERNAME"),
      'department': getValues("DEPARTMENT") === undefined ? "" : getValues("DEPARTMENT")
    };

    zAxios({
      method: "get",
      header: { "content-type": "application/json" },
      url: "system/users",
      params: param,
    })
    .then(function (res) {
      if (res.data.length > 0) {
        userSelectGrid.dataProvider.fillJsonData(res.data);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  // popup 확인
  const saveSubmit = () => {
    let checkedRows = [];

    userSelectGrid.gridView.getCheckedRows().forEach(function (index) {
      checkedRows.push(userSelectGrid.dataProvider.getJsonRow(index));
    });
    //checkedRows.push(userSelectGrid.dataProvider.getJsonRow(userSelectGrid.gridView.getCurrent().dataRow));
    props.confirm(checkedRows);
    props.onClose(false);
  }

  // popup 조회 클릭시 조회
  const onPopupSubmit = (data) => {
    popupLoadData();
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title={transLangKey("참석자 추가")} checks={[`${props.id}_grid1`]} resizeHeight={400} resizeWidth={770}>
      <Box>
        <InputField
          name="USERNAME"
          label={transLangKey("사용자 명")}
          readonly={false}
          disabled={false}
          control={control}
        />
        {/* <InputField
          name="DISPLAY_NAME"
          label={transLangKey("사용자 명")}
          readonly={false}
          disabled={false}
          control={control}
        /> */}
        <InputField
          name="DEPARTMENT"
          label={transLangKey("DEPARTMENT")}
          readonly={false}
          disabled={false}
          control={control}
        />
        <IconButton className={iconClasses.iconButton} onClick={handleSubmit(onPopupSubmit, onError)}><Icon.Search /></IconButton>
      </Box>
      <Box style={{ height: "100%" }}>
        <BaseGrid id={`${props.id}_grid1`} items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}
export default PopSelectUserM;