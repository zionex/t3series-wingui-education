import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup, IconButton } from "@mui/material";
import {
  ContentInner, WorkArea, SearchArea, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow,
  InputField, BaseGrid, GridSaveButton, GridAddRowButton, GridDeleteRowButton, useViewStore, useContentStore, zAxios
} from '@wingui/common/imports';

let deleGridItems = [
  {
    name: "userId", dataType: "text", headerText: "USER_ID", editable: false, width: 100, useDropdown: true, validRules: [{ criteria: "required" }],
    styleCallback: function (grid, dataCell) {
      let ret = {}
      if (dataCell.item.rowState == 'created' || dataCell.item.itemState == 'appending' || dataCell.item.itemState == 'inserting') {
        ret.editable = true;
        ret.styleName = 'editable-column';
      } else {
        ret.editable = false;
      }
      return ret;
    },
  },
  { name: "displayName", dataType: "text", headerText: "USER_NM", editable: false, width: 100 },
  {
    name: "delegationUserId", dataType: "text", headerText: "DELEGATION_USER_ID", editable: false, width: 100, useDropdown: true, validRules: [{ criteria: "required" }],
    styleCallback: function (grid, dataCell) {
      let ret = {}
      if (dataCell.item.rowState == 'created' || dataCell.item.itemState == 'appending' || dataCell.item.itemState == 'inserting') {
        ret.editable = true;
        ret.styleName = 'editable-column';
      } else {
        ret.editable = false;
      }
      return ret;
    },
  },
  { name: "delegationDisplayName", dataType: "text", headerText: "DELEGATION_USER_NM", editable: false, width: 100 },
  { name: "applyStartDttm", dataType: "datetime", format: "yyyy-MM-dd", headerText: "APPY_STRT_DTTM", editable: true, width: 100 },
  { name: "applyEndDttm", dataType: "datetime", format: "yyyy-MM-dd", headerText: "APPY_END_DTTM", editable: true, width: 100 },
  { name: "createBy", dataType: "text", headerText: "CREATE_BY", editable: false, width: 100 },
  { name: "createDttm", dataType: "datetime", headerText: "CREATE_DTTM", editable: false, width: 100 },
  { name: "modifyBy", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: 100 },
  { name: "modifyDttm", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: 100 },
];

