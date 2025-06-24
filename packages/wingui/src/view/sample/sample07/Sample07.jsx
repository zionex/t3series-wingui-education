import React, { useState, useEffect, useRef } from "react";
import { Box, Icon, Tab, Tabs, Breadcrumbs, TextField } from '@mui/material';
import DashboardPanel from "@zionex/wingui-core/component/dashboard/DashboardPanel";
import {
  ContentInner, SearchArea, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, WorkArea,
  InputField, BaseGrid, CommonButton, GridAddRowButton, GridDeleteRowButton, GridSaveButton, useViewStore, useContentStore, zAxios
} from "@wingui/common/imports";

// 12 * 48? 
function Sample07() {
  const activeViewId = getActiveViewId();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [
    state.viewData,
    state.getViewInfo,
    state.setViewInfo,
  ]);

  // globalButtons
  const globalButtons = [
    { name: "help", docUrl: '/edu/chapter3/Dashboard.html', visible: true, disable: false }
  ];

  useEffect(() => {
    setViewInfo(activeViewId, "globalButtons", globalButtons);
  }, []);

  function makeWidgetPanel() {
    let widgets = [
      {
        "key": "1",
        "title": "TITEL01",
        "widgetId": "WI_SAMPLE_01",
        "data-grid":{"w":2,"h":44, "x":0,"y":0},
        "showTitleBar": false,
      },
      {
        "key": "2",
        "title": "TITEL02",
        "widgetId": "WI_SAMPLE_01",
        "data-grid":{"w":10,"h":10,"x":3,"y":0},
        "showTitleBar": true,
        "info": "위젯 설명",
      },
      {
        "key": "3",
        "title": "TITEL03",
        "widgetId": "WI_SAMPLE_01",
        "data-grid":{"w":10,"h":10,"x":3,"y":10},
        "showTitleBar": true,
        "info": "위젯 설명",
      },
      {
        "key": "4",
        "title": "TITEL04",
        "widgetId": "WI_SAMPLE_01",
        "data-grid":{"w":5,"h":24,"x":2,"y":20},
        "showTitleBar": true,
        "info": "위젯 설명",
      },
      {
        "key": "5",
        "title": "TITEL05",
        "widgetId": "WI_SAMPLE_01",
        "data-grid":{"w":5,"h":24,"x": 9,"y":20},
        "showTitleBar": true,
        "info": "위젯 설명",
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
        actionBar={true}
        fitHeight={true}
        isResizable={true}
        isDraggable={true}
        title={""}
        widgets={makeWidgetPanel()}
        OnGetWidgets={OnGetWidgets}
      />
    </ContentInner>
  );
}

export default Sample07
