import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box, IconButton } from "@mui/material";
import { WorkArea, ResultArea, CommonButton, ButtonArea, RightButtonArea, InputField, useViewStore, useContentStore, useIconStyles, 
  PopupDialog, SearchArea, SearchRow, BaseGrid, zAxios } from '@wingui/common/imports';
import "./usergroup.css"

const popupGrid1Items = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "username", dataType: "text", headerText: "USER_ID", editable: false, width: 100 },
  { name: "displayName", dataType: "text", headerText: "USER_NM", editable: false, width: 100 },
  { name: "department", dataType: "text", headerText: "DEPARTMENT", editable: false, width: 100 },
  { name: "businessValue", dataType: "text", headerText: "BUSINESS", editable: false, width: 100 },
];

function PopSelectUser(props) {
  const [userSelectGrid, setUserSelectGrid] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo])
  const activeViewId = getActiveViewId();
  const { handleSubmit, getValues, setValue, control, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      groupName: "",
      username: "",
    }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(activeViewId, `${props.id}_PopSelectUserGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (userSelectGrid != grdObjPopup)
          setUserSelectGrid(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (userSelectGrid) {
      popupLoadData();
      settingOption();
    }
  }, [userSelectGrid]);

  const settingOption = () => {
    userSelectGrid.gridView.setCheckBar({ visible: true })
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

  const popupLoadData = () => {
    zAxios.get('system/users/' + props.groupCode + '/except', {
      fromPopup: true,
      params: {
        'username': getValues("username"),
        'display-name': getValues("displayName"),
      }
    }).then(function (res) {
      userSelectGrid.dataProvider.fillJsonData(res.data);
    }).catch(function (err) {
      console.log(err);
    })
  };

  // popup 확인
  const saveSubmit = () => {
    let checkedRows = [];
    userSelectGrid.gridView.getCheckedRows().forEach(function (index) {
      checkedRows.push(userSelectGrid.dataProvider.getJsonRow(index));
    });
    if(checkedRows.length > 0) {
      props.confirm(checkedRows);
    }
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} checks={[userSelectGrid]} title={transLangKey("ADD_USER")} resizeHeight={450} resizeWidth={770}>
      <SearchArea>
        <InputField name="username" label={transLangKey("USER_ID")} readonly={false} disabled={false} control={control} />
        <InputField name="displayName" label={transLangKey("USER_NM")} control={control} readonly={false} />        
      </SearchArea>
      <WorkArea>
        <ButtonArea title={"USER"}>
          <RightButtonArea>
            <CommonButton title={transLangKey("SEARCH")} onClick={popupLoadData}>
              <Icon.Search size={20} />
            </CommonButton>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id={`${props.id}_PopSelectUserGrid`} items={popupGrid1Items}></BaseGrid>
        </ResultArea>
      </WorkArea>
    </PopupDialog>
  );
}
export default PopSelectUser;