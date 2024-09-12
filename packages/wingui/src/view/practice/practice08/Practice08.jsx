import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { ContentInner, ViewPath, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridExcelExportButton, GridExcelImportButton,
  GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, PopupDialog, GridCnt, useViewStore, useContentStore, useStyles, zAxios, useUserStore, WorkArea
} from "@wingui/common/imports";
import ChartComponent from "@zionex/wingui-core/component/chart/ChartComponent";

//Chart 예제
function Practice08() {
  const activeViewId = getActiveViewId();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [
    state.viewData,
    state.getViewInfo,
    state.setViewInfo,
  ]);

  // default
  const { control, getValues, setValue, watch, reset } = useForm({
    defaultValues: {
      startDt: new Date(),
    },
  });

  // chart
  const chart1 = useRef(null);
  const [chartData1, setChartData1] = useState({ datasets: [] });
  const [chartOption1, setChartOption1] = useState();

   // globalButtons
  const globalButtons = [
    { name: "help", docUrl: '/edu/chapter4/LookupTree.html', visible: true, disable: false },
    { name: 'search', action: (e) => { loadData() }, visible: true, disable: false },
    { name: "refresh", action: (e) => { refresh() }, visible: true, disable: false },
  ];

  useEffect(() => {
    setViewInfo(activeViewId, "globalButtons", globalButtons);

    setChartOption1({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        display: true,
        legend: {
          display: false,
          position: "bottom",
          labels: {
            usePointStyle: true,
          },
        },
        datalabels: {
          display: false
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
        },
        y: {
          position: "left",
          stacked: true,
          grid: {
            display: true,
          },
          ticks: {
            callback: function (value, index, ticks) {
              const newValue = new Intl.NumberFormat().format(value);
              return  'A' + newValue;
            }
          },
        },
      },
    });
    
    loadData();
  }, []);


  const loadData = () => {
    setChartData1({
      labels: ['01월','02월','03월','04월','05월','06월','07월','08월'],
      datasets: [
        {
          type: "line",
          label: transLangKey("ANNUAL_PLAN"),
          fill: false,
          data: [1148, 1044, 1099, 982, 1170, 973, 787, 1124],
          elements: {
            point: { radius: 6, borderWidth: 0 },
          },
          backgroundColor: "#4285f4",
          borderColor: "#4285f4",
        },
        {
          type: "bar",
          label: transLangKey("DEMAND_PLAN"),
          data: [430, 521, 341, 349, 451, 498, 336, 409],
          backgroundColor: "rgba(251, 188, 4, 0.7)",
        },
        {
          type: "bar",
          label: "Gap",
          data: [719, 522, 758, 632, 718, 474, 450, 714],
          backgroundColor: "rgba(244, 149, 149, 0.7)",
          legend: {
            labels: {
              boxWidth: 0,
              pointStyle: "none",
              usePointStyle: false,
            },
          },
        },
      ],
    });
  };


  return (
    <ContentInner>
      <SearchArea>
        <InputField type="datetime" name="startDt" control={control} label={transLangKey('START_DT')} dateformat="yyyy-MM-dd"/>
      </SearchArea>
      <WorkArea>
        <ButtonArea>
          <LeftButtonArea>
          </LeftButtonArea>
          <RightButtonArea>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <Box style={{ height: "100%" }}>
            <ChartComponent
              options={chartOption1}
              dataset={chartData1}
              ref={chart1}
              config={false}
              plugins={[]}
            ></ChartComponent>
          </Box>
        </ResultArea>
      </WorkArea>
    </ContentInner>
  );
}

export default Practice08;