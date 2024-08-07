import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { useViewStore, TreeGrid, zAxios } from "@wingui/common/imports";
import { useMenuStore } from "@zionex/wingui-core/store/contentStore";

const Bookmark = forwardRef((props, ref) => {
  const activeViewId = getActiveViewId()
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])
  const [bookmarks, addBookMark, deleteBookMark] = useMenuStore(state => [state.bookmarks, state.addBookMark, state.deleteBookMark])
  const [bookMarkGrid, setBookMarkGrid] = useState(null);
  const { control } = useForm({
    defaultValues: {
    }
  });

  useImperativeHandle(ref, () => ({
    doRefresh() {
      bookMarkGrid.gridView.resetSize();
    },
  }));
  // 그리드 Object 초기화
  useEffect(() => {
    setBookMarkGrid(getViewInfo(activeViewId, 'bookMarkGrid'))
  }, [viewData])
  useEffect(() => {
    if (bookMarkGrid) {
      setGridFieldAndColumn(bookMarkGrid.dataProvider, bookMarkGrid.gridView);
      loadData();
    }
  }, [bookMarkGrid])
  useEffect(() => {
    if (bookmarks && bookMarkGrid) {
      loadData();
    }
  }, [bookmarks])
  function loadData() {
    bookMarkGrid.gridView.showToast({ message: 'Loading...' }, true);

    zAxios.get('system/menus', { waitOn: false })
      .then(function (res) {
        let responseData = { "items": res.data };
        bookMarkGrid.dataProvider.setObjectRows(responseData, "items", "", "");
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        bookMarkGrid.gridView.hideToast()
      });
  }
  function setGridFieldAndColumn(dataProvider, gridView) {
    dataProvider.setOptions({ restoreMode: "auto" });
    bookMarkGrid.gridView.setFooters({ visible: false });
    bookMarkGrid.gridView.setStateBar({ visible: false });
    bookMarkGrid.gridView.setCheckBar({ visible: false });
    bookMarkGrid.gridView.setDisplayOptions({
      fitStyle: "evenFill",
      showChangeMarker: false,
      useFocusClass: true
    });

    dataProvider.setFields([
      { fieldName: "id" },
      { fieldName: "seq", dataType: "number" },
      { fieldName: "bookmarked", dataType: "boolean" },
      { fieldName: "filePath" },
      { fieldName: "path" },
    ]);

    bookMarkGrid.gridView.setColumns([
      {
        name: "id", fieldName: "id",
        header: { text: transLangKey("MENU_ID") },
        editable: false, width: 100,
        displayCallback: function (grid, index, value) {
          return transLangKey(value);
        }
      },
      {
        name: "seq", fieldName: "seq",
        header: { text: transLangKey("seq") },
        editable: false, visible: false
      },
      {
        name: "bookmarked", fieldName: "bookmarked",
        header: { text: transLangKey("BOOKMARK") },
        editable: false, width: 100,
        styleName: 'editable-column',
        renderer: {
          type: "check",
          editable: true
        }
      }
    ]);

    bookMarkGrid.gridView.onCellDblClicked = function (grid, clickData) {
      bookMarkGrid.gridView.expand(clickData.itemIndex, true, true);
    }

    bookMarkGrid.gridView.onCellEdited = function (grid, itemIndex, row, field) {
      grid.commit();
      if (field === 2) {
        let calSeq = 0;
        grid.expand(itemIndex, true, true, 0);
        let useYn = grid.getValue(itemIndex, "bookmarked");

        checkSibling(grid, row, useYn);
        checkChildren(grid, row, useYn);

        function checkChildren(grid, row, useYn) {
          let desRows = dataProvider.getDescendants(row);
          if (desRows) {
            desRows.forEach(function (row) {
              dataProvider.setValue(row, "bookmarked", useYn);
            })
          }
        }
        dataProvider.setValue(row, "seq", calSeq);
        function checkSibling(grid, row, useYn) {
          let seq = dataProvider.getValue(row, "seq");
          calSeq = calSeq + seq
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
              let value = dataProvider.getValue(i, "bookmarked");
              if (useYn != value) {
                useYn = true;
              }
            });
          }

          if (parent > -1) {
            dataProvider.setValue(parent, "bookmarked", useYn);
            checkSibling(grid, parent, useYn);
          }
        }
      }
    }
  }
  const saveBookmark = () => {
    bookMarkGrid.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(
          bookMarkGrid.dataProvider.getAllStateRows().created,
          bookMarkGrid.dataProvider.getAllStateRows().updated,
          bookMarkGrid.dataProvider.getAllStateRows().deleted,
          bookMarkGrid.dataProvider.getAllStateRows().createAndDeleted
        );

        let changeRowData = [];
        let bookmarkRows = [];
        let delbookmarkRows = [];
        changes.forEach(function (row) {
          let brow = bookMarkGrid.dataProvider.getJsonRow(row);
          if (brow.filePath !== null && brow.filePath !== "") {
            if (brow.bookmarked) {
              bookmarkRows.push(brow)
            } else {
              delbookmarkRows.push(brow)
            }
          }
          changeRowData.push(bookMarkGrid.dataProvider.getJsonRow(row));
        });
        addBookMark(bookmarkRows)
        deleteBookMark(delbookmarkRows)
        if (!changeRowData.length) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'));
        } else {
          bookMarkGrid.gridView.showToast(progressSpinner + 'Saving data...', true);
          zAxios({
            method: 'post',
            headers: { 'content-type': 'application/json' },
            url: 'system/menus/bookmarks',
            data: changeRowData
          }).then(function (response) {
          }).catch(function (err) {
            console.log(err);
          }).then(function () {
            bookMarkGrid.gridView.hideToast();
            loadData();
          });
        }
      }
    })
  }
  return (
    <form style={{ height: 'calc(100vh - 240px)' }} >
      <div className="mb-3" style={{ height: '93%' }}>
        <TreeGrid id="bookMarkGrid"></TreeGrid>
      </div>
      <button type="button" className="btn btn-primary" onClick={saveBookmark} >{transLangKey('SAVE')}</button>
    </form>
  )
});

export default Bookmark;