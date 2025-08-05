import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box, Icon, Tab, Tabs, Breadcrumbs, TextField, Slider } from "@mui/material";
import WidgetContent from "@zionex/wingui-core/component/dashboard/WidgetContent";
import ChartComponent from "@zionex/wingui-core/component/chart/ChartComponent";
import WidgetButton from "@zionex/wingui-core/component/chart/WidgetButton";
import moment from "moment";
import { ButtonArea, RightButtonArea } from "@wingui/common/imports";
import { fontSize } from "@mui/system";
import { zAxios } from "@wingui/common/imports";
import { themeStoreApi } from "@zionex/wingui-core/store/themeStore";

// let columnData1 = [
//   { CATEGORY1: "G1", CATEGORY2: "Web", VALUE1: 25, VALUE2: 11 },
//   { CATEGORY1: "G2", CATEGORY2: "Retail", VALUE1: 19, VALUE2: 27 },
//   { CATEGORY1: "G3", CATEGORY2: "Distribution", VALUE1: 35, VALUE2: 21 },
//   { CATEGORY1: "G4", CATEGORY2: "Direct", VALUE1: 21, VALUE2: 41 },
// ];

// let columnData2 = [
//   { CATEGORY1: "G1", CATEGORY2: "Ballpoint Pen", VALUE1: 18, VALUE2: 30 },
//   { CATEGORY1: "G2", CATEGORY2: "Ink Pen", VALUE1: 37, VALUE2: 18 },
//   { CATEGORY1: "G3", CATEGORY2: "Felt", VALUE1: 21, VALUE2: 27 },
//   { CATEGORY1: "G4", CATEGORY2: "Pencil", VALUE1: 24, VALUE2: 25 },
// ];

// const colors = ["#57a2d4", "#82bfe8", "#a8d3ef", "#cce5f6", "#92c8c7", "#a0cfce", "#bbdddc", "#d6eaea", "#ffb74d", "#ab47bc", "#64b5f6", "#aed581", "#a1887f", "#90a4ae", "#ffd54f", "#4db6ac", "#81c784", "#fff176", "#f48fb1", "#b39ddb", "#dce775", "#ff1744", "#7986cb", "#4fc3f7"];

function DashboardWidget03(props) {
  const chart1 = useRef(null);
  const chart2 = useRef(null);
  const themeStore = themeStoreApi().themeData;
  const colors = [themeStore.palette.color.blueE, themeStore.palette.color.blueD, themeStore.palette.color.blueC, themeStore.palette.color.blueB, themeStore.palette.color.greenD, themeStore.palette.color.greenC, themeStore.palette.color.greenB, themeStore.palette.color.greenA];

  const [groupData, setGroupData] = useState([]);

  const [chartData1, setChartData1] = useState({
    datasets: [],
  });
  const [chartData2, setChartData2] = useState({
    datasets: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const [option1, setOption1] = useState({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      display: true,
      legend: {
        display: false,
        position: "bottom",
      },
      title: {
        // 그래프 최상단 타이틀
        display: true,
        text: transLangKey("WI_DIST_ITEM_GRP"),
        align: "center",
        font: {
          size: 15,
          family: "tahoma",
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
  });
  const [option2, setOption2] = useState({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      display: true,
      legend: {
        display: false,
        position: "bottom",
      },
      title: {
        // 그래프 최상단 타이틀
        display: true,
        text: transLangKey("WI_DIST_SALES_GRP"),
        align: "center",
        font: {
          size: 15,
          family: "tahoma",
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
  });

  const loadData = () => {
    let labels1 = ['Item Group 5', 'Item Group 4', 'Item Group 3', 'Item Group 2', 'Item Group 6', 'Item Group 1'];
    let labels2= ['Asia Sales Team', 'Online Sales Team', 'America Sales Team', 'Sales Team 2', 'Sales Team 1', 'Europe Sales Team', 'Sales Team 3'];
    let data1 = [13.1, 18.7, 14.9, 22, 17.8, 13.4];
    let data2 = [17, 13.2, 15.6, 9.9, 12.4, 17, 14.8];

    setChartData1({
      labels: labels1,
      datasets: [
        {
          type: "doughnut",
          data: data1,
          backgroundColor: colors,
          datalabels: {
            color: "#000",
            formatter: function (value, context) {
              return value == null ? 0 : value.toString() + "%";
            },
            font: {
              // weight: "bold",
            },
          },
        },
      ],
    });

    setChartData2({
      labels: labels2,
      datasets: [
        {
          type: "doughnut",
          data: data2,
          backgroundColor: colors,
          datalabels: {
            color: "#000",
            formatter: function (value, context) {
              return value == null ? 0 : value.toString() + "%";
            },
            font: {
              // weight: "bold",
            },
          },
        },
      ],
    });
  };

  return (
    <WidgetContent>
      <Box style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
        <ButtonArea>
          <RightButtonArea>
          </RightButtonArea>
        </ButtonArea>
        <Box style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", height: 'calc(100% - 30px)', flex: 1 }}>
          <ChartComponent type="doughnut" options={option1} dataset={chartData1} ref={chart1} config={false}></ChartComponent>
          <ChartComponent type="doughnut" options={option2} dataset={chartData2} ref={chart2} config={false}></ChartComponent>
        </Box>
      </Box>
    </WidgetContent>
  );
}

export default DashboardWidget03;
