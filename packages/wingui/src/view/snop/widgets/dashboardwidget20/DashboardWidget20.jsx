import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from '@mui/material';
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent'
import ChartComponent from '@zionex/wingui-core/component/chart/ChartComponent'
import { createStyles, makeStyles } from '@mui/styles';
import { isDeepEqual, useContentId } from "@zionex/wingui-core/utils/common";
import { getThemeStore } from "@zionex/wingui-core/store/themeStore";

const useWidgetStyles = makeStyles((theme) => ({
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

function DashboardWidget20(props) {
  const themeStore = getThemeStore('themeData');
  const contentId = useContentId();

  const chart1 = useRef(null);
  const chart2 = useRef(null);
  const chart3 = useRef(null);
  const chart4 = useRef(null);

  const classes = useWidgetStyles(props);

  let labels = ['Demand', 'Demand_P'];
  const chartBackgroundColor = [themeStore.palette.secondary.dark, themeStore.palette.secondary.light];
  
  const [data1, setData1] = useState([]);
  const [data1Columns, setData1Columns] = useState([]);

  const [chartData1, setChartData1] = useState({ datasets: [] });
  const [chartData2, setChartData2] = useState({ datasets: [] });
  const [chartData3, setChartData3] = useState({ datasets: [] });
  const [chartData4, setChartData4] = useState({ datasets: [] });

  const [chartText1, setChartText1] = useState("0");
  const [chartText2, setChartText2] = useState("0");
  const [chartText3, setChartText3] = useState("0");
  const [chartText4, setChartText4] = useState("0");
  const [percent, setPercent] = useState("0");

  const [chartOption, setChartOption] = useState();

  useEffect(() => {

    createChartOption();

    const fetchData = async () => {
      try {
        const aggrId = 'KPI_SALES_DEMAND_ACCURACY';
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

          const team1 = data.find((item) => item.CATEGORY1 === 'COMP01' && item.CATEGORY2 === 'SALES_1_TEAM');
          const team2 = data.find((item) => item.CATEGORY1 === 'COMP01' && item.CATEGORY2 === 'SALES_2_TEAM');
          const team3 = data.find((item) => item.CATEGORY1 === 'COMP01' && item.CATEGORY2 === 'SALES_2_CHARGE');
          const team4 = data.find((item) => item.CATEGORY1 === 'COMP02' && item.CATEGORY2 === 'SALES_1_TEAM');

          setChartText1(team1 ? Math.round(team1.VALUE3) : 0)
          setChartText2(team2 ? Math.round(team2.VALUE3) : 0)
          setChartText3(team3 ? Math.round(team3.VALUE3) : 0)
          setChartText4(team4 ? Math.round(team4.VALUE3) : 0)

          setChartData1({
            labels: labels,
            datasets: [
              {
                type: "doughnut",
                data: team1 ? [team1.VALUE1, team1.VALUE2] : [0, 0],
                backgroundColor: chartBackgroundColor,
                borderWidth: 0,
                datalabels: {
                  display: false,
                },
                cutout: "80%",
              },
            ],
          });
  
          setChartData2({
            labels: labels,
            datasets: [
              {
                type: 'doughnut',
                data: team2 ? [team2.VALUE1, team2.VALUE2] : [0, 0],
                backgroundColor: chartBackgroundColor,
                borderWidth: 0,
                datalabels: {
                  display: false,
                },
                cutout: '80%',
              },
            ],
          });
  
          setChartData3({
            labels: labels,
            datasets: [
              {
                type: 'doughnut',
                data: team3 ? [team3.VALUE1, team3.VALUE2] : [0, 0],
                backgroundColor: chartBackgroundColor,
                borderWidth: 0,
                datalabels: {
                  display: false,
                },
                cutout: '80%',
              },
            ],
          });
  
          setChartData4({
            labels: labels,
            datasets: [
              {
                type: 'doughnut',
                data: team4 ? [team4.VALUE1, team4.VALUE2] : [0, 0],
                backgroundColor: chartBackgroundColor,
                borderWidth: 0,
                datalabels: {
                  display: false,
                },
                cutout: '80%',
              },
            ],
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  const createChartOption = () => {
    setChartOption({
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          right: 10,
        }
      },
      rotation: -90,
      circumference: 180,
      plugins: {
        display: true,
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      hover: {
        mode: null
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          grid: {
            display: false
          }
        }
      },
    });
  }

  return (
    <WidgetContent>
      <Box id={contentId} style={{ display: 'flex', flexDirection: 'column', width: "100%", height: "100%" }}>
        <Box style={{ height: '10%' }}>
          <Typography style={{ color: themeStore.palette.base.colorA, fontWeight: 'bold', fontSize: '1.2rem' }}>Total {percent}%</Typography>
        </Box>
        <Box style={{ height: '90%', width: '100%', display: 'flex', flexDirection : 'column'}}>
          <Box style={{ height: '50%', width: '100%', display: 'flex'}}>
            <Box sx={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: '3px' }}>
              <Box sx={{ position: 'relative', display: 'flex', height: "70%" }} >
                <ChartComponent type="doughnut" options={chartOption} dataset={chartData1} ref={chart1} config={false} ></ChartComponent>
                <Box className={classes.percentStyle}>
                  {Math.round(chartText1)}%
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "10%" }}>
                <span className={classes.textStyle}>Sales1 Team</span>
              </Box>
            </Box>
            <Box sx={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: '3px' }}>
              <Box sx={{ position: 'relative', display: 'flex', height: "70%" }} >
                <ChartComponent type="doughnut" options={chartOption} dataset={chartData2} ref={chart2} config={false} ></ChartComponent>
                <Box className={classes.percentStyle}>
                  {Math.round(chartText2)}%
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "10%" }}>
                <span className={classes.textStyle}>Sales2 Team</span>
              </Box>
            </Box>
          </Box>
          <Box style={{ height: '50%', width: '100%', display: 'flex'}}>
            <Box sx={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative', display: 'flex', height: "70%" }} >
                <ChartComponent type="doughnut" options={chartOption} dataset={chartData3} ref={chart3} config={false} ></ChartComponent>
                <Box className={classes.percentStyle}>
                  {Math.round(chartText3)}%
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "10%" }}>
                <span className={classes.textStyle}>Sales2 Mgmt</span>
              </Box>
            </Box>
            <Box sx={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative', display: 'flex', height: "70%" }} >
                <ChartComponent type="doughnut" options={chartOption} dataset={chartData4} ref={chart4} config={false} ></ChartComponent>
                <Box className={classes.percentStyle}>
                  {Math.round(chartText4)}%
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "10%" }}>
                <span className={classes.textStyle}>Sales</span>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </WidgetContent >
  )
}

export default DashboardWidget20;