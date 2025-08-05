import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DashboardPanel from "@zionex/wingui-core/component/dashboard/DashboardPanel";
import { transLangKey } from "@wingui";
import { ContentInner } from "@wingui/common/imports";
import { useMenuStore } from "@zionex/wingui-core/store/contentStore";


function Chart01() {
  const { control, getValues, setValue, watch } = useForm({
    defaultValues: {},
  });
  const [getViewPath] = useMenuStore((state) => [state.getViewPath]);

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
      { "key": "1", "title": transLangKey("WI_SNOP_DASHBOARD_WIDGET01"), "widgetId": "WI_SNOP_DASHBOARD_WIDGET19",
        "data-grid": { "w": 4, "h": 1, "x": 0, "y": 0, "i": "1" }
      },
      { "key": "2", "title": transLangKey("WI_SNOP_DASHBOARD_WIDGET02"), "widgetId": "WI_SNOP_DASHBOARD_WIDGET02",
        "data-grid": { "w": 4, "h": 1, "x": 4, "y": 0, "i": "2" }
      },
      { "key": "3", "title": transLangKey("WI_SNOP_DASHBOARD_WIDGET03"), "widgetId": "WI_SNOP_DASHBOARD_WIDGET03",
        "data-grid": { "w": 4, "h": 1, "x": 8, "y": 0, "i": "3" }
      },
      { "key": "4", "title": transLangKey("WI_SNOP_DASHBOARD_WIDGET04"), "widgetId": "WI_SNOP_DASHBOARD_WIDGET04",
        "data-grid": { "w": 4, "h": 1, "x": 0, "y": 1, "i": "4" }
      },
      { "key": "5", "title": transLangKey("WI_SNOP_DASHBOARD_WIDGET05"), "widgetId": "WI_SNOP_DASHBOARD_WIDGET05",
        "data-grid": { "w": 4, "h": 1, "x": 4, "y": 1, "i": "5" }
      },
      { "key": "6", "title": transLangKey("WI_SNOP_DASHBOARD_WIDGET06"), "widgetId": "WI_SNOP_DASHBOARD_WIDGET06",
        "data-grid": { "w": 4, "h": 1, "x": 8, "y": 1, "i": "6" }
      },
      { "key": "7", "title": transLangKey("WI_SNOP_DASHBOARD_WIDGET07"), "widgetId": "WI_SNOP_DASHBOARD_WIDGET07",
        "data-grid": { "w": 4, "h": 1, "x": 0, "y": 2, "i": "7" }
      },
      { "key": "8", "title": transLangKey("WI_SNOP_DASHBOARD_WIDGET08"), "widgetId": "WI_SNOP_DASHBOARD_WIDGET08",
        "data-grid": { "w": 4, "h": 1, "x": 4, "y": 2, "i": "8" }
      },
      { "key": "9", "title": transLangKey("WI_SNOP_DASHBOARD_WIDGET09"), "widgetId": "WI_SNOP_DASHBOARD_WIDGET09",
        "data-grid": { "w": 4, "h": 1, "x": 8, "y": 2, "i": "9" }
      }
    ];
    return widgets;
  }

  const OnGetWidgets = (widgetConfig) => {
    return widgetConfig;
  };

  return (
    <ContentInner>
      <DashboardPanel id={"Chart01"} fitHeight={true}  widgets={makeWidgetPanel()} OnGetWidgets={OnGetWidgets}></DashboardPanel>
    </ContentInner>
  );
}

export default Chart01;
