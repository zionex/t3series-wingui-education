import React, { useState, useEffect, useRef } from "react";
import { Box, Icon, Tab, Tabs, Breadcrumbs, TextField, Slider, Typography } from '@mui/material';
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent'
import ChartComponent from '@zionex/wingui-core/component/chart/ChartComponent'
import { Tooltip } from 'chart.js';
import { getRelativePosition } from 'chart.js/helpers';
import { isDeepEqual, useContentId } from "@zionex/wingui-core/utils/common";
import { getThemeStore } from "@zionex/wingui-core/store/themeStore";

let gradient;
const plgGradient = {
  id: 'plgGradient',
  beforeDraw(chart, args, options) {
    let ctx = chart.ctx;
    let chartArea = chart.chartArea;
    gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom
    );

    const themeStore = getThemeStore('themeData')
    gradient.addColorStop(0, transparentize(themeStore.palette.primary.main, 0.8));
    gradient.addColorStop(1, transparentize(themeStore.palette.secondary.light, 0.8));

    // Access the dataset meta to set the gradient as the backgroundColor
    let meta = chart.getDatasetMeta(1);
    if (meta.dataset) {
      meta._dataset.backgroundColor = gradient;
    }
  },
};

Tooltip.positioners.TopPositioner = function (elements, eventPosition) {
  return {
    x: eventPosition.x,
    y: 0
  };
};


function DashboardWidget04(props) {
  const classes = useWidgetStyle();
  const contentId = useContentId();

  const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const [defaultMonthIndex, setDefaultMonthIndex] = useState(new Date().getMonth());

  const chart = useRef(null);

  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({ datasets: [] });
  const [chartOption, setChartOption] = useState({});
  const [tableData, setTableData] = useState([]);

  const [year, setYear] = useState([]);
  const [lastYear, setLastYear] = useState([]);

  const [mtd, setMtd] = useState([]);
  const [ytd, setYtd] = useState([]);
  const [month, setMonth] = useState('');

  const plgMouseOverBox = {
    id: 'plgMouseOverBox',
    beforeEvent(chart, args, options) {
      let { defaultXIndex } = options;

      const event = args.event;
      if (event.type === 'click') {
        const canvasPosition = getRelativePosition(event, chart);
        const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
        //const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
        chart.currentX = Math.max(dataX, 0);
        setDefaultMonthIndex(Math.max(dataX, 0));
      }
    },
    beforeDraw(chart, args, options) {
      const { ctx, chartArea: { left, top, right, bottom }, scales } = chart;
      let { backgroundColor, defaultXIndex } = options;

      backgroundColor = backgroundColor == undefined ? '#ffffff' : backgroundColor;

      let xScaleId = Object.keys(scales).find(scaleid => scales[scaleid].axis == 'x')
      //let yScaleId = Object.keys(scales).find(scaleid => scales[scaleid].axis =='y')

      chart.currentX = chart.currentX != undefined ? chart.currentX : defaultXIndex

      if (chart.currentX != undefined && xScaleId) {

        const scaleX = scales[xScaleId]
        //const scaleY = scales[y]
        const width = scaleX.width / (scaleX.max + 1);

        const midX = scaleX.getPixelForValue(chart.currentX);
        //const midY = scaleY.getPixelForValue(0);

        ctx.save();
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(midX - width / 2, top, width, bottom);
        ctx.restore();
      }
    }
  };

  useEffect(() => {

    const year = new Date().format("yyyy");
    const lastYear = (Number(year) - 1) + '';

    setYear(year);
    setLastYear(lastYear);
    createChartOption();

    const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentResult = [10, 20, 15, 25, 30, 28, 35, 40, 38, 32, 28, 22]; // %
    const lastResult = [8, 18, 14, 20, 26, 25, 32, 36, 34, 30, 25, 20];

    setChartData({
      labels: chartLabels,
      datasets: [
        {
          type: "line",
          fill: false,
          label: "",
          data: currentResult,
          borderColor: "#528dc2",
          backgroundColor: "#fff",
          borderWidth: 2,
          pointRadius: 5,
          // tension: 0.5,
          yAxisID: "y1",
          datalabels: {
            anchor: "end",
            align: "end",
            color: "#397cb9",
            formatter: function (value) {
              return value + "%";
            },
          },
        },
        {
          type: "line",
          fill: true,
          label: "",
          data: lastResult,
          borderColor: "#6275b4",
          backgroundColor: gradient || "rgba(98,117,180,0.2)", // gradient 없으면 fallback
          pointRadius: 0,
          borderWidth: 1,
          // tension: 0.3,
          yAxisID: "y1",
          datalabels: {
            display: false,
          },
        },
      ],
    });

  }, []);


  useEffect(() => {
    let curRef = chart.current;
    curRef.currentX = defaultMonthIndex;
    curRef.update();
    setMonth(chartLabels[defaultMonthIndex]);
  }, [defaultMonthIndex]);

  const createChartOption = () => {
    setChartOption({
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        autoPadding:true,
        padding: {
          top: 30,
        }
      },
      plugins: {
        display: true,
        legend: {
          display: false,
        },
        plgMouseOverBox: {
          backgroundColor: '#d2e5f6',
          defaultXIndex: defaultMonthIndex,
        },
        tooltip: {
          enabled: true,
          yAlign: 'bottom',
          position: 'TopPositioner'
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
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            display: false
          },
          beginAtZero: true,
        },
      }
    });
  }
  const numberFormat = (val) => {
    if(val){
      val = Math.round(val).toLocaleString()
    }else{
      val = 0;
    }
    return val;
  }


  return (
    <WidgetContent>
      <Box id={contentId} style={{ display: 'flex', flexDirection: 'column', width: "100%", height: "100%", justifyContent: 'space-around' }}>
      <Typography className={`${classes.boardTitle}`} component="h3">Sales order Input rate</Typography>
        <Box className={classes.contentBoxStyle}>
          <Box style={{height: '100%'}}>
            <Box style={{ height: '90%', display: 'flex', alignItems: 'center' }}>
              <Box style={{ height: '20%', width: '10%' }}>
                <Typography style={{ color: '#528dc2', fontSize: '14px' }}>`{year.slice(-2)}{transLangKey('FP_YEAR')}</Typography>
                <Typography style={{ color: '#b0c6e7', fontSize: '14px' }}>`{lastYear.slice(-2)}{transLangKey('FP_YEAR')}</Typography>
              </Box>
              <Box style={{ height: '100%', width: '90%' }}>
                <ChartComponent options={chartOption} dataset={chartData} ref={chart} config={false} plugins={[plgGradient, plgMouseOverBox]}></ChartComponent>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </WidgetContent >
  )
}

export default DashboardWidget04;