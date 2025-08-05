import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box, Icon, Tab, Tabs, Breadcrumbs, TextField, Slider } from "@mui/material";
import WidgetContent from "@zionex/wingui-core/component/dashboard/WidgetContent";
import ChartComponent from "@zionex/wingui-core/component/chart/ChartComponent";
import moment from "moment";
import { fontSize } from "@mui/system";
import { zAxios } from "@wingui/common/imports";
import { themeStoreApi } from "@zionex/wingui-core/store/themeStore";

function DashboardWidget02(props) {
  const chart = useRef(null);
  const [data, setData] = useState({
    datasets: [],
  });
  const themeStore = themeStoreApi().themeData;

  const [option, setOption] = useState({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      display: true,
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {},
      y: {
        position: "left",
        min: 0,
      },
      y2: {
        position: "right",
        grid: {
          display: false,
        },
        min: 0,
        ticks: {
          stepSize: 20,
          callback: function (value, index, ticks) {
            return value + "%";
          },
        },
      },
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    let labels =  ['Team 1', 'Team 2', ' Team 3', 'Team 4', 'Team 5', 'Team 6', 'Team 7', '합계'];
    let data1 = [17834.497, 632919.132, 4452707.091, 620893.914, 927166.153, 3583300.983, 52589.37, 10287411.139999999];
    let data2 = [35536, 38558, 42107, 43921, 43403, 44145, 42196, 289866];
    let data3 = [50, 1641, 10575, 1414, 2136, 8117, 125, 3436.8571428571427];
    setData({
      labels: labels,
      datasets: [
        {
          type: "bar",
          label: transLangKey("TOT_PREDICT_REVENUE"),
          data: data1,
          backgroundColor: themeStore.palette.color.blueE,
          borderColor: themeStore.palette.color.blueE,
          borderWidth: 1,
          pointStyle: "rect",
          datalabels: {
            display: false,
          },
          yAxisID: "y",
          order: 1,
        },
        {
          type: "bar",
          label: transLangKey("SUM_REVENUE"),
          data: data2,
          backgroundColor: themeStore.palette.color.yellowI,
          borderColor: themeStore.palette.color.yellowI,
          borderWidth: 1,
          pointStyle: "rect",
          datalabels: {
            display: false,
          },
          yAxisID: "y",
          order: 2,
        },
        {
          type: "line",
          label: transLangKey("PROGRESS_RATE"),
          backgroundColor: themeStore.palette.color.greenG,
          borderColor: themeStore.palette.color.greenG,
          data: data3,
          borderWidth: 1,
          pointStyle: "circle",
          datalabels: {
            display: false,
          },
          yAxisID: "y2",
          order: 3,
        },
      ],
    });
  };

  return (
    <WidgetContent>
      <Box style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
        <ChartComponent options={option} dataset={data} ref={chart} config={false}></ChartComponent>
      </Box>
    </WidgetContent>
  );
}

export default DashboardWidget02;
