import React, { useState, useEffect, useRef } from "react";
import { Box } from '@mui/material';
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent'
import ChartComponent from '@zionex/wingui-core/component/chart/ChartComponent'
import { toNumberLocaleString, toNumberRoundFormat, useContentId } from "@zionex/wingui-core/utils/common";
import { chartMaxValue } from '@zionex/wingui-core/component/chart/ChartUtil'
import { getThemeStore } from "@zionex/wingui-core/store/themeStore";

function DashboardWidget26(props) {
  const themeStore = getThemeStore('themeData');
  const contentId = useContentId();

  const chart1 = useRef(null);

  const [data1, setData1] = useState([]);
  const [data1Columns, setData1Columns] = useState([]);
  const [chartData1, setChartData1] = useState({ datasets: [] });
  const [chartOption1, setChartOption1] = useState({});
  const [targetRate, setTargetRate] = useState(0);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aggrId = 'KPI_SALES_ORDER_INPUT_RATE';
        const response1 = await getSnopDashboardData(aggrId, contentId, null);

        if (response1.status === HTTP_STATUS.SUCCESS) {
          const columns = response1.data.columns;
          const data = response1.data.data;
          setData1(data);

          const columnFields = {};
          columns.forEach((item) => {
            const fieldKey = item["field"];
            const descripValue = item["descrip"];
            columnFields[fieldKey] = descripValue;
          });

          setData1Columns(columnFields);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

  }, []);

  useEffect(() => {
    if (data1.length > 0) {
      createChart();
    }
  }, [data1]);

  useEffect(() => {
    if (chartData1 && chartData1.datasets.length > 0) {
      const annotation = {
        type: 'label',
        borderWidth: 0,
        backgroundColor: 'transparent',
        color: '#2e75b6',
        content: targetRate + '%',
        position: {
          x: 'center',
          y: 'start'
        },
        yScaleID: 'y2',
        xValue: chartData1.labels[labels.length - 1],
        yValue: 125,
      };

      setChartOption1({
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
          }
        },
        plugins: {
          display: true,
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
          annotation: {
            annotations: {
              annotation
            }
          },
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: function (context) {
                return context.index === labels.length - 1 ? '#2e75b6' : '#adb9ca';
              }
            }
          },
          y1: {
            position: 'left',
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              display: false
            },
            max: (ctx) => chartMaxValue(ctx) * 1.3,
            beginAtZero: true,
          },
          y2: {
            position: 'right',
            grid: {
              display: false,
              drawBorder: false
            },
            min: -50,
            max: 120,
            ticks: {
              stepSize: 20,
              display: false,
              beginAtZero: false,
            },
          }
        }
      });
    }
  }, [chartData1]);

  const createChart = () => {
    let resultData = data1;
    const labelSet = resultData.map((item) => item.DATE1_WW);

    setTargetRate(resultData.map((item) => Math.round(item.VALUE2)).slice(-1));
    setLabels(labelSet);
    setChartData1({
      labels: labelSet,
      datasets: [
        {
          type: "line",
          fill: false,
          label: '',
          data: resultData.filter((item) => item.DATE1_WW !== 'TARGET').map((item) => item.VALUE2),
          borderColor: themeStore.palette.secondary.main,
          backgroundColor: '#fff',
          borderWidth: 3,
          pointRadius: 5,
          yAxisID: 'y2',
          datalabels: {
            anchor: 'end',
            align: 'end',
            color: themeStore.palette.secondary.main,
            formatter: function (value, context) {
              return toNumberRoundFormat(value) + "%"
            },
          },
        },
        {
          type: "bar",
          fill: true,
          label: '',
          data: resultData.map((item) => item.VALUE1),
          borderColor: '#adb9ca',
          backgroundColor: themeStore.palette.secondary.main,
          borderWidth: 1,
          yAxisID: 'y1',
          datalabels: {
            anchor: 'center',
            align: 'top',
            /* backgroundColor:'#fff', */
            color: '#383838',
            font: 14,
            formatter: function (value, context) {
              // 데이터가 마지막인지 확인
              const isLastData = context.dataIndex === context.dataset.data.length - 1;
              // 값 서식화
              const formattedValue = toNumberRoundFormat(value);
              // 마지막 데이터일 경우 RTF 추가
              return isLastData ? `${formattedValue}\n (RTF)` : formattedValue;
            },
          },
        },
      ],
    })
  }

  return (
    <WidgetContent>
      <Box id={contentId} style={{ display: 'flex', flexDirection: 'column', width: "100%", height: "100%" }}>
        <Box style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Box style={{ height: '95%', width: '100%' }}>
            <ChartComponent options={chartOption1} dataset={chartData1} ref={chart1} config={false}></ChartComponent>
          </Box>
        </Box>
      </Box>
    </WidgetContent >
  )
}

export default DashboardWidget26;