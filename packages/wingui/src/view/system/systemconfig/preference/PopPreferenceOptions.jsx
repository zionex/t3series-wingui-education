import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, ButtonGroup } from '@mui/material';
import { ButtonArea, LeftButtonArea, RightButtonArea, BaseGrid, GridAddRowButton, GridDeleteRowButton, GridSaveButton, 
  useViewStore, useContentStore, zAxios, PopupDialog } from "@wingui/common/imports";

const popupGrid1Items = [
  { name: "id", dataType: "text", headerText: "id", visible: false },
  { name: "userPrefMstId", dataType: "text", headerText: "USER_PREF_MST_ID", visible: false },
  { name: "optTp", dataType: "text", headerText: "OPTN_TP", visible: true, editable: true, width: "100", useDropdown: true, lookupDisplay: true },
  { name: "optValue", dataType: "text", headerText: "OPTN_VAL", visible: true, editable: true, width: "100" },
]

function PopPreferenceOptions(props) {
  const activeViewId = getActiveViewId()
  let [prefSelectGrid, setPrefSelectGridd] = useState(null);

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, getValues, control, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
    }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(activeViewId, 'prefSelectGrid');
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (prefSelectGrid != grdObjPopup)
          setPrefSelectGridd(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (prefSelectGrid) {
      popupLoadData();
      settingOption();
      loadGridMap();
    }
  }, [prefSelectGrid]);

  const settingOption = () => {
    prefSelectGrid.gridView.setCheckBar({ visible: true })
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

  const loadGridMap = () => {
    let param = { 'group-cd': "CROSSTAB_OPTION" };

    zAxios({
      fromPopup: true,
      method: 'get',
      header: { 'content-type': 'application/json' },
      url: 'system/common/code-name-maps',
      params: param,
      waitOn: false
    }).then(function (res) {
      if (res.status === HTTP_STATUS.SUCCESS) {
        let dataArr = [];
        res.data.map((entry, idx) => { dataArr.push({ label: transLangKey(entry.name), value: entry.code }) })

        prefSelectGrid.gridView.setColumnProperty(
          "optTp",
          "lookupData",
          {
            value: "value",
            label: "label",
            list: dataArr
          }
        );
      }
    })
      .catch(function (err) {
        console.log(err);
      })
  }

  const popupLoadData = () => {
    prefSelectGrid.gridView.commit(true);
    zAxios.get('system/users/preference-options', {
      params: {
        'pref-mst-id': props.data.id,
      }
    })
      .then(function (res) {
        prefSelectGrid.dataProvider.fillJsonData(res.data);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      });
  }

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(
          targetGrid.dataProvider.getAllStateRows().created,
          targetGrid.dataProvider.getAllStateRows().updated,
          targetGrid.dataProvider.getAllStateRows().deleted,
          targetGrid.dataProvider.getAllStateRows().createAndDeleted
        );

        let changeRowData = [];
        changes.forEach(function (row) {
          let data = targetGrid.dataProvider.getJsonRow(row);
          data.userPrefMstId = props.data.id;
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          zAxios({
            method: 'post',
            headers: { 'content-type': 'application/json' },
            url: 'system/users/preference-options',
            data: changeRowData
          }).then(function (response) { })
            .catch(function (err) {
              console.log(err);
            })
            .then(function () {
              popupLoadData();
            });
        }
      }
    });
  }

  //Promise를 리턴해야 한다.
  const onDelete = (targetGrid, deleteRows) => {
    if (deleteRows.length > 0) {
      return zAxios({
        method: 'post',
        url: 'system/users/preference-options/delete',
        headers: { 'content-type': 'application/json' },
        data: deleteRows
      })
    }
  }

  function onAfterDelete(targetGrid) {
    popupLoadData();
  }

  return (
    <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} title="피벗 추가 정보" checks={[prefSelectGrid]} resizeHeight={400} resizeWidth={670}>
      <ButtonArea>
        <LeftButtonArea>
        </LeftButtonArea>
        <RightButtonArea>
          <ButtonGroup variant="outlined">
            <GridAddRowButton grid="prefSelectGrid"></GridAddRowButton>
            <GridDeleteRowButton grid="prefSelectGrid" onDelete={onDelete} onAfterDelete={onAfterDelete}></GridDeleteRowButton>
            <GridSaveButton onClick={() => { saveData(prefSelectGrid) }}>{transLangKey("SAVE")}</GridSaveButton>
          </ButtonGroup>
        </RightButtonArea>
      </ButtonArea>
      <Box style={{ height: "100%" }}>
        <BaseGrid id="prefSelectGrid" items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}
export default PopPreferenceOptions;
