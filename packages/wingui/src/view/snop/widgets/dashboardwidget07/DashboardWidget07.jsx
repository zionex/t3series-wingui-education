import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from '@mui/material';
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent';
import ChartComponent from '@zionex/wingui-core/component/chart/ChartComponent';
import { createStyles, makeStyles } from '@mui/styles';
import { useContentId } from "@zionex/wingui-core/utils/common";
import { getThemeStore } from "@zionex/wingui-core/store/themeStore";

const useWidgetStyles = makeStyles(() => ({
  percentStyle: {
    position: 'absolute',
    top: '60%',
    left: '47%',
    transform: 'translate(-50%, -50%)',
    fontSize: "16px",
    fontWeight: 'bold',
    color: "#28247d"
  },
  textStyle: {
    marginTop: '10px',
    color: '#575757'
  },
}));

function DashboardWidget07() {
  const themeStore = getThemeStore('themeData');
  const contentId = useContentId();

  const chart1 = useRef(null);
  const chart2 = useRef(null);
  const classes = useWidgetStyles();

  const [chartData1, setChartData1] = useState({ datasets: [] });
  const [chartData2, setChartData2] = useState({ datasets: [] });

  const [chartText1, setChartText1] = useState("0");
  const [chartText2, setChartText2] = useState("0");
  const [percent, setPercent] = useState("0");

  const [chartOption, setChartOption] = useState();

  const labels = ['Demand', 'Demand_P'];
  const chartBackgroundColor = [themeStore.palette.secondary.dark, themeStore.palette.secondary.light];

  useEffect(() => {
    createChartOption();

    // 샘플 데이터
    const team1 = { VALUE1: 60, VALUE2: 40, VALUE3: 60 };
    const team2 = { VALUE1: 75, VALUE2: 25, VALUE3: 75 };

    setChartText1(team1.VALUE3);
    setChartText2(team2.VALUE3);
    setPercent(((team1.VALUE3 + team2.VALUE3) / 2).toFixed(0));

    setChartData1({
      labels: labels,
      datasets: [
        {
          type: "doughnut",
          data: [team1.VALUE1, team1.VALUE2],
          backgroundColor: chartBackgroundColor,
          borderWidth: 0,
          datalabels: { display: false },
          cutout: "80%",
        },
      ],
    });

    setChartData2({
      labels: labels,
      datasets: [
        {
          type: "doughnut",
          data: [team2.VALUE1, team2.VALUE2],
          backgroundColor: chartBackgroundColor,
          borderWidth: 0,
          datalabels: { display: false },
          cutout: "80%",
        },
      ],
    });
  }, []);

  const createChartOption = () => {
    setChartOption({
      responsive: true,
      maintainAspectRatio: false,
      rotation: -90,
      circumference: 180,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      hover: { mode: null },
      scales: {
        x: { display: false, grid: { display: false } },
        y: { display: false, grid: { display: false } },
      },
    });
  };

  return (
    <WidgetContent>
      <Box id={contentId} style={{ display: 'flex', flexDirection: 'column', width: "100%", height: "100%" }}>
        <Box style={{ height: '10%' }}>
          <Typography style={{ color: themeStore.palette.base.colorA, fontWeight: 'bold', fontSize: '1.2rem' }}>
            Total {percent}%
          </Typography>
        </Box>
        <Box style={{ height: '90%', width: '100%', display: 'flex' }}>
          {/* 첫 번째 차트 */}
          <Box sx={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ position: 'relative', display: 'flex', height: "70%" }}>
              <ChartComponent type="doughnut" options={chartOption} dataset={chartData1} ref={chart1} config={false} />
              <Box className={classes.percentStyle}>
                {Math.round(chartText1)}%
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "10%" }}>
              <span className={classes.textStyle}>Sales1 Team</span>
            </Box>
          </Box>

          {/* 두 번째 차트 */}
          <Box sx={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ position: 'relative', display: 'flex', height: "70%" }}>
              <ChartComponent type="doughnut" options={chartOption} dataset={chartData2} ref={chart2} config={false} />
              <Box className={classes.percentStyle}>
                {Math.round(chartText2)}%
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "10%" }}>
              <span className={classes.textStyle}>Sales2 Team</span>
            </Box>
          </Box>
        </Box>
      </Box>
    </WidgetContent>
  );
}

export default DashboardWidget07;
