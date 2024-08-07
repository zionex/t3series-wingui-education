import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import {
  ContentInner, WorkArea, SearchArea, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow,
  InputField, BaseGrid, GridSaveButton, useViewStore, useContentStore, zAxios
} from '@wingui/common/imports';
import { useLocation } from "react-router-dom";

let userGridItems = [
  { name: "username", dataType: "text", headerText: "USER_ID", editable: false, width: 100, validRules: [{ criteria: "required" }] },
  { name: "displayName", dataType: "text", headerText: "USER_NM", editable: false, width: 100 },
  { name: "uniqueValue", dataType: "text", headerText: "UNIQUE_VALUE", editable: false, width: 100 },
  { name: "department", dataType: "text", headerText: "DEPARTMENT", editable: false, width: 100 },
  { name: "businessValue", dataType: "text", headerText: "BUSINESS", editable: false, width: 100 },
  { name: "email", dataType: "text", headerText: "EMAIL", editable: false, width: 100, validRules: [{ criteria: "inputChar", valid: "email" }] },
  { name: "etc", dataType: "text", headerText: "ETC", editable: false, width: 100 },
]

let pmsnGridItems = [
  { name: "username", dataType: "text", headerText: "USER_ID", visible: false, editable: false, width: 100 },
  { name: "menuCd", dataType: "text", headerText: "MENU_CD", editable: false, width: 100 },
  { name: "menuNm", dataType: "text", headerText: "MENU_NM", editable: false, width: 100 },
  { name: "PERMISSION_TYPE_READ", dataType: "boolean", headerText: "READ", editable: true, width: 100, header: { checkLocation: "left" } },
  { name: "PERMISSION_TYPE_UPDATE", dataType: "boolean", headerText: "UPDATE", editable: true, width: 100, header: { checkLocation: "left" } },
  { name: "PERMISSION_TYPE_DELETE", dataType: "boolean", headerText: "DELETE", editable: true, width: 100, header: { checkLocation: "left" } }
]

