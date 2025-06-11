import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import { ContentInner, CommonButton, WorkArea, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, BaseGrid, useViewStore, useContentStore, zAxios } from "@wingui/common/imports";

let servGridItems = [
  { name: "id", headerText: "SERVER_ID", dataType: "text", width: "100", editable: false, visible: true },
  { name: "host", headerText: "SERVER_IP", dataType: "text", width: "100", editable: false, visible: true },
  { name: "port", headerText: "SERVER_PORT", dataType: "text", width: "100", editable: false, visible: true },
  { name: "connection", headerText: "SERVER_CONN", dataType: "text", width: "100", editable: false, visible: true },
];

function ServerStatus() {
  const [servGrid, setservGrid] = useState(null);
  const activeViewId = getActiveViewId()
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const {
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  const globalButtons = [
    {
      name: "search",
      action: (e) => {
        loadData();
      },
      visible: true,
      disable: false,
    },
  ];

  useEffect(() => {
    setservGrid(getViewInfo(activeViewId, "servGrid"));
  }, [viewData]);

  useEffect(() => {
    if (servGrid) {
      setViewInfo(activeViewId, "globalButtons", globalButtons);
      setOption();

      loadData();
    }
  }, [servGrid]);

  function setOption() {
    servGrid.gridView.onCellEdited = function (grid) {
      grid.commit(true);
    };
  }
  function loadData() {
    servGrid.gridView.commit(true);

    servGrid.gridView.showToast(progressSpinner + "Load Data...", true);

    zAxios
      .get("engine/REGISTRY/GetServerStatus", { waitOn: false })
      .then(function (res) {
        servGrid.dataProvider.fillJsonData(res.data[RESULT_DATA]);
      }).catch(function (err) {
        console.log(err);
      }).then(function () {
        servGrid.gridView.hideToast();
      });
  }

  const readConfiguration = (name, targetServer) => {
    zAxios({
      method: "post",
      url: "engine/" + targetServer + "/ReadConfiguration",
      headers: { "content-type": "application/json" },
      params: {
        timeout: 0,
      },
    }).then(function (res) {
      if (res.data.RESULT_SUCCESS) {
        showMessage(transLangKey("MSG_CONFIRM"), name + " Configuration Reload Success", { close: false });
      } else {
        showMessage(transLangKey("WARNING"), name + " Configuration Reload Fail", { close: false });
      }
    }).catch(function (err) {
      console.log(err);
    }).then(function () { });
  };

  return (
    <ContentInner>
      <WorkArea>
        <ButtonArea>
          <LeftButtonArea>
            <ButtonGroup variant="outlined">
              <CommonButton type="text" title={transLangKey("Reload DP")} startIcon={<SyncIcon />} onClick={() => { readConfiguration("Data server", "dp"); }}></CommonButton>
              <CommonButton type="text" title={transLangKey("Reload MP")} startIcon={<SyncIcon />} onClick={() => { readConfiguration("MP server", "mp"); }}></CommonButton>
            </ButtonGroup>
          </LeftButtonArea>
          <RightButtonArea></RightButtonArea>
        </ButtonArea>
        <ResultArea sizes={[100]} direction={"vertical"}>
          <BaseGrid id="servGrid" items={servGridItems}></BaseGrid>
        </ResultArea>
      </WorkArea>
    </ContentInner>
  );
}

export default ServerStatus;
