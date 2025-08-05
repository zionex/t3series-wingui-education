import React, { useState, useEffect, useRef } from "react";
import { Box } from '@mui/material';
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent';
import WidgetButton from '@zionex/wingui-core/component/chart/WidgetButton';
import ChartComponent from '@zionex/wingui-core/component/chart/ChartComponent';
import { useContentId } from "@zionex/wingui-core/utils/common";
import { getThemeStore } from "@zionex/wingui-core/store/themeStore";

function DashboardWidget06() {
  const themeStore = getThemeStore('themeData');
  const contentId = useContentId();
  const chart2 = useRef(null);
  const chart3 = useRef(null);
  const chart4 = useRef(null);

  const [chartData2, setChartData2] = useState({ datasets: [] });
  const [chartData3, setChartData3] = useState({ datasets: [] });
  const [chartData4, setChartData4] = useState({ datasets: [] });

  const createSampleData = () => {
    setChartData2({
      labels: ['COMP01'],
      datasets: generateDatasets([5000], [3000], [1500], [500])
    });
    setChartData3({
      labels: ['COMP02'],
      datasets: generateDatasets([4000], [2500], [1200], [300])
    });
    setChartData4({
      labels: ['COMP03'],
      datasets: generateDatasets([6000], [3500], [1800], [700])
    });
  };

  function generateDatasets(total, normal, slow, invalid) {
    return [
      {
        type: "equalizerBarChart",
        fill: true,
        label: "TOTAL",
        data: total,
        backgroundColor: "#89CFF0",
        yAxisID: 'y1'
      },
      {
        type: "equalizerBarChart",
        fill: true,
        label: "NORMAL",
        data: normal,
        backgroundColor: "#A8E6CF",
        yAxisID: 'y1'
      },
      {
        type: "equalizerBarChart",
        fill: true,
        label: "SLOW",
        data: slow,
        backgroundColor: "#FFD3B6",
        yAxisID: 'y1'
      },
    ];
  }

  function generateOption(chartTitle) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { left: 10, right: 10, top: 35, bottom: 0 } },
      plugins: {
        legend: { display: false },
        datalabels: { display: false }, 
        title: {
          display: true,
          position: 'bottom',
          align: 'center',
          text: chartTitle,
          color: '#4b86be',
          font: { size: 13, weight: '600' }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { display: false } },
        y1: { grid: { display: false }, ticks: { display: false } }
      }
    };
  }

  useEffect(() => {
    createSampleData();
  }, []);

  return (
    <WidgetContent style={{ alignItems: "normal" }}>
      <Box id={contentId} style={{ width: '100%', height: '100%' }}>
        <Box style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box style={{ position: 'relative', width: '33%', height: '100%' }}>
            <ChartComponent options={generateOption('COMP01')} dataset={chartData2} ref={chart2} config={false} />
          </Box>
          <Box style={{ position: 'relative', width: '33%', height: '100%' }}>
            <ChartComponent options={generateOption('COMP02')} dataset={chartData3} ref={chart3} config={false} />
          </Box>
          <Box style={{ position: 'relative', width: '33%', height: '100%' }}>
            <ChartComponent options={generateOption('COMP03')} dataset={chartData4} ref={chart4} config={false} />
          </Box>
        </Box>
      </Box>
    </WidgetContent>
  );
}

export default DashboardWidget06;
