import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { Box, Button, ClickAwayListener, Paper, Typography } from "@mui/material";
import {
  InputField, BaseGrid, CommonButton, GridAddRowButton, GridDeleteRowButton, GridSaveButton, zAxios
} from "@wingui/common/imports";

const styles = {
  position: 'absolute',
  top: 106,
  zIndex: 1200,
  height: '89%',
  borderRadius: '1',
  p: 1,
  // bgcolor: 'background.paper',
  right: 0,
};

let propsGridItems = [
  { name: "defaultYn", dataType: "boolean", headerText: "DEFAULT_YN", editable: false, visible: false },
  { name: "editYn", dataType: "boolean", headerText: "EDIT_YN", editable: false, visible: false },
  { name: "themeCd", dataType: "text", headerText: "THEME_CD", editable: false, visible: false, validRules: [{ criteria: "required" }] },
  { name: "category", dataType: "text", headerText: "CATEGORY", editable: false, editableNew: true, visible: true, validRules: [{ criteria: "required" }], useDropdown: true, lookupDisplay: true },
  { name: "propType", dataType: "text", headerText: "PROPERTY_TYPE", autoFilter: true, editableNew: true, editable: false, visible: true, validRules: [{ criteria: "required" }] },
  { name: "propKey", dataType: "text", headerText: "PROPERTY_KEY", editable: false, editableNew: true, validRules: [{ criteria: "required" }] },
  {
    name: "propValue", dataType: "text", headerText: "PROPERTY_VALUE", visible: true, width: 80,
    styleCallback: function (grid, dataCell) {
      let ret = {}
      let editYn = grid.getValue(dataCell.index.itemIndex, "editYn");
      if (editYn) {
        ret.styleName = '';
        ret.readonly = true;
        ret.editable = false;
      } else {
        ret.readonly = false;
        ret.editable = true;
        ret.styleName = 'editable-text-column';
      }
      return ret;
    },
    editable: false
  },
  {
    name: "propColor", dataType: "text", headerText: "COLOR", width: 40, editable: true, visible: true,
    valueCallback: function (provider, dataRow, fieldName, fieldNames, values) {
      let propValue = values[fieldNames.indexOf("propValue")];
      return propValue
    },
    styleCallback: function (grid, dataCell) {
      let ret = {};
      let editYn = grid.getValue(dataCell.index.itemIndex, "editYn");
      let propValue = grid.getValue(dataCell.index.itemIndex, "propValue");
      if (editYn) {
        ret.styleName = '';
        ret.readonly = true;
        ret.editable = false;
      } else {
        //color value only HEX format(#000000)
        if (propValue !== undefined && (propValue.indexOf("#") == -1 || (propValue.indexOf("#") > -1 && propValue.length > 7))) {
          ret.editable = false;
          ret.styleName = "text-column";
        } else {
          ret.readonly = false;
          ret.editable = true;
          ret.styleName = 'editable-text-column';
        }
      }
      return ret;
    }
  },
  { name: "referCd", dataType: "text", headerText: "REFERENCE_CD", editable: false },
  {
    name: "commonYn", dataType: "boolean", headerText: "UI_CM_COMMON", editable: false, width: 50,
    styleCallback: function (grid, dataCell) {
      let ret = {}
      let category = grid.getValue(dataCell.index.itemIndex, "category");
      if (category === 't3smartscm' || dataCell.item.rowState === "created" || dataCell.item.rowState === "appending" || dataCell.item.rowState === "inserting") {
        ret.renderer = { editable: true };
        ret.styleName = 'editable-column';
      }
      return ret;
    },
  },
  { name: "descrip", dataType: "text", headerText: "DESCRIP", editable: false },
];

