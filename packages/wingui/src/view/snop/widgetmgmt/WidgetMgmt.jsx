import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { ButtonGroup } from "@mui/material";
import {
  ContentInner, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea,
  TreeGrid, GridSaveButton, GridAddRowButton, GridDeleteRowButton, useViewStore, useContentStore, zAxios
} from "@wingui/common/imports";
import IconPicker from "../../common/IconPicker";
import "./widget.css";

function WidgetMgmt() {
  const activeViewId = getActiveViewId()
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])
  const [widgetGrid, setWidgetGrid] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(0);
  const globalButtons = [
    { name: "search", action: (e) => { loadData() }, visible: true, disable: false }
  ]
  useEffect(() => {
    setWidgetGrid(getViewInfo(activeViewId, 'widgetGrid'))
  }, [viewData])
  useEffect(() => {
    if (widgetGrid) {
      setViewInfo(activeViewId, 'globalButtons', globalButtons)
      setGridFieldAndColumn(widgetGrid.dataProvider, widgetGrid.gridView);
      if (widgetGrid.dataProvider) {
        loadData();
      }
    }
  }, [widgetGrid])

  const { formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      langCd: 'all'
    }
  });
  function setGridFieldAndColumn(dataProvider, gridView) {
    dataProvider.setOptions({ restoreMode: "auto" });
    gridView.setFooters({ visible: false });
    gridView.setCheckBar({ visible: true });
    gridView.setDisplayOptions({
      showEmptyMessage: true,
      emptyMessage: transLangKey('MSG_NO_DATA'),
      fitStyle: "evenFill",
      showChangeMarker: false,
      useFocusClass: true,
      columnMovable: false
    });
    gridView.setEditOptions({
      movable: true,
      rowMovable: true
    });

    gridView.setContextMenu([
      { label: transLangKey("INSERT_WIDGET_GROUP") },
      { label: transLangKey("INSERT_WIDGET") }
    ]);

    let fields = [
      { fieldName: "id" },
      { fieldName: "widgetNm" },
      { fieldName: "parentId" },
      { fieldName: "path" },
      { fieldName: "type" },
      { fieldName: "seq", dataType: "number" },
      { fieldName: "usable", dataType: "boolean" },
      { fieldName: "icon" },
      { fieldName: "insertFlag" }
    ]

    let columns = [
      {
        name: "id", fieldName: "id",
        header: { text: transLangKey("WIDGET_ID") },
        editable: false, width: 150,
        styleCallback: function (gird, dataCell) {
          let ret = {};
          let rowState = dataProvider.getRowState(dataCell.index.dataRow)
          if (rowState === "created") {
            ret.editable = true;
            ret.styleName = 'editable-text-column';
          } else {
            ret.styleName = 'text-column';
          }
          return ret;
        }
      },
      {
        name: "id", fieldName: "id",
        header: { text: transLangKey("WIDGET_NM") },
        width: 150, editable: false,
        styleName: "text-column",
        displayCallback: function (grid, index, value) {
          return transLangKey(value);
        }
      },
      {
        name: "parentId", fieldName: "parentId",
        header: { text: transLangKey("WIDGET_PARENT_ID") },
        styleName: "text-column",
        width: 150, visible: false, editable: false,
        styleCallback: function (gird, dataCell) {
          let ret = {};
          if (!dataCell.value || dataCell.value.length === 0) {
            ret.editable = false;
            ret.styleName = '';
            return ret;
          }
        },
        displayCallback: function (grid, index, value) {
          return transLangKey(value);
        }
      },
      {
        name: "path", fieldName: "path",
        header: { text: transLangKey("WIDGET_PATH") },
        styleCallback: function (gird, dataCell) {
          let ret = {}

          if (dataCell.dataColumn.editable) {
            ret.styleName = 'editable-text-column';
          }

          if (dataCell.value === null) {
            ret.styleName = '';
            ret.editable = false;
          }

          return ret;
        },
        width: 200, editable: true
      },
      {
        name: "type", fieldName: "type",
        header: { text: transLangKey("WIDGET_TP") },
        width: 50, editable: false,
        renderer: {
          type: "check",
          editable: true,
          trueValues: "true",
          falseValues: "false"
        },
        styleCallback: function (grid, dataCell) {
          let styles = {}
          let parentId = grid.getValue(dataCell.index.itemIndex, "parentId");
          let insertFlag = grid.getValue(dataCell.index.itemIndex, "insertFlag");

          if (parentId === null || insertFlag === "R") {
            styles.styleName = '';
            styles.editable = false;
            styles.readonly = true;
          } else if (parentId !== null && insertFlag === "M") {
            styles.styleName = '';
            styles.editable = false;
            styles.readonly = true;
          } else {
            styles.readonly = false;
            styles.styleName = 'editable-column';
          }

          return styles;
        }
      },
      {
        name: "seq", fieldName: "seq",
        width: 50, editable: true,
        header: { text: transLangKey("WIDGET_SEQ") },
        styleName: "editable-number-column",
        numberFormat: "#,##0.###"
      },
      {
        name: "usable", fieldName: "usable",
        header: { text: transLangKey("USE_YN") },
        width: 50, editable: false,
        renderer: {
          type: "check",
          editable: true,
        },
        styleCallback: function () {
          let style = {};
          style.styleName = 'editable-column';

          return style;
        }
      },
      {
        name: "icon", fieldName: "icon",
        header: { text: transLangKey("WIDGET_ICON") },
        width: 100, editable: false,
        button: "action",
        styleCallback: function (grid, dataCell) {
          let res = {}
          if (dataCell.item.rowState == 'inserting' || dataCell.item.itemState == 'appending') {
            res.editable = true;
            res.styleName = 'editable-text-column';
          } else if (dataCell.item.itemState == 'created') {
            if (grid.getInvalidCells().length > 0) {
              res.editable = false;
            } else {
              res.editable = true;
            }
          } else {
            res.editable = false;
          }
          return res;
        },
        renderer: {
          type: "html",
          inputFocusable: true,
          callback: function (grid, cell, w, h) {
            let icon = ''
            if (cell.value !== undefined) {
              let iconNm = cell.value;
              if (iconNm !== null) {
                iconNm = cameCaseToHyphen(iconNm)
                if (feather.icons[iconNm] !== undefined) {
                  icon = "<i data-feather='" + iconNm + "'/>"
                }
              }
            }
            return icon
          },
          editable: false
        },
        editable: false
      },
    ];
    dataProvider.setFields(fields);
    gridView.setColumns(columns);

    gridView.onItemChecked = function (grid, itemIndex, checked) {
      let dataRow = grid.getDataRow(itemIndex);
      grid.expand(itemIndex, true, true);
      checkNode(grid, dataRow, checked);
    }
    gridView.onContextMenuPopup = function (grid, x, y, elementName) {
      if (elementName) {
        let selectRow = gridView.getValues(elementName.itemIndex);
        let hasChildren = dataProvider.getChildren(gridView.getDataRow(elementName.itemIndex)) !== null ? true : false;
        let rowState = dataProvider.getRowState(gridView.getDataRow(elementName.itemIndex)) === "created" ? true : false;
        let insertFlag = gridView.getValue(elementName.itemIndex, 'insertFlag');

        if (selectRow.parentId === null || rowState ? selectRow.parentId === null : selectRow.parentId.length === 0) {
        } else if (selectRow.parentId !== null && rowState ? insertFlag === 'M' : hasChildren) {
        } else {
          return false;
        }
      }
    };
    gridView.onCellDblClicked = function (grid, clickData) {
      gridView.expand(clickData.itemIndex, true, true);
    }
    gridView.onCellButtonClicked = function (grid, index, column) {
      let row = grid.getValues(index.itemIndex);
      setSelectedRow(grid.getDataRow(index.itemIndex));

      if (row.insertFlag === "R") {
        if (isActive) {
          setDialogOpen(false);
          setDialogOpen(true);
        }
        setDialogOpen(true);
      } else {
        setDialogOpen(false);
      }
    };
    dataProvider.onRowsSiblingMoved = function (provider, row, offset) {
      let rowId = row[0].rowId;
      let parent = dataProvider.getParent(rowId);
      let sibling = parent == -1 ? dataProvider.getChildren() : dataProvider.getChildren(parent);
      let index = sibling.indexOf(rowId);
      let seq = 0;

      if (index !== 0) {
        seq = dataProvider.getValue(sibling[index - 1], "seq") + 1;
      }

      dataProvider.setValue(rowId, "seq", seq);
    };
    gridView.onCellEdited = function (grid, itemIndex, row, field) {
      grid.commit();

      if (field === 0) {
        let id = grid.getValue(itemIndex, "id");
        let desRows = dataProvider.getChildren(row);
        if (desRows) {
          desRows.forEach(function (row) {
            dataProvider.setValue(row, "parentId", id);
          });
        }
      }

      if (field === 6) {
        grid.expand(itemIndex, true, true, 0);
        let useYn = grid.getValue(itemIndex, "usable");

        checkSibling(grid, row, useYn);
        checkChildren(grid, row, useYn);

        function checkChildren(grid, row, useYn) {
          let desRows = dataProvider.getDescendants(row);
          if (desRows) {
            desRows.forEach(function (row) {
              dataProvider.setValue(row, "usable", useYn);
            });
          }
        }

        function checkSibling(grid, row, useYn) {
          let parent = dataProvider.getParent(row);
          let sibling = parent == -1 ? dataProvider.getChildren() : dataProvider.getChildren(parent);
          let index = sibling.indexOf(row);

          if (index !== -1) {
            sibling.splice(index, 1);
          }

          if (useYn) {
            useYn = true;
          } else {
            sibling.forEach(function (i) {
              let value = dataProvider.getValue(i, "usable");
              if (useYn != value) {
                useYn = true;
              }
            });
          }

          if (parent > -1) {
            dataProvider.setValue(parent, "usable", useYn);
            checkSibling(grid, parent, useYn);
          }
        }
      }
    }
    gridView.onContextMenuItemClicked = function (grid, item, clickData) {
      let selectRow = gridView.getValues(clickData.itemIndex);
      let widgetId = gridView.getValue(clickData.itemIndex, "id");
      gridView.expand(clickData.itemIndex);
      let children = dataProvider.getChildren(selectRow['__rowId']);
      let defaultSeq = 1;

      if (children) {
        defaultSeq = dataProvider.getValue(children[children.length - 1], "seq") + 1;
      }

      if (item.label === transLangKey("INSERT_WIDGET_GROUP")) {
        dataProvider.addChildRow(selectRow['__rowId'], ['', '', widgetId, '', null, defaultSeq, true, '', 'M'], -1, true);
      } else {
        dataProvider.addChildRow(selectRow['__rowId'], ['', '', widgetId, '', '', defaultSeq, true, null, 'S']);
      }
      setTimeout(() => { feather.replace() }, 0);
    };
    gridView.onDataLoadComplated = function (grid) {
      feather.replace()
    }
    gridView.onCellClicked = function (grid, clickData) {
      if (clickData.cellType === 'header') {
        setTimeout(() => { feather.replace() }, 0);
      }
    }
    gridView.onTreeItemChanged = function (tree, itemIndex, rowId) {
      setTimeout(() => { feather.replace() }, 0);
    };
    gridView.onTreeItemExpanded = function (tree, itemIndex, rowId) {
      setTimeout(() => { feather.replace() }, 0);
    };
    gridView.onTreeItemCollapsed = function (tree, itemIndex, rowId) {
      setTimeout(() => { feather.replace() }, 0);
    };
  }
  function setIcon(icon) {
    widgetGrid.dataProvider.setValue(selectedRow, "icon", icon);
    widgetGrid.gridView.commit(true);
    setTimeout(() => { feather.replace() }, 0);
  }
  function setActive(active) {
    setIsActive(active);
    setPopupVisible(active);
  }
  async function loadData() {
    let gridView = widgetGrid.gridView;
    let dataProvider = widgetGrid.dataProvider;

    gridView.commit(true);

    gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get('system/widgets?all-widgets=true', {
      headers: getHeaders()
    })
      .then(function (res) {
        res.data.map(function (data) {
          if (data.id !== "" && data.path === "" && data.parentId === "") {
            let allPath = getWidgetPath(data);
            data.path = allPath.split("/")[1];
            data.insertFlag = "R";
            setWidgetPath(data.items, 1);
          }
        });
        let responseData = { "items": res.data };
        dataProvider.setObjectRows(responseData, "items", "", "");
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        gridView.hideToast();
      });

    gridView.expandAll();
  }
  function getWidgetPath(w) {
    let type = w.items.length === 0 ? true : false
    if (type) {
      return w.path;
    } else {
      return getWidgetPath(w.items[0]);
    }
  }
  function setWidgetPath(w, level) {
    w.map(function (data) {
      let type = data.items.length === 0 ? true : false
      if (type) {
        let tempPath = data.path.split("/");
        data.path = tempPath[tempPath.length - 1];
        data.insertFlag = "S";
      } else {
        let tempAllPath = getWidgetPath(data).split("/");
        data.path = tempAllPath[level + 1];
        data.insertFlag = "M";
        setWidgetPath(data.items, level + 1);
      }
    });
  }
  function insertWidget() {
    let defaultSeq = 1;
    let widgetList = widgetGrid.dataProvider.getChildren();
    if (widgetList) {
      defaultSeq = widgetGrid.dataProvider.getValue(widgetList[widgetList.length - 1], "seq") + 1;
    }

    widgetGrid.dataProvider.addChildRow(0, ['', '', null, '', null, defaultSeq, true, '', 'R'], -1, true);
  }
  function deleteWidget() {
    widgetGrid.gridView.commit(true);

    let checkedRows = widgetGrid.gridView.getCheckedRows();
    if (checkedRows.length === 0) {
      showMessage(transLangKey('WARNING'), transLangKey('MSG_5039'), { close: false }, function (answer) {
      });
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let deleteRows = [];
          let deleteList = [];

          checkedRows.forEach(function (row) {
            if (widgetGrid.dataProvider.getRowState(row) !== "created") {
              let deleteRow = widgetGrid.dataProvider.getJsonRow(row);
              deleteRows.push(deleteRow);
            }
          });
          widgetGrid.dataProvider.removeRows(widgetGrid.dataProvider.getAllStateRows().created);
          if (deleteRows.length > 0) {
            deleteRows.forEach(function (row) {
              deleteList.push(row.id);
            });
            zAxios({
              method: 'post',
              headers: getHeaders(),
              url: 'system/widgets/delete',
              data: deleteList
            })
              .then(function (response) {
                if (response.status === HTTP_STATUS.SUCCESS) {
                  widgetGrid.dataProvider.clearRows();
                  loadData();
                }
              })
              .catch(function (err) {
                console.log(err);
              });
          }
        }
      });
    }
  }
  function saveWidget() {
    widgetGrid.gridView.commit(true);

    let changes = [];
    changes = changes.concat(
      widgetGrid.dataProvider.getAllStateRows().created,
      widgetGrid.dataProvider.getAllStateRows().updated,
      widgetGrid.dataProvider.getAllStateRows().deleted
    );
    if (changes.length === 0) {
      showMessage(transLangKey('WARNING'), transLangKey('MSG_5039'), { close: false }, function (answer) {
      });
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let err = "";
          changes.forEach(function (row) {
            let changeRow = widgetGrid.dataProvider.getJsonRow(row);
            if (!changeRow.id || changeRow.id.length === 0) err = "1";
            if (!changeRow.path || changeRow.path.length === 0) err = "2";
            if (!changeRow.seq || changeRow.seq.length === 0) err = "3";
            if (!changeRow.insertFlag || changeRow.insertFlag !== "R" && changeRow.parentId.length === 0) err = "4";
          });

          widgetGrid.dataProvider.getAllStateRows().created.forEach(function (row) {
            let changeRow = widgetGrid.dataProvider.getJsonRow(row);
            if (changeRow.insertFlag !== "S" && widgetGrid.dataProvider.getChildren(row) === null) {
              err = "5";
            }
          });

          let changeRowData = [];
          changes.forEach(function (row) {
            let changeRow = widgetGrid.dataProvider.getJsonRow(row);
            if (changeRow.insertFlag === "S") {
              changeRow.path = getAllPath(row, changeRow.path);
              changeRow.type = null;
              changeRowData.push(changeRow);
            } else {
              if (widgetGrid.dataProvider.getRowState(row) !== "created") {
                setAllPath(row, changeRow.path, widgetGrid.dataProvider.getLevel(row));
              }
              changeRow.path = null;
              changeRow.type = null;
              changeRowData.push(changeRow);
            }
          });

          function getAllPath(row, path) {
            let allPath = "/" + path;
            if (widgetGrid.dataProvider.getParent(row) !== -1) {
              let middlePath = (!widgetGrid.dataProvider.getJsonRow(widgetGrid.dataProvider.getParent(row)).path) ? "" : widgetGrid.dataProvider.getJsonRow(widgetGrid.dataProvider.getParent(row)).path;
              let updatePath = middlePath + allPath;
              return getAllPath(widgetGrid.dataProvider.getParent(row), updatePath);
            } else {
              return allPath
            }
          }

          function setAllPath(row, path, level) {
            let type = widgetGrid.dataProvider.getChildren(row) ? true : false
            if (type) {
              widgetGrid.dataProvider.getChildren(row).forEach(function (childRow) {
                setAllPath(childRow, path);
              });
            } else {
              let changeRow = widgetGrid.dataProvider.getJsonRow(row);
              let allPath = getAllPath(row, changeRow.path);
              allPath.split("/")[level] = path;
              changeRow.path = allPath;
              changeRowData.push(changeRow);
            }
          }

          zAxios({
            method: 'post',
            headers: getHeaders(),
            url: 'system/widgets',
            data: changeRowData
          })
            .then(function (response) {
              if (response.status === HTTP_STATUS.SUCCESS) {
                widgetGrid.dataProvider.clearRows();
                loadData();
              }
            })
            .catch(function (err) {
              console.log(err);
            });
        }
      });
    }
  }
  function checkNode(grid, dataRow, checked) {
    let dataProvider = grid.getDataSource();

    checkSiblingNode(grid, dataRow, checked);

    let desRows = dataProvider.getDescendants(dataRow);
    if (desRows) {
      grid.checkRows(desRows, checked, false);
    }
  };
  function checkSiblingNode(grid, dataRow, checked) {
    let dataProvider = grid.getDataSource();
    let parent = dataProvider.getParent(dataRow);
    let sibling = parent == -1 ? dataProvider.getChildren() : dataProvider.getChildren(parent);
    let index = sibling.indexOf(dataRow);

    if (index !== -1) {
      sibling.splice(index, 1);
    }

    if (checked) {
      sibling.forEach(function (i) {
        let value = grid.isCheckedRow(i);
        if (checked != value) {
          checked = false;
        }
      });
    } else {
      checked = false;
    }

    if (parent > -1) grid.checkRow(parent, checked, false, false);
    if (parent == -1) grid.setAllCheck(checked, false);
    if (parent > -1) {
      checkSiblingNode(grid, parent, checked);
    }
  }

  function cameCaseToHyphen(value) {
    return value.replace(/(?:^|\.?)([A-Z+0-9])/g, function (x, y) { return "-" + y.toLowerCase() }).replace(/^-/, "")
  }
  return (
    <>
      <ContentInner>
        <ButtonArea>
          <LeftButtonArea></LeftButtonArea>
          <RightButtonArea>
            <ButtonGroup variant="outlined">
              <GridAddRowButton onClick={() => { insertWidget() }}></GridAddRowButton>
              <GridDeleteRowButton onClick={() => { deleteWidget() }}></GridDeleteRowButton>
              <GridSaveButton title={transLangKey("SAVE")} onClick={() => { saveWidget() }}></GridSaveButton>
            </ButtonGroup>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea sizes={[100]} direction={"vertical"}>
          <TreeGrid id="widgetGrid"></TreeGrid>
        </ResultArea>
      </ContentInner>
      <IconPicker open={dialogOpen} onClose={() => setDialogOpen(false)} confirm={setIcon}></IconPicker>
    </>
  );
}

export default WidgetMgmt
