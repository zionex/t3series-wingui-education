import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import {
  ContentInner, WorkArea, SearchArea, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow,
  InputField, BaseGrid, GridSaveButton,  useViewStore, useContentStore, zAxios
} from "@wingui/common/imports";
import { useMenuStore } from "@zionex/wingui-core/store/contentStore";
import "./grouppermission.css"

let groupGridItems = [
  { name: "grpCd", dataType: "text", headerText: "GRP_CD", editable: false },
  {
    name: "grpNm", dataType: "text", headerText: "GRP_NM", editable: false,
    styleCallback: function (grid, dataCell) {
      let res = {}
      res.styleName = 'link-column';
      return res;
    }
  },
  { name: "grpDescrip", dataType: "text", headerText: "DESCRIP", editable: false }
];

let viewPermissionGridItems = [
  { name: "grpCd", dataType: "text", headerText: "GRP_CD", visible: false, editable: false },
  { name: "menuCd", dataType: "text", headerText: "MENU_CD", editable: false },
  { name: "menuNm", dataType: "text", headerText: "MENU_NM", editable: false },
  {
    name: "PERMISSION_TYPE_READ", dataType: "boolean", headerText: "READ", editable: false,
    renderer: {
      type: "check",
      editable: true,
      trueValues: "true",
      falseValues: "false"
    }
  },
  {
    name: "PERMISSION_TYPE_UPDATE", dataType: "boolean", headerText: "UPDATE", editable: false,
    renderer: {
      type: "check",
      editable: true,
      trueValues: "true",
      falseValues: "false"
    }
  },
  {
    name: "PERMISSION_TYPE_DELETE", dataType: "boolean", headerText: "DELETE", editable: false,
    renderer: {
      type: "check",
      editable: true,
      trueValues: "true",
      falseValues: "false"
    }
  }
];