function PropertiesPanel(props) {
  const [propGrid, setPropGrid] = useState(null);
  const [themeCd, setThemeCd] = useState([]);
  const classes = usePopupDialogStyles(props);
  const { control, getValues, watch } = useForm({
    defaultValues: {
    }
  });

  const loadCateogry = async () => {
    const cateogry = await loadComboList({
      URL: "themes/category",
      CODE_KEY: "category",
      CODE_VALUE: "category",
      PARAM: {},
      ALLFLAG: false,
      TRANSLANG_LABEL: false,
      waitOn: false
    });
    if (cateogry) {
      propGrid.gridView.setColumnProperty("category", "lookupData", { value: "value", label: "label", list: cateogry });
    }

    const themeCode = await loadComboList({
      URL: "themes/themeCd",
      CODE_KEY: "themeCd",
      CODE_VALUE: "themeCd",
      PARAM: {},
      ALLFLAG: false,
      TRANSLANG_LABEL: false,
      waitOn: false
    });
    if (themeCode) {
      setThemeCd(themeCode)
    }
  };

  useEffect(() => {
    if (propGrid) {
      setOptions()
      loadCateogry();
    }
  }, [propGrid]);

  useEffect(() => {
    if (propGrid && props.openPanel) {
      loadData()
    }
  }, [propGrid, props.openPanel])
  const afterGridCreate = (gridObj, gridView, dataProvider) => {
    setPropGrid(gridObj)
  };
  function setOptions() {

    const checkableCallback = (dataSource, item) => {
      let defaultYn = dataSource.getValue(item.dataRow, 'defaultYn');
      return !defaultYn;
    }
    propGrid.gridView.setCheckBar({ visible: true, syncHeadCheck: true, checkableCallback });
    propGrid.gridView.setStateBar({ visible: true });
    propGrid.gridView.setDisplayOptions({ fitStyle: 'none' });

    // propGrid.gridView.orderBy(['category', 'propType', 'propKey'], ['ascending', 'descending', 'ascending']);
    setColorPickerRenderer(propGrid.gridView, 'propColor', {}, 'propValue');
  }
  function loadData() {
    propGrid.gridView.commit(true)
    propGrid.gridView.showToast(progressSpinner + 'Load Data...', true);
    zAxios.get('system/themes/' + props.themeMode, {
      params: {
        category: getValues('category'),
        'prop-type': getValues('propertyType'),
      },
      waitOn: false
    }).then(function (res) {
      propGrid.dataProvider.fillJsonData(res.data);
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
      propGrid.gridView.hideToast();
    });
  }
  function saveThemeData() {
    let changes = [];
    changes = changes.concat(
      propGrid.dataProvider.getAllStateRows().created,
      propGrid.dataProvider.getAllStateRows().updated,
      propGrid.dataProvider.getAllStateRows().deleted,
      propGrid.dataProvider.getAllStateRows().createAndDeleted
    );

    let changeRowData = [];
    changes.forEach((row) => {
      let dataRow = propGrid.dataProvider.getJsonRow(row);

      // 공통 check
      if (dataRow.commonYn) {
        dataRow.themeCd = "COMMON";
        changeRowData.push(dataRow);
        return;
      }
      // 공통 uncheck
      themeCd.forEach((theme) => {
        if (theme.value !== "COMMON") {
          let newDataRow = { ...dataRow, themeCd: theme.value };
          changeRowData.push(newDataRow);
        }
      });
    });

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: 'system/themes/' + getValues('themeCd'),
      data: changeRowData,
      selector: 'propertiesPanel',
      waitOn: false
    }).catch(function (error) {
      console.log(err);
    }).then(function () {
      loadData()
    });
  }

  const handleClickAway = () => {
  };

  const onDelete = (targetGrid, deleteRows) => {
    if (deleteRows.length > 0) {
      return zAxios({
        method: 'post',
        url: 'system/themes/delete',
        headers: { 'content-type': 'application/json' },
        data: deleteRows
      })
    }
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === "propGrid") {
      loadData();
    }
  }

  return (
    <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={handleClickAway}>
      <Box id='propertiesPanel'>
        {props.openPanel ? (
          <Box sx={{ ...styles, boxShadow: 2, right: '0px' }} >
            <Paper sx={{ height: '98%', borderRadius: 0, boxShadow: 'none', padding: '4px' }}>
              <Box className={classes.popupDialogTitle} sx={{ display: 'flex', height: '4%', width: '100%', p: '5px' }}>
                <Typography style={{ fontSize: '15px', margin: "0 8px" }}>{transLangKey('All Colors')}</Typography>
              </Box>
              <Box sx={{}} >
                <InputField control={control} label={transLangKey("CATEGORY")} name="category" onKeyDown={(e) => { if (e.key === 'Enter') { loadData() } }}></InputField>
                <InputField control={control} label={transLangKey("PROPERTY_TYPE")} name="propertyType" onKeyDown={(e) => { if (e.key === 'Enter') { loadData() } }}></InputField>
                <CommonButton title={transLangKey('SEARCH')} onClick={loadData}><Icon.Search /></CommonButton>
                <GridAddRowButton grid="propGrid" />
                <GridDeleteRowButton grid="propGrid" type="icon" onDelete={onDelete} onAfterDelete={afterToLoad} />
                <GridSaveButton title={transLangKey('SAVE')} onClick={saveThemeData} />
              </Box>
              <Box data-role='panal' sx={{ height: '88%', width: '800px', overflowY: 'auto' }} >
                <BaseGrid id="propGrid" items={propsGridItems} afterGridCreate={afterGridCreate}></BaseGrid>
              </Box>
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                pt: '5px'
              }}>
                <Button onClick={() => props.onClose()} variant={'contained'} >{transLangKey("CLOSE")}</Button>
              </Box>
            </Paper>
          </Box>
        ) : null}
      </Box>
    </ClickAwayListener>
  );
}


export default PropertiesPanel