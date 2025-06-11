import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { BaseGrid } from '@wingui/common/imports';
import { useViewStore, useContentStore, useUserStore } from "@wingui/common/imports";
import { zAxios } from "@wingui/common/imports";
import { Box } from "@mui/material";

let permsGridItems = [
  { name: "menuCd", dataType: "text", headerText: "MENU_CD", editable: false, width: 100 },
  { name: "menuNm", headerText: "MENU_NM", dataType: "text", editable: false, width: 100 },
  { name: "PERMISSION_TYPE_READ", headerText: "READ", dataType: "boolean", editable: false, width: 100 },
  { name: "PERMISSION_TYPE_UPDATE", headerText: "UPDATE", dataType: "boolean", editable: false, width: 100 },
  { name: "PERMISSION_TYPE_DELETE", headerText: "DELETE", dataType: "boolean", editable: false, width: 100 }
]

const Permissions = forwardRef((props, ref) => {
  const activeViewId = getActiveViewId()
  const [username] = useUserStore(state => [state.username])
  const [perGrid, setPerGrid] = useState(null);
  let filter = [];

  useImperativeHandle(ref, () => ({
    doRefresh() {
      perGrid.gridView.resetSize();
    }
  }));
  useEffect(() => {
    if (perGrid) {
      setOptions()
      loadData()
    }
  }, [perGrid])
  function setOptions() {
    perGrid.dataProvider.setOptions({ restoreMode: "auto" });
    perGrid.gridView.setStateBar({ visible: false });
    perGrid.gridView.setCheckBar({ visible: false });
    perGrid.gridView.setFooters({ visible: false });
    perGrid.gridView.setDisplayOptions({
      fitStyle: "evenFill",
      showChangeMarker: false,
      useFocusClass: true
    });
    perGrid.gridView.setEditOptions({
      insertable: false,
      appendable: false
    });

  }
  function loadData() {
    perGrid.gridView.showToast({ message: 'Loading...' }, true);

    zAxios.get('system/user/permissions/union', {
      params: {
        'username': username
      },
      waitOn: false
    })
      .then(function (res) {
        res.data.forEach(function (data) {
          data.menuNm = transLangKey(data.menuCd);
          filter.push({ name: data.menuCd, criteria: "values['menuCd']='" + data.menuCd + "'", text: data.menuNm });
        });
        perGrid.dataProvider.fillJsonData(res.data);
        perGrid.gridView.addColumnFilters("menuNm", filter, true);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        perGrid.gridView.hideToast();
      });
  }
  const afterGridCreate = (gridObj, gridView, dataProvider) => {
    setPerGrid(gridObj)
  };
  return (
    <Box style={{ height: 'calc(100vh - 138px)' }} >
      <BaseGrid id="perGrid" items={permsGridItems} afterGridCreate={afterGridCreate} ></BaseGrid>
    </Box>
  )
});

export default Permissions;