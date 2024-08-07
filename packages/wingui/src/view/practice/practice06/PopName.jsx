import React, { useState, useEffect } from "react";
import PopupDialog from "@zionex/wingui-core/component/PopupDialog";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { SearchArea, InputField, BaseGrid, useViewStore, useContentStore, zAxios } from "@wingui/common/imports";
import { transLangKey } from "@wingui";
import { LeftButtonArea } from "@zionex/wingui-core";

let popGrid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "100" },
  { name: "NAME", dataType: "text", headerText: "NAME", visible: true, editable: false, width: "100" },
];

function PopName(props) {
  const [popGrid1, setPopGrid1] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const activeViewId = getActiveViewId()
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
    },
  });

  useEffect(() => {
    setPopGrid1(getViewInfo(activeViewId, 'popGrid1'))
  }, [viewData]);

  useEffect(() => {
    if (popGrid1) {
      loadPopupItem(getValues());
    }
  }, [popGrid1]);

  const afterGrid1Create = (gridObj, gridView, dataProvider) => {
    dataProvider.setOptions({ restoreMode: "auto" });
    gridView.setFooters({ visible: false });
    gridView.setStateBar({ visible: false });
    gridView.setEditOptions({ insertable: false, appendable: false });
    gridView.setDisplayOptions({
      fitStyle: "evenFill",
    });

    gridView.onCellDblClicked = function (clickData, itemIndex) {
      let checkedRows = [];

      checkedRows.push(dataProvider.getJsonRow(itemIndex.dataRow));

      props.confirm(checkedRows);
      props.onClose(false);
    };
    gridView.setCheckBar({ exclusive: props.multiple });
  };

  const onError = (errors) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey("WARNING"), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  };

  const loadPopupItem = () => {
    let data = [];

    for (let i = 1; i <= 50; i++) {
      data.push({
        ID: `user${i}`,
        NAME: `유저${i}`
      });
    }

    popGrid1.dataProvider.fillJsonData(data);
  };

  const onPopupSubmit = () => {
    loadPopupItem();
  };

  // popup 확인
  const saveSubmit = () => {
    let checkedRows = [];

    popGrid1.gridView.getCheckedRows().forEach(function (index) {
      checkedRows.push(popGrid1.dataProvider.getJsonRow(index));
    });
    props.confirm(checkedRows);
    props.onClose(false);
  };

  return (
    <PopupDialog open={props.open} onClose={props.onClose} checks={[popGrid1]} onSubmit={handleSubmit(saveSubmit, onError)} title="TEST_POPUP" resizeHeight={400} resizeWidth={800}>
      <SearchArea submit={handleSubmit(onPopupSubmit, onError)} searchButton={true}>
        <InputField name="id" label={"ID"} readonly={false} disabled={false} control={control} />
        <InputField name="name" label={"NM"} control={control} readonly={false} disabled={false} />
      </SearchArea>
      <ButtonArea>
        <LeftButtonArea>
        </LeftButtonArea>
        <RightButtonArea>
        </RightButtonArea>
      </ButtonArea>
      <Box style={{ height: "100%" }}>
        <BaseGrid id="popGrid1" items={popGrid1Items} afterGridCreate={afterGrid1Create} />
      </Box>
    </PopupDialog>
  );
}

export default PopName;
