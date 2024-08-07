import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DashboardPanel from "@zionex/wingui-core/component/dashboard/DashboardPanel";
import { transLangKey } from "@wingui";

import { ContentInner } from "@wingui/common/imports";

function DashboardTool(props)  {

  /**
   * Widget property
   * key: key 값
   * title: 제목
   * widgetId: 위젯 ID
   * data-grid: layout정보
   * widgetOptions: widget component에 전달될 props
   * @returns Widget 구성 정보
   */
  function makeWidgetPanel() {
  let widgets = [
    {
      key: "1", 
      title: "Issue", 
      widgetId: "ISSUE_WIDGET", 
      "data-grid":{"w":6,"h":4,"x":0,"y":0},
      linkUrl : "/util/issuemgmt"
    },
    {
      "key": "2", 
      "title": "Notice", 
      "widgetId": "NOTICE_WIDGET", 
      "data-grid":{"w":6,"h":4,"x":6,"y":0},
      "linkUrl": "/util/noticeboard"
    },
    {
      "key": "3", 
      "title": "메모장", 
      "widgetId": "KEEP_WIDGET", 
      "data-grid":{"w":6,"h":4,"x":0,"y":6},
    },
  ];
  return widgets;
}

const OnGetWidgets = (widgetConfig) => {
  return widgetConfig;
};

return (
  <ContentInner>
    <DashboardPanel id={"DashboardTool_Board1"} fitHeight={false} otherLoodable={true} actionBar={true} option={{store: 'DB', closeBtn:true, widgetConfigVisible: true}} isResizable={true} isDraggable={true} widgets={makeWidgetPanel()} OnGetWidgets={OnGetWidgets}></DashboardPanel>
  </ContentInner>
);

}

export default DashboardTool;