function GroupPermission() {
  const activeViewId = getActiveViewId()  
  const classes = useResultAreaStyles();
  const history = useHistory();
  const location = useLocation();
  const getContentDataFromPath = useMenuStore(state => state.getContentDataFromPath);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [getViewPath] = useMenuStore(state => [state.getViewPath]);
  const [groupGrid, setGroupGrid] = useState(null);
  const [grpCd, setGrpCd] = useState('');
  const [viewPermissionGrid, setViewPermissionGrid] = useState(null);
  const { control, getValues, setValue } = useForm({
    defaultValues: {
    }
  });
  const globalButtons = [
    {
      name: "search",
      action: (e) => { groupGridLoadData() },
      visible: true,
      disable: false
    }
  ]

  useEffect(() => {
    setGroupGrid(getViewInfo(activeViewId, 'groupGrid'))
    setViewPermissionGrid(getViewInfo(activeViewId, 'viewPermissionGrid'))
  }, [viewData])
  useEffect(() => {
    if (location.state !== undefined && location.state !== null && groupGrid !== null && viewPermissionGrid !== null) {
      const contentData = getContentDataFromPath(location.pathname);
      if (contentData) {
        if (activeViewId === contentData.viewId) {
          setValue('grpNm', location.state.grpNm);
          setGrpCd(location.state.grpCd);
          history.replace({ state: null });
        }
      }
    }
    if (groupGrid) {
      setViewInfo(activeViewId, 'globalButtons', globalButtons)

      setOptions()
      groupGridLoadData()
    }
    if (viewPermissionGrid) {
      setPOptions()
    }
  }, [location, groupGrid, viewPermissionGrid])
  useEffect(() => {
    if (groupGrid !== null && viewPermissionGrid !== null && grpCd !== null && grpCd !== '') {
      groupGridLoadData()
      viewPermissionGridLoadData(grpCd)
    }
  }, [getValues('grpNm'), grpCd])
  function setOptions() {
    groupGrid.gridView.onCellClicked = function (grid, clickData) {
      if (clickData.cellType != "header") {
        let grpCd = grid.getValue(clickData.itemIndex, "grpCd");
        if (grpCd != null) {
          viewPermissionGridLoadData(grpCd);
        }
      }
      let clickedRow = grid.getDataSource().getJsonRow(clickData.dataRow)
      if (clickData.column === 'grpNm') {
        history.push({ pathname: getViewPath('UI_AD_03'), state: { grpNm: clickedRow.grpNm } })
      }
    }
  }
  function setPOptions() {
    setVisibleProps(viewPermissionGrid, true, true, false);
    viewPermissionGrid.gridView.onCellEdited = function (grid, itemIndex, row, field) {
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

    viewPermissionGrid.gridView.onColumnCheckedChanged = function (grid, column, checked) {
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

    viewPermissionGrid.gridView.onFilteringChanged = function (grid, column, filter) {
      setHeaderCheck();
    }
  }
  function setHeaderCheck() {
    let itemCount = viewPermissionGrid.gridView.getItemCount();

    let columnNames = ["PERMISSION_TYPE_READ", "PERMISSION_TYPE_UPDATE", "PERMISSION_TYPE_DELETE"];
    columnNames.forEach(function (name) {
      let headerCheck = true;
      for (let index = 0; index < itemCount; index++) {
        if (!viewPermissionGrid.gridView.getValue(index, name)) {
          headerCheck = false;
          break;
        }
      }
      viewPermissionGrid.gridView.setColumnProperty(name, "checked", headerCheck);
    });
  }
  function menuFilter() {
    let filterValues = [];
    let filters = [];

    let menuCodeValues = viewPermissionGrid.dataProvider.getFieldValues("menuCd", 0, -1);
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

    viewPermissionGrid.gridView.setColumnFilters("menuCd", filters);
    viewPermissionGrid.gridView.setFilteringOptions({ selector: { searchIgnoreCase: true } });
  }
  function groupGridLoadData() {
    groupGrid.gridView.commit(true);

    groupGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get('system/groups', {
      params: {
        'group-nm': getValues('grpNm')
      },
      waitOn: false
    }).then(function (res) {
      groupGrid.dataProvider.fillJsonData(res.data);
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
      groupGrid.gridView.hideToast();
    });
  }
  function viewPermissionGridLoadData(grpCd) {
    viewPermissionGrid.gridView.commit(true);

    viewPermissionGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get('system/groups/' + grpCd + '/permissions', { waitOn: false })
      .then(function (res) {
        if (res.data.length > 0) {
          res.data.forEach(function (data) {
            data.menuNm = transLangKey(data.menuCd);
          });
          viewPermissionGrid.dataProvider.fillJsonData(res.data);
          setHeaderCheck();
          menuFilter();
        }
      }).catch(function (err) {
        console.log(err);
      }).then(function () {
        viewPermissionGrid.gridView.hideToast();
      });
  }
  function viewPermissionGridSaveData() {
    viewPermissionGrid.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(
          viewPermissionGrid.dataProvider.getAllStateRows().created,
          viewPermissionGrid.dataProvider.getAllStateRows().updated,
          viewPermissionGrid.dataProvider.getAllStateRows().deleted,
          viewPermissionGrid.dataProvider.getAllStateRows().createAndDeleted
        );

        let changeRowData = [];
        changes.forEach(function (row) {
          changeRowData.push(viewPermissionGrid.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'));
        } else {
          viewPermissionGrid.gridView.showToast(progressSpinner + 'Saving data...', true);

          zAxios({
            method: 'post',
            headers: { 'content-type': 'application/json' },
            url: 'system/groups/permissions',
            data: changeRowData
          }).then(function (response) {
          }).catch(function (err) {
            console.log(err);
          }).then(function () {
            viewPermissionGrid.gridView.hideToast();
            let current = groupGrid.gridView.getCurrent();
            let grpCd = current.itemIndex != -1 ? groupGrid.gridView.getValue(current.itemIndex, "grpCd") : "";
            viewPermissionGridLoadData(grpCd);
          });
        }
      }
    });
  }
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField control={control} label={transLangKey("GRP_NM")} name="grpNm" onKeyDown={(e) => { if (e.key === 'Enter') { groupGridLoadData() } }}></InputField>
        </SearchRow>
      </SearchArea>
      <WorkArea>
        <ResultArea sizes={[30, 64]} direction={"vertical"}>
          <Box className={classes.resultArea}>
            <BaseGrid id="groupGrid" items={groupGridItems}></BaseGrid>
          </Box>
          <Box className={classes.resultArea}>
            <ButtonArea>
              <LeftButtonArea></LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton title={transLangKey("SAVE")} onClick={viewPermissionGridSaveData}></GridSaveButton>
              </RightButtonArea>
            </ButtonArea>
            <BaseGrid id="viewPermissionGrid" items={viewPermissionGridItems}></BaseGrid>
          </Box>
        </ResultArea>
      </WorkArea>
    </ContentInner>
  );
}

export default GroupPermission
