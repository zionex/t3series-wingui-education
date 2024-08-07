import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

import PopupDialog from "@zionex/wingui-core/component/PopupDialog";
import TreeGrid from "@zionex/wingui-core/component/grid/TreeGrid";
import { ResultArea, SearchArea, ButtonArea, CommonButton, InputField, BaseGrid, useViewStore, useContentStore, zAxios } from "@wingui/common/imports";

let popupGroupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "grpCd", dataType: "text", headerText: "GRP_CD", visible: false, editable: false, width: 100 },
  { name: "grpNm", dataType: "text", headerText: "GRP_NM", visible: true, editable: false, width: 100 },
  { name: "grpDescrip", dataType: "text", headerText: "DESCRIP", visible: false, editable: false, width: 130 },
];

let popupUserGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false },
  { name: "username", dataType: "text", headerText: "USER_ID", visible: true, editable: false },
  { name: "displayName", dataType: "text", headerText: "USER_NM", visible: true, editable: false },
  { name: "department", dataType: "text", headerText: "DEPARTMENT", visible: true, editable: false },
];

function PopUserSearch(props) {
  // const refPopupGrid1 = useRef({});
  const [groupGrid, setGroupGrid] = useState(null);
  const [userGrid, setUserGrid] = useState(null);
  const activeViewId = getActiveViewId()

  const [viewData, getViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo]);
  const {
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { },
    clearErrors,
  } = useForm({
    defaultValues: {
      username: props.username,
      displayName: props.displayName,
    },
  });

  useEffect(() => {
    const groupGrdObjPopup = getViewInfo(activeViewId, `${props.id}_GroupGrid`);
    if (groupGrdObjPopup) {
      if (groupGrdObjPopup.dataProvider) {
        if (userGrid !== groupGrdObjPopup) setGroupGrid(groupGrdObjPopup);
      }
    }
    const userGrdObjPopup = getViewInfo(activeViewId, `${props.id}_UserGrid`);
    if (userGrdObjPopup) {
      if (userGrdObjPopup.dataProvider) {
        if (userGrid !== userGrdObjPopup) setUserGrid(userGrdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (groupGrid) {
      setOptionsGroup();
      loadGroupGrid();
    }
    if (userGrid) {
      setOptionsUser();
    }
  }, [groupGrid, userGrid]);

  const setOptionsGroup = () => {
    setVisibleProps(groupGrid, true, false, false);
    groupGrid.gridView.setFooters([{ visible: false }]);

    groupGrid.gridView.setDisplayOptions({
      fitStyle: "evenFill",
    });

    if (!props.multiple) {
      grid.gridView.setCheckBar({
        exclusive: true,
      });
    }

    groupGrid.gridView.onCurrentRowChanged = (grid, oldRow, newRow) => {
      popupUserGrid(newRow);
    };

    // groupGrid.gridView.onCellDblClicked = () => {
    //   saveTreeSubmit();
    // };
    // groupGrid.gridView.orderBy(["ITEM_LV_NM"], ["ascending"]);
  };

  // const saveTreeSubmit = () => {
  //   let focusCell = groupGrid.gridView.getCurrent();
  //   let targetRow = focusCell.dataRow;
  //   props.confirm([groupGrid.dataProvider.getJsonRow(targetRow)]);
  //   props.onClose(false);
  // };

  const setOptionsUser = () => {
    setVisibleProps(userGrid, true, false, true);
    userGrid.gridView.setDisplayOptions({
      fitStyle: "evenFill",
    });

    //하나의 행만 체크 가능
    if (!props.multiple) {
      userGrid.gridView.setCheckBar({
        exclusive: true,
      });
    }

    //dobule click 시 선택
    userGrid.gridView.onCellDblClicked = (grid, clickData) => {
      if (clickData.cellType === "data") {
        saveSubmit();
      }
    };
    userGrid.gridView.onCellClicked = (grid, clickData) => {
      if (!props.multiple) {
        const checked = grid.getCheckedRows();
        checked.forEach((element, elInx) => {
          grid.checkRow(element, false);
        })
      }
      if (clickData.cellType === "data") {
        grid.checkRow(clickData.itemIndex, !grid.isCheckedItem(clickData.itemIndex));
      }
    }

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

  function loadGroupGrid() {
    groupGrid.gridView.commit(true);
    zAxios({
      method: 'get',
      url: 'system/groups',
      params: {
        'group-nm': ""
      },
      waitOn: false
    }).then(function (res) {
      res.data.unshift({ grpCd: "", grpNm: transLangKey("ALL") });
      groupGrid.dataProvider.fillJsonData(res.data);
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
      groupGrid.gridView.setAllCheck(false, true);  // init header checkBar
    });
  }

  const popupUserGrid = (idx) => {
    userGrid.gridView.commit(true);

    zAxios.get("system/users/group", {
      params: {
        'group-cd': idx !== -1 ? groupGrid.dataProvider.getValue(idx, "grpCd") : "",
        'username': getValues("username"),
        'display-name': getValues("displayName"),
      },
      waitOn: false
    }).then(function (res) {
      userGrid.dataProvider.fillJsonData(res.data);
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
    });
  };

  // popup 확인
  const saveSubmit = () => {
    let itemRows = [];
    const checkedRows = userGrid.gridView.getCheckedRows();
    if (checkedRows.length > 0) {
      checkedRows.forEach((index) => {
        itemRows.push(userGrid.dataProvider.getJsonRow(index));
      });
    } else {
      let targetRow = userGrid.gridView.getCurrent().dataRow;
      if (targetRow !== -1) {
        itemRows.push(userGrid.dataProvider.getJsonRow(targetRow));
      } else {
        targetRow = groupGrid.gridView.getCurrent().dataRow;
        if (targetRow !== -1) {
          itemRows.push(groupGrid.dataProvider.getJsonRow(targetRow));
        }
      }

    }

    props.confirm(itemRows);
    props.onClose(false);
  };

  // popup 조회 클릭시 조회
  const onPopupSubmit = () => {
    let grpCd = getValues("grpCd");
    let index;

    if (grpCd) {
      let searchOptions = {
        fields: ["grpCd"],
        values: [grpCd],
        startIndex: 0,
        startFieldIndex: 0,
        wrap: true,
        caseSensitive: false,
        partialMatch: true,
      };

      index = groupGrid.gridView.searchItem(searchOptions);
      if (index >= 0) {
        groupGrid.gridView.setCurrent(index);
        popupUserGrid(index);
        return;
      }
    }

    index = groupGrid.gridView.getCurrent();
    popupUserGrid(index.itemIndex);
  };

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title={transLangKey("COMM_SRH_POP_USER")} resizeHeight={800} resizeWidth={1000}>
      <SearchArea>
        {/*submit={handleSubmit(onPopupSubmit, onError)}*/}
        <InputField name="grpCd" label={transLangKey("GRP_CD")} control={control} disabled={false} onKeyDown={(e) => { if (e.key === 'Enter') { onPopupSubmit() } }} />
        <InputField name="username" label={transLangKey("USER_ID")} control={control} disabled={false} />
        <InputField name="displayName" label={transLangKey("USER_NM")} control={control} disabled={false} />
        <CommonButton title={transLangKey("SEARCH")} onClick={() => onPopupSubmit()}>
          <Icon.Search />
        </CommonButton>
      </SearchArea>
      <ResultArea sizes={[30, 70]} direction={"horizontal"}>
        <Box style={{ width: "100%" }}>
          <BaseGrid id={`${props.id}_GroupGrid`} items={popupGroupGridItems} />
        </Box>
        <Box style={{ width: "100%" }}>
          <BaseGrid id={`${props.id}_UserGrid`} items={popupUserGridItems} />
        </Box>
      </ResultArea>
    </PopupDialog>
  );
}

PopUserSearch.propTypes = {
  grpCd: PropTypes.string,
  username: PropTypes.string,
  displayName: PropTypes.string,
};

PopUserSearch.displayName = "PopUserSearch";

export default PopUserSearch;
