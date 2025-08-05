import React, { useState, useEffect, useRef } from "react";
import { Box, Icon, Tab, Tabs, Breadcrumbs, TextField, Slider, Typography } from '@mui/material';
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent'
import ChartComponent from '@zionex/wingui-core/component/chart/ChartComponent'
import { zAxios, useViewStore } from "@wingui/common/imports";
import { toNumberRoundFormat, useContentId } from "@zionex/wingui-core/utils/common";
import WidgetButton from '@zionex/wingui-core/component/chart/WidgetButton';
import { chartMaxValue } from '@zionex/wingui-core/component/chart/ChartUtil'
import { getThemeStore } from "@zionex/wingui-core/store/themeStore";

function DashboardWidget23(props) {
  const themeStore = getThemeStore('themeData');
  const contentId = useContentId();

  const chart1 = useRef(null);

  const [data1, setData1] = useState([]);
  const [data1Columns, setData1Columns] = useState([]);
  const [chartData1, setChartData1] = useState({ datasets: [] });
  const [chartOption1, setChartOption1] = useState({});
  const [gapText, setGapText] = useState('');
  const [rateText, setRateText] = useState('');
  const [filterVal, setFilterVal] = useState('MTD');
  const [selected, setSelected] = useState("MTD");
  
  useEffect(() => {
    if (selected) {
      changeFilter(selected)
    }
  }, [selected]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const aggrId = 'KPI_SALES_RTF_COMPLIANCE_RATE';
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
    if(data1.length > 0){
      createChart();
    }
  }, [data1, filterVal]);

  useEffect(() => {
		if(chartData1 && chartData1.datasets.length > 0) {
      let gapValue = chartData1.datasets[0].data[1] - chartData1.datasets[0].data[0];

			const annotation1 = {
				type: 'line',
				borderWidth: 1,
				borderColor: gapValue >= 0 ? '#2261b1' : '#ff7375',
        borderDash: [5, 5],
        label: {
					display: false,
				},
				xMax: 1,
				xMin: 0,
				xScaleID: 'x',
        color: gapValue >= 0 ? '#2261b1' : '#ff7375',
				yMax: gapValue >= 0 ? chartData1.datasets[0].data[1] : chartData1.datasets[0].data[0],
				yMin: gapValue >= 0 ?  chartData1.datasets[0].data[1] : chartData1.datasets[0].data[0],
				yScaleID: 'y1'
			};

      const annotation2 = {
				type: 'line',
				borderWidth: 1,
				borderColor: gapValue >= 0 ? '#2261b1' : '#ff7375',
        label: {
					display: true,
          backgroundColor: 'transparent',
          color: gapValue >= 0 ? '#2261b1' : '#ff7375',
					borderWidth: 0,
					content: gapValue.toLocaleString(),
          yAdjust: -18
				},
        arrowHeads: {
          start: {
            display: true,
            borderColor: gapValue >= 0 ? 'transparent' : '#ff7375',
            fill: true,
            length: 7,
          },
          end: {
            display: true,
            borderColor: gapValue >= 0 ? '#2261b1' : 'transparent',
            fill: true,
            length: 7,
          }
        },
				xMax: gapValue >= 0 ? 0 : 1,
				xMin: gapValue >= 0 ? 0 : 1,
				xScaleID: 'x',
				yMax: gapValue >= 0 ? chartData1.datasets[0].data[1] : chartData1.datasets[0].data[0],
				yMin: gapValue >= 0 ?  chartData1.datasets[0].data[0] : chartData1.datasets[0].data[1],
				yScaleID: 'y1'
			};

			setChartOption1({
				responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 10, 
            top: 20,
            bottom: 0
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          annotation: {
            annotations: {
              annotation1,
              annotation2
            }
          },
          datalabels: {
						color: '#2e75b6'
					},
          tooltip: {
            enabled: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#2e75b6'
            }
          },
          y1: {
            position: 'left',
            max: (ctx) => chartMaxValue(ctx) * 1.3,
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              display: false
            },
          },
        }
			});
		}
	}, [chartData1]);

  const createChart = () => {
    const resultData = data1.find(a => a.CATEGORY1  === filterVal);
    const gap = resultData.VALUE1 - resultData.VALUE2;
    setGapText(gap !== 0 ? toNumberRoundFormat(gap*-1) : 0)
    setRateText(toNumberRoundFormat(resultData.VALUE3)+'%')

    setChartData1({
      labels: [data1Columns.VALUE1, data1Columns.VALUE2],
      datasets: [
        {
          type: "bar",
          fill: true,
          label: '',
          data: [Math.floor(resultData.VALUE1), Math.floor(resultData.VALUE2)],
          borderColor: '#718cc3',
          backgroundColor: themeStore.palette.secondary.main,
          borderWidth: 1,
          barPercentage: 0.3,
          yAxisID: 'y1',
          datalabels: {
            color: '#fff',
            formatter: function (value, context) { 
              return toNumberRoundFormat(value) 
            },
          },
        },
      ],
    });
  }

  function changeFilter(val) {
    setFilterVal(val);
  }


  return (
    <WidgetContent>
      <Box id={contentId} style={{ display: 'flex', flexDirection: 'column', width: "100%", height: "100%" }}>
        <Box style={{ height: '10%', display: 'flex' }}>
          <Box style={{ width: '50%' }}>
            <Typography style={{ color: themeStore.palette.base.colorA, fontWeight: 'bold', fontSize: '1.2rem' }}>{rateText} ({gapText} Ton)</Typography>
          </Box>
          <Box style={{ width: '50%', display: 'flex', justifyContent: 'flex-end' }}>
            <WidgetButton type="toggle" value={['MTD', 'YTD']} curVal={selected} setVal={setSelected} activate={filterVal === selected ? true : false}></WidgetButton>
          </Box>
        </Box>
        <Box style={{ height: '90%', width: '100%' }}>
          <ChartComponent options={chartOption1} dataset={chartData1} ref={chart1} config={false}></ChartComponent>
        </Box>
      </Box>
    </WidgetContent >
  )
}

export default DashboardWidget23;