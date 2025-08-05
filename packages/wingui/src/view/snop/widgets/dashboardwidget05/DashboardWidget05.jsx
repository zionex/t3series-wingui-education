import React, { useState, useEffect, useRef, useMemo } from "react";
import { Box, Icon, Tab, Tabs, Breadcrumbs, TextField, Slider, Typography } from '@mui/material';
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent'
import ChartComponent from '@zionex/wingui-core/component/chart/ChartComponent'
import WidgetButton from "@zionex/wingui-core/component/chart/WidgetButton";
import { ButtonArea, LeftButtonArea, RightButtonArea, zAxios } from "@wingui/common/imports";
import { isDeepEqual, useContentId } from "@zionex/wingui-core/utils/common";
import { getThemeStore } from "@zionex/wingui-core/store/themeStore";

function DashboardWidget05(props) {
  const chart = useRef(null);
  const themeStore = getThemeStore('themeData');
  const classes = useWidgetStyle();
  const contentId = useContentId();
  const [onQA, setOnQA] = useState("AMT");
  const [dbData, setLoadData] = useState([]);
  const [data, setData] = useState({
    datasets: [
    ],
  });

  const summaryRef = useRef({
    plan: 0,
    actual: 0,
    rate: 0
  });
  const [option, setOption] = useState({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      display: true,
      legend: {
        display: true,
        position: "right",
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
      y1: {
        position: 'right',   // or 'left' if you want it on the left side
        grid: { drawOnChartArea: false },
        min: 0,
        ticks: {
          callback: (val) => `${val}%`
        }
      }
    },
  });

  useEffect(() => {
    settingData(onQA);
  }, [dbData]);

  useEffect(() => {
    settingData(onQA);
  }, [onQA]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const mockData = [
      {
        "SEQ": 1,
        "START_DATE": "2025-06-30T15:00:00.000+00:00",
        "END_DATE": "2025-07-30T15:00:00.000+00:00",
        "GROUP_NM": "ALL",
        "PLAN_QTY": 4778799.000,
        "ACTUAL_QTY": 2441595.000,
        "PLAN_AMT": 695.471893,
        "ACTUAL_AMT": 487.837773,
        "QTY_RATE": 51.092200,
        "AMT_RATE": 70.144800
      },
      {
        "SEQ": 2,
        "START_DATE": "2025-06-30T15:00:00.000+00:00",
        "END_DATE": "2025-07-30T15:00:00.000+00:00",
        "GROUP_NM": "영업1팀",
        "PLAN_QTY": 1952367.000,
        "ACTUAL_QTY": 924064.000,
        "PLAN_AMT": 435.500291,
        "ACTUAL_AMT": 210.904996,
        "QTY_RATE": 47.330400,
        "AMT_RATE": 48.428200
      },
      {
        "SEQ": 3,
        "START_DATE": "2025-06-30T15:00:00.000+00:00",
        "END_DATE": "2025-07-30T15:00:00.000+00:00",
        "GROUP_NM": "영업2팀",
        "PLAN_QTY": 2740987.000,
        "ACTUAL_QTY": 1517531.000,
        "PLAN_AMT": 257.412661,
        "ACTUAL_AMT": 276.932777,
        "QTY_RATE": 55.364300,
        "AMT_RATE": 107.583100
      },
      {
        "SEQ": 4,
        "START_DATE": "2025-06-30T15:00:00.000+00:00",
        "END_DATE": "2025-07-30T15:00:00.000+00:00",
        "GROUP_NM": "해외사업팀",
        "PLAN_QTY": 85445.000,
        "ACTUAL_QTY": 0.000,
        "PLAN_AMT": 2.558939,
        "ACTUAL_AMT": 0.000000,
        "QTY_RATE": 0.000000,
        "AMT_RATE": 0.000000
      }
    ];

    setLoadData(mockData);
  };

  const donutPlugin = {
    id: 'customDonut',
    afterDraw: (chart) => {
      const { ctx, chartArea } = chart;
      const rate = summaryRef.current.rate;

      const centerX = chartArea.left + 60;
      const centerY = chartArea.top + 20;
      const radius = 20;  // ✅ 도넛 크기 줄임 (기존 30 → 20)
      const endAngle = (rate / 100) * 2 * Math.PI;

      ctx.save();

      // 배경 원
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#eee';
      ctx.stroke();

      // 퍼센트 도넛
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle - Math.PI / 2);
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#f39c12';
      ctx.stroke();

      // 텍스트
      ctx.fillStyle = '#000';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${rate.toFixed(1)}%`, centerX, centerY);

      ctx.restore();
    }
  };


  const summaryPlugin = {
    id: 'summaryBox',
    afterDraw: (chart) => {
      const { ctx, chartArea } = chart;
      const { plan, actual, rate } = summaryRef.current;

      ctx.save();
      ctx.font = '12px sans-serif';

      // 텍스트 계산
      const lines = [
        `plan: ${plan.toLocaleString()}`,
        `actual: ${actual.toLocaleString()}`,
        `rate: ${rate.toFixed(1)}%`
      ];

      const maxTextWidth = Math.max(...lines.map(text => ctx.measureText(text).width));
      const padding = 20;
      const lineHeight = 18;
      const boxW = maxTextWidth + padding;
      const boxH = lines.length * lineHeight + 10;

      // 박스 위치
      const boxX = chartArea.right - boxW - 20;
      const boxY = chartArea.top + 5;

      // 박스 그리기
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      // 텍스트 출력
      ctx.fillStyle = '#000';
      lines.forEach((text, i) => {
        ctx.fillText(text, boxX + 10, boxY + 20 + i * lineHeight);
      });

      ctx.restore();
    }
  };

  const settingData = (onQA) => {
    let labels = [];
    let data1 = [];
    let data2 = [];
    let percentData = [];
    let tempAllData = [];

    const round1 = (val) => Math.round(val * 10) / 10;

    dbData.forEach((item) => {
      if (item.GROUP_NM === "ALL") {
        tempAllData.push(item);
        return;
      }

      labels.push(item.GROUP_NM);

      let plan = onQA === "AMT" ? item.PLAN_AMT : item.PLAN_QTY;
      let actual = onQA === "AMT" ? item.ACTUAL_AMT : item.ACTUAL_QTY;
      const rate = onQA === "AMT" ? item.AMT_RATE : item.QTY_RATE;

      data1.push(round1(plan));
      data2.push(round1(actual));
      percentData.push(round1(rate));  // 퍼센트 그대로 사용
    });

    summaryRef.current = {
      plan: Number(onQA === "AMT" ? tempAllData[0]?.PLAN_AMT : tempAllData[0]?.PLAN_QTY || 0),
      actual: Number(onQA === "AMT" ? tempAllData[0]?.ACTUAL_AMT : tempAllData[0]?.ACTUAL_QTY || 0),
      rate: Number(onQA === "AMT" ? tempAllData[0]?.AMT_RATE : tempAllData[0]?.QTY_RATE || 0)
    };
    // 차트 데이터 설정
    setData({
      labels: labels,
      datasets: [
        {
          type: "line",
          label: "Rate",
          data: percentData,
          yAxisID: "y1",
          borderColor: "#f39c12",
          backgroundColor: "#f39c12",
          borderWidth: 1,
          pointRadius: 1,
          tension: 0.1,
          datalabels: {
            display: true,
            anchor: 'end',
            align: 'top',
            formatter: (value) => `${value.toFixed(1)}%`,
            color: '#000',
            clip: false,
            font: { size: 10, weight: 'bold' }
          }
        },
        {
          type: "bar",
          label: "plan",
          data: data1,
          backgroundColor: themeStore.palette.color.greenE,
          borderColor: themeStore.palette.color.greenE,
          borderWidth: 1,
          pointStyle: "rect",
          datalabels: {
            display: true,
            anchor: 'end',
            align: 'end',
            offset: 0,
            padding: { left: 30 },
            color: '#000',
            font: { size: 10, weight: 'bold' },
            clip: false,
            formatter: (value) => Number(value).toLocaleString()
          },
        },
        {
          type: "bar",
          label: "Actual",
          data: data2,
          backgroundColor: themeStore.palette.color.blueE,
          borderColor: themeStore.palette.color.blueE,
          borderWidth: 1,
          pointStyle: "rect",
          datalabels: {
            display: true,
            anchor: 'end',
            align: 'end',
            offset: 0,
            padding: { left: 30 },
            color: '#000',
            font: { size: 10, weight: 'bold' },
            clip: false,
            formatter: (value) => Number(value).toLocaleString()
          },
        }
      ],
    });

    let maxValue = 0;
    let maxPercent = 0;
    for (let i = 0; i < dbData.length; i++) {
      let plan = onQA === "AMT" ? dbData[i].PLAN_AMT : dbData[i].PLAN_QTY;
      let actual = onQA === "AMT" ? dbData[i].ACTUAL_AMT : dbData[i].ACTUAL_QTY;
      let perc = onQA === "AMT" ? dbData[i].AMT_RATE : dbData[i].QTY_RATE;
      maxValue = Math.max(maxValue, plan, actual);
      maxPercent = Math.max(maxPercent, perc);
    }

    // Y축 최대값을 1.4배로 설정
    setOption(prev => ({
      ...prev,
      scales: {
        ...prev.scales,
        y: {
          ...prev.scales.y,
          max: Math.ceil(maxValue * 2), // 소수 버리고 올림 처리
        },
        y1: {
          position: 'right',
          grid: { drawOnChartArea: false },
          min: 0,
          max: Math.ceil(maxPercent * 2), // 기존 y축
          ticks: {
            callback: (val) => `${val}%`
          }
        }
      },
      plugins: {
        ...prev.plugins,
      }
    }));
  };


  return (
    <WidgetContent>
      <Box id={contentId} style={{ display: 'flex', flexDirection: 'column', width: "100%", height: "100%" }}>
        <ButtonArea>
          <LeftButtonArea sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Box sx={{ marginTop: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                {dbData.length > 0 ? `${new Date(dbData[0].START_DATE).format('MM/dd')} ~ ${new Date(dbData[0].END_DATE).format('MM/dd')}` : `${transLangKey("ORN_CM_VIEW_2ND")}`}
              </Typography>
            </Box>
          </LeftButtonArea>
          <RightButtonArea>
            <WidgetButton
              type="toggle"
              value={['AMT', 'QTY']}
              curVal={onQA}
              setVal={setOnQA}
            >
            </WidgetButton>
          </RightButtonArea>
        </ButtonArea>
        <Box style={{ height: '90%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box className={classes.contentBoxStyle} style={{ height: '95%', width: '100%' }}>
            <ChartComponent options={option} dataset={data} ref={chart} config={false} plugins={[donutPlugin, summaryPlugin]} ></ChartComponent>
          </Box>
        </Box>
      </Box>
    </WidgetContent >
  )
}

export default DashboardWidget05;