function UserPermission() {
  const location = useLocation();
  const classes = useResultAreaStyles();
  const activeViewId = getActiveViewId()
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [usersGrid, setUsersGrid] = useState(null);
  const [pmsnGrid, setPmsnGrid] = useState(null);
  const { control, getValues, setValue } = useForm({
    defaultValues: {
    }
  });
  const globalButtons = [
    {
      name: "search",
      action: (e) => { userGridLoadData() },
      visible: true,
      disable: false
    }
  ]

  useEffect(() => {
    if (location.state !== undefined && location.state !== null && pmsnGrid !== null && usersGrid !== null) {
      setValue('username', location.state.username)
    }
    if (usersGrid) {
      setViewInfo(activeViewId, 'globalButtons', globalButtons)

      setOptions()
      userGridLoadData()
    }
    if (pmsnGrid) {
      setPOptions()
    }
  }, [location, usersGrid, pmsnGrid])
  useEffect(() => {
    if (usersGrid !== null && pmsnGrid !== null) {
      userGridLoadData()
      pmsnGridLoadData(getValues('username'))
    }
  }, [getValues('username')])
  const afterUserGridCreate = (gridObj, gridView, dataProvider) => {
    setUsersGrid(gridObj)
  };
  const afterPmsnGridCreate = (gridObj, gridView, dataProvider) => {
    setPmsnGrid(gridObj)
  };
  function setOptions() {
    usersGrid.gridView.onCellEdited = function (grid) {
      grid.commit(true);
    }

    usersGrid.gridView.onCellClicked = function (grid, clickData) {
      if (clickData.cellType != "header") {
        let username = grid.getValue(clickData.itemIndex, "username");
        if (username != null) {
          pmsnGridLoadData(username);
        }
      }
    }
  }
  function setPOptions() {
    setVisibleProps(pmsnGrid, true, true, false);
    pmsnGrid.gridView.onCellEdited = function (grid, itemIndex, row, field) {
      grid.commit(true);

      let editedValue = grid.getValue(itemIndex, field);
      let values = grid.getValues(itemIndex);
      let readField = grid.getDataSource().getFieldIndex("PERMISSION_TYPE_READ");
      if (field != readField) {
        if (editedValue && !values.PERMISSION_TYPE_READ) {
          grid.setValue(itemIndex, readField, true);
        }
      } else {
        let permissions = [values.PERMISSION_TYPE_UPDATE, values.PERMISSION_TYPE_DELETE];
        if (!editedValue && permissions.indexOf(true) != -1) {
          grid.setValue(itemIndex, field, true);
        }
      }
      setHeaderCheck();
    }

    pmsnGrid.gridView.onColumnCheckedChanged = function (grid, column, checked) {
      grid.commit(true);

      grid.getDataSource().beginUpdate();
      let columnName = column.name;
      let readColumnName = "PERMISSION_TYPE_READ";
      let itemCount = grid.getItemCount();
      try {
        if (columnName != readColumnName) {
          for (let itemIndex = 0; itemIndex < itemCount; itemIndex++) {
            if (checked) {
              grid.setColumnProperty(readColumnName, "checked", checked);
              grid.setValue(itemIndex, readColumnName, checked);
            }
            grid.setValue(itemIndex, columnName, checked);
          }
        } else {
          if (checked) {
            for (let itemIndex = 0; itemIndex < itemCount; itemIndex++) {
              grid.setValue(itemIndex, columnName, checked);
            }
          } else {
            let isHeaderChecked = false;
            let columnNames = ["PERMISSION_TYPE_UPDATE", "PERMISSION_TYPE_DELETE"];
            columnNames.forEach(function (name) {
              if (grid.getColumnProperty(name, "checked")) {
                isHeaderChecked = true;
              }
            });
            grid.setColumnProperty(readColumnName, "checked", true);
            if (!isHeaderChecked) {
              for (let itemIndex = 0; itemIndex < itemCount; itemIndex++) {
                let values = grid.getValues(itemIndex);
                let permissions = [values.PERMISSION_TYPE_UPDATE, values.PERMISSION_TYPE_DELETE];
                if (permissions.indexOf(true) != -1) {
                  grid.setValue(itemIndex, columnName, true);
                } else {
                  grid.setColumnProperty(readColumnName, "checked", false);
                  grid.setValue(itemIndex, columnName, false);
                }
              }
            }
          }
        }
      } finally {
        grid.getDataSource().endUpdate();
      }
    }

    pmsnGrid.gridView.onFilteringChanged = function (grid, column, filter) {
      setHeaderCheck();
    }
  }
  function setHeaderCheck() {
    let itemCount = pmsnGrid.gridView.getItemCount();

    let columnNames = ["PERMISSION_TYPE_READ", "PERMISSION_TYPE_UPDATE", "PERMISSION_TYPE_DELETE"];
    columnNames.forEach(function (name) {
      let headerCheck = true;
      for (let index = 0; index < itemCount; index++) {
        if (!pmsnGrid.gridView.getValue(index, name)) {
          headerCheck = false;
          break;
        }
      }
      pmsnGrid.gridView.setColumnProperty(name, "checked", headerCheck);
    });
  }
  function menuFilter() {
    let filterValues = [];
    let filters = [];

    let menuCodeValues = pmsnGrid.dataProvider.getFieldValues("menuCd", 0, -1);
    menuCodeValues.forEach(function (menuCode) {
      filterValues.push(menuCode.split("_")[1]);
    });

    filterValues.unique().sort().forEach(function (mainMenuCode, index) {
      filters.push({
        name: mainMenuCode,
        text: mainMenuCode,
        tag: index,
        description: mainMenuCode,
        callback: function (ds, dataRow, level, field, filter, value) {
          if (value.split("_")[1] === filter.text) {
            return true;
          }
        }
      });
    });

    pmsnGrid.gridView.setColumnFilters("menuCd", filters);
    pmsnGrid.gridView.setFilteringOptions({ selector: { searchIgnoreCase: true } });
  }
  function userGridLoadData() {
    usersGrid.gridView.commit(true);

    usersGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get('system/users', {
      params: {
        'username': getValues('username'),
        'display-name': getValues('displayName'),
        'unique-value': getValues('uniqueValue')
      },
      waitOn: false
    }).then(function (res) {
      usersGrid.dataProvider.fillJsonData(res.data);
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
      usersGrid.gridView.hideToast();
    });
  }
  function pmsnGridLoadData(username) {
    pmsnGrid.gridView.commit(true);

    pmsnGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get('system/users/' + username + '/permissions', { waitOn: false })
      .then(function (res) {
        if (res.data.length > 0) {
          res.data.forEach(function (data) {
            data.menuNm = transLangKey(data.menuCd);
          });
          pmsnGrid.dataProvider.fillJsonData(res.data);
          setHeaderCheck();
          menuFilter();
        }
      }).catch(function (err) {
        console.log(err);
      }).then(function () {
        pmsnGrid.gridView.hideToast();
      });
  }
  function pmsnGridSaveData() {
    pmsnGrid.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(
          pmsnGrid.dataProvider.getAllStateRows().created,
          pmsnGrid.dataProvider.getAllStateRows().updated,
          pmsnGrid.dataProvider.getAllStateRows().deleted,
          pmsnGrid.dataProvider.getAllStateRows().createAndDeleted
        );

        let changeRowData = [];
        changes.forEach(function (row) {
          changeRowData.push(pmsnGrid.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'));
        } else {
          pmsnGrid.gridView.showToast(progressSpinner + 'Saving data...', true);

          zAxios({
            method: 'post',
            headers: { 'content-type': 'application/json' },
            url: 'system/users/permissions',
            data: changeRowData
          }).then(function (response) {
          }).catch(function (err) {
            console.log(err);
          }).then(function () {
            pmsnGrid.gridView.hideToast();
            let current = usersGrid.gridView.getCurrent();
            let username = current.itemIndex != -1 ? usersGrid.gridView.getValue(current.itemIndex, "username") : "";
            pmsnGridLoadData(username);
          });
        }
      }
    });
  }
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField control={control} label={transLangKey("USER_ID")} name="username" onKeyDown={(e) => { if (e.key === 'Enter') { userGridLoadData() } }}></InputField>
          <InputField control={control} label={transLangKey("USER_NM")} name="displayName" onKeyDown={(e) => { if (e.key === 'Enter') { userGridLoadData() } }}></InputField>
          <InputField control={control} label={transLangKey("UNIQUE_VALUE")} name="uniqueValue" onKeyDown={(e) => { if (e.key === 'Enter') { userGridLoadData() } }}></InputField>
        </SearchRow>
      </SearchArea>
      <WorkArea>
        <ResultArea sizes={[30, 62]} direction={"vertical"}>
          <Box className={classes.resultArea}>
            <BaseGrid id="usersGrid" items={userGridItems} afterGridCreate={afterUserGridCreate}></BaseGrid>
          </Box>
          <Box className={classes.resultArea}>
            <ButtonArea>
              <LeftButtonArea></LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton title={transLangKey("SAVE")} onClick={pmsnGridSaveData}></GridSaveButton>
              </RightButtonArea>
            </ButtonArea>
            <BaseGrid id="pmsnGrid" items={pmsnGridItems} afterGridCreate={afterPmsnGridCreate}></BaseGrid>
          </Box>
        </ResultArea>
      </WorkArea>
    </ContentInner>
  );
}

export default UserPermission