function UserDelegation() {
  const activeViewId = getActiveViewId()
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [deleGrid, setDeleGrid] = useState(null);
  const { control, getValues } = useForm({
    defaultValues: {
    }
  });
  const globalButtons = [
    {
      name: "search", action: (e) => { loadData() },
      visible: true,
      disable: false
    }
  ]

  useEffect(() => {
    setDeleGrid(getViewInfo(activeViewId, 'deleGrid'))
  }, [viewData])
  useEffect(() => {
    if (deleGrid) {
      setViewInfo(activeViewId, 'globalButtons', globalButtons)

      setOptions()
      loadData()
    }
  }, [deleGrid])
  function setUserComboBox() {
    let userData = [];
    zAxios.get("system/users", {
      params: {
        'id': getValues('id'),
        'username': getValues('username')
      },
      waitOn: false
    }).then(function (res) {
      if (res.status === HTTP_STATUS.SUCCESS) {
        res.data.map(function (data) {
          userData.push({ id: data.id, name: data.username });
        });
      };
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
      deleGrid.gridView.setColumnProperty("userId", "lookupData", {
        value: "name",
        label: "name",
        list: userData
      }
      );
      deleGrid.gridView.setColumnProperty("delegationUserId", "lookupData", {
        value: "name",
        label: "name",
        list: userData
      }
      );
    });
  }
  function setOptions() {
    setUserComboBox();
    deleGrid.gridView.setCheckBar({ visible: true });
    deleGrid.gridView.setStateBar({ visible: true });
    deleGrid.gridView.onCellEdited = function (grid) {
      grid.commit(true);
    }
  }
  /*------delete Row-------*/
  function deleteRow() {
    let deleteRows = [];
    deleGrid.gridView.getCheckedItems().map(function (indx) {
      if (!deleGrid.dataProvider.getAllStateRows().created.includes(indx)) {
        deleteRows.push(deleGrid.dataProvider.getJsonRow(indx));
      }
    });
    if (!deleteRows.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5112'));
      return;
    }
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_DELETE'), function (answer) {
      if (answer) {
        deleGrid.dataProvider.removeRows(deleGrid.dataProvider.getAllStateRows().created);

        deleGrid.gridView.showToast(progressSpinner + 'Deleting data...', true);

        deleteRows.forEach(function (value) {
          if (value.applyStartDttm && value.applyStartDttm instanceof Date) {
            value.applyStartDttm = value.applyStartDttm.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (value.applyEndDttm && value.applyEndDttm instanceof Date) {
            value.applyEndDttm = value.applyEndDttm.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (value.createDttm && value.createDttm instanceof Date) {
            value.createDttm = value.createDttm.format("yyyy-MM-ddTHH:mm:ss");
          }
        });
        zAxios({
          method: 'post',
          url: 'system/users/delegations/delete',
          headers: { 'content-type': 'application/json' },
          data: deleteRows
        }).then(function (response) {
          if (response.status === HTTP_STATUS.SUCCESS) {
            deleGrid.dataProvider.removeRows(deleGrid.gridView.getCheckedItems());
          }
        })
          .catch(function (err) {
            console.log(err);
          })
          .then(function () {
            deleGrid.gridView.hideToast();
          });
      }
    });
  };
  function saveData() {
    deleGrid.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(
          deleGrid.dataProvider.getAllStateRows().created,
          deleGrid.dataProvider.getAllStateRows().updated,
          deleGrid.dataProvider.getAllStateRows().deleted,
          deleGrid.dataProvider.getAllStateRows().createAndDeleted
        );

        let changeRowData = [];
        changes.map(function (row) {
          changeRowData.push(deleGrid.dataProvider.getJsonRow(row));
        });
        let checkDttm = true;
        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'));
        } else {
          changeRowData.forEach(function (value) {
            if (value.applyStartDttm && value.applyStartDttm instanceof Date) {
              value.applyStartDttm = value.applyStartDttm.format("yyyy-MM-ddTHH:mm:ss");
            }
            if (value.applyEndDttm && value.applyEndDttm instanceof Date) {
              value.applyEndDttm = value.applyEndDttm.format("yyyy-MM-ddTHH:mm:ss");
            }
            if (value.modifyDttm && value.modifyDttm instanceof Date) {
              value.modifyDttm = value.modifyDttm.format("yyyy-MM-ddTHH:mm:ss");
            }

            if (value.applyStartDttm > value.applyEndDttm) {
              checkDttm = false
            }
          })

          if (!checkDttm) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_DATE_CHECK_01'));
            return;
          }

          deleGrid.gridView.showToast(progressSpinner + 'Saving data...', true);

          zAxios({
            method: 'post',
            headers: { 'content-type': 'application/json' },
            url: 'system/users/delegations',
            data: changeRowData
          })
            .then(function (response) {
            })
            .catch(function (err) {
              console.log(err);
            })
            .then(function () {
              deleGrid.gridView.hideToast();
              loadData()
            });
        }
      }
    });
  }
  function loadData() {
    deleGrid.gridView.commit(true);

    deleGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get('system/users/delegations', {
      params: {
        'username': getValues('username'),
        'delegation-username': getValues('delegationUsername')
      },
      waitOn: false
    }).then(function (res) {
      deleGrid.dataProvider.fillJsonData(res.data);
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
      deleGrid.gridView.hideToast();
      if (deleGrid.dataProvider.getRowCount() == 0) {
        deleGrid.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey('MSG_NO_DATA') });
      }
    });
  }
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField control={control} label={transLangKey("USER_ID")} name="username" onKeyDown={(e) => { if (e.key === 'Enter') { loadData() } }}></InputField>
          <InputField control={control} label={transLangKey("DELEGATION_USER_ID")} name="delegationUsername" onKeyDown={(e) => { if (e.key === 'Enter') { loadData() } }}></InputField>
        </SearchRow>
      </SearchArea>
      <WorkArea>
        <ButtonArea>
          <LeftButtonArea></LeftButtonArea>
          <RightButtonArea>
            <ButtonGroup variant="outlined">
              <GridAddRowButton grid="deleGrid"></GridAddRowButton>
              <GridDeleteRowButton grid="deleGrid" onClick={() => { deleteRow() }}></GridDeleteRowButton>
              <GridSaveButton title={transLangKey("SAVE")} style={{ width: "60px" }} onClick={() => { saveData() }}></GridSaveButton>
            </ButtonGroup>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea sizes={[100]} direction={"vertical"}>
          <BaseGrid id="deleGrid" items={deleGridItems}></BaseGrid>
        </ResultArea>
      </WorkArea>
    </ContentInner>
  );

}

export default UserDelegation;
