import React, { useState, useEffect, useRef } from "react";
import { Box, Icon, Tab, Tabs, Breadcrumbs, TextField } from '@mui/material';
import DashboardPanel from "@zionex/wingui-core/component/dashboard/DashboardPanel";
import {
  ContentInner, SearchArea, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, WorkArea,
  InputField, BaseGrid, CommonButton, GridAddRowButton, GridDeleteRowButton, GridSaveButton, useViewStore, useContentStore, zAxios
} from "@wingui/common/imports";

// 12 * 48? 
function Sample07() {
  function makeWidgetPanel() {
    let widgets = [
      {
        "key": "1",
        "title": transLangKey("TITEL01"),
        "widgetId": "WI_SAMPLE_01",
        "data-grid":{"w":2,"h":44, "x":0,"y":0},
        "showTitleBar": false,
      },
      {
        "key": "2",
        "title": transLangKey("TITEL02"),
        "widgetId": "WI_SAMPLE_01",
        "data-grid":{"w":10,"h":10,"x":3,"y":0},
        "showTitleBar": true,
      },
      {
        "key": "3",
        "title": transLangKey("TITEL03"),
        "widgetId": "WI_SAMPLE_01",
        "data-grid":{"w":10,"h":10,"x":3,"y":10},
        "showTitleBar": true,
      },
      {
        "key": "4",
        "title": transLangKey("TITEL04"),
        "widgetId": "WI_SAMPLE_01",
        "data-grid":{"w":5,"h":24,"x":2,"y":20},
        "showTitleBar": true,
      },
      {
        "key": "5",
        "title": transLangKey("TITEL05"),
        "widgetId": "WI_SAMPLE_01",
        "data-grid":{"w":5,"h":24,"x": 9,"y":20},
        "showTitleBar": true,
      },
    ];
    return widgets;
  }

  const OnGetWidgets = (widgetConfig) => {
    return widgetConfig;
  };
  return (
    <ContentInner>
      <DashboardPanel
        actionBar={false}
        fitHeight={false}
        isResizable={false}
        isDraggable={false}
        title={""}
        option={{ store: "PMG" }} 
        id={"Executive_Dashboard"}
        widgets={makeWidgetPanel()}
        OnGetWidgets={OnGetWidgets}
      />
    </ContentInner>
  );
}

export default Sample07
