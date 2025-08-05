import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from '@mui/material';
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent'
import ChartComponent from '@zionex/wingui-core/component/chart/ChartComponent'
import { toNumberLocaleString, toNumberRoundFormat, useContentId } from "@zionex/wingui-core/utils/common";
import { getThemeStore } from "@zionex/wingui-core/store/themeStore";


const NegBarGraph = ({ percentage }) => {
  const themeStore = getThemeStore('themeData');
  const filledPercentage = 100;
  const barStyle = {
    background: `linear-gradient(to right, ${themeStore.palette.error.normal}, ${themeStore.palette.warning.light} ${filledPercentage}%)`,
    borderRadius: '5px 0px 0px 5px',
    height: '100%',
    width: `${filledPercentage}%`,
    float: 'right'
  };

  const containerStyle = {
    position: 'relative',
    height: '20px',
    width: '20%',
    background: '#ececec',
    borderRadius: '5px',
    border: '1px solid #223f59',
    overflow: 'hidden',
    float: 'left',
  };

  return (
    <div style={containerStyle}>
      <div className="bar" style={barStyle}></div>
    </div>
  );
};


const PosBarGraph = ({ percentage }) => {
  const themeStore = getThemeStore('themeData');
  const filledPercentage = 100;
  const barStyle = {
    background: `linear-gradient(to right, ${themeStore.palette.success.light}, ${themeStore.palette.success.normal} ${filledPercentage}%)`,
    borderRadius: '5px 0px 0px 5px',
    height: '100%',
    width: `${filledPercentage}%`,
    float: 'right'
  };

  const containerStyle = {
    position: 'relative',
    height: '20px',
    width: '20%',
    background: '#ececec',
    borderRadius: '5px',
    border: '1px solid #223f59',
    overflow: 'hidden',
    float: 'left',
  };

  return (
    <div style={containerStyle}>
      <div className="bar" style={barStyle}></div>
    </div>
  );
};

const GradientBarGraph = ({ percentage }) => {
  const themeStore = getThemeStore('themeData');
  const filledPercentage = 100;
  const barStyle = {
    background: `linear-gradient(to right, ${themeStore.palette.error.light}, ${themeStore.palette.warning.normal}, ${themeStore.palette.success.light} 100%)`,
    borderRadius: '5px',
    border: '1px solid #223f59',
    height: '100%',
    width: `${filledPercentage}%`,
  };

  const containerStyle = {
    position: 'relative',
    height: '20px',
    width: '60%',
    background: '#ececec',
    borderRadius: '0px 5px 5px 0px',
    overflow: 'hidden',
    float: 'left',
  };

  return (
    <div style={containerStyle}>
      <div className="bar" style={barStyle}></div>
    </div>
  );
};

const lineWrapStyle = {
  position: 'absolute',
  top: '-2px',
  zIndex: 2
}

const lineStyle = {
  borderRight: '2px dotted #3F51B5',
  height: '25px',
  zIndex: 2,
};


const percentStyle = {
  position: 'absolute',
  fontSize: '12px',
  color: '#3070ab',
  right: '-14px'
};


function calculateLeftPercentage(minValue, maxValue, value) {
  // value는 -40부터 0까지의 백분율 값으로 가정
  // 예를 들어, -20을 받으면 50%를 반환해야 함
  let percentage = 0;

  if (minValue === -40 && value < -20) {
    percentage = 0;
  } else if (minValue == - 100 && value > 120) {
    percentage = 100;
  } else {
    // 최소값에서 최대값까지의 범위 계산
    const range = maxValue - minValue;

    // 주어진 값이 최소값과 최대값 사이의 어디에 있는지 계산
    const position = value - minValue;

    // 백분율로 변환
    percentage = (position / range) * 100;
  }
  // 최종 left 값을 반환
  return percentage + "%";
}


function calculateStyle(value) {
  let style = {};

  if (value < 0) {
    // 값이 0보다 작으면 left, color: #ca4b42
    style = {
      textAlign: "left",
      color: "#ca4b42"
    };
  } else if (value >= 100) {
    // 값이 100보다 크면 right, color: #3f6ad8
    style = {
      textAlign: "right",
      color: "#3f6ad8"
    };
  } else {
    // 그 외의 경우는 center, color: #ca4b42
    style = {
      textAlign: "center",
      color: "#ca4b42"
    };
  }

  return style;
}

function DashboardWidget21(props) {
  const themeStore = getThemeStore('themeData');
  const contentId = useContentId();
  const chart1 = useRef(null);

  const [data1, setData1] = useState([]);
  const [data1Columns, setData1Columns] = useState([]);

  const [chartData1, setChartData1] = useState({ datasets: [] });
  const [chartOption1, setChartOption1] = useState({});
  const [gapText, setGapText] = useState('');
  const [rate, setRate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aggrId = 'KPI_PRODUCTION_INVALID_STOCK_ACHIEVEMENT';
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
      let gapValue = -1 * (chartData1.datasets[0].data[3] - chartData1.datasets[0].data[2]);
      if (rate >= 100) {
        setGapText('(Expectation of ' + numberFormat(gapValue) + ' tons over)');
      } else {
        setGapText('(Expectation of ' + numberFormat(gapValue) + ' tons short)');
      }

      const annotation1 = {
        type: 'line',
        borderWidth: 1,
        borderColor: gapValue >= 0 ? '#ff7375' : '#2261b1',
        borderDash: [5, 5],
        label: {
          display: false,
        },
        xMax: 3,
        xMin: 2,
        xScaleID: 'x',
        yMax: gapValue >= 0 ? chartData1.datasets[0].data[2] : chartData1.datasets[0].data[3],
        yMin: gapValue >= 0 ? chartData1.datasets[0].data[2] : chartData1.datasets[0].data[3],
        yScaleID: 'y1'
      };

      const annotation2 = {
        type: 'line',
        borderWidth: 1,
        borderColor: gapValue >= 0 ? '#ff7375' : '#2261b1',
        label: {
          display: true,
          backgroundColor: 'transparent',
          color: gapValue >= 0 ? '#ff7375' : '#2261b1',
          borderWidth: 0,
          content: Math.round(gapValue).toLocaleString(),
          yAdjust: -15
        },
        arrowHeads: {
          start: {
            display: true,
            borderColor: gapValue >= 0 ? 'transparent' : '#2261b1',
            fill: true,
            length: 7,
          },
          end: {
            display: true,
            borderColor: gapValue >= 0 ? '#ff7375' : 'transparent',
            fill: true,
            length: 7,
          }
        },
        xMax: gapValue >= 0 ? 3 : 2,
        xMin: gapValue >= 0 ? 3 : 2,
        xScaleID: 'x',
        yMin: gapValue >= 0 ? chartData1.datasets[0].data[3] : chartData1.datasets[0].data[2],
        yMax: gapValue >= 0 ? chartData1.datasets[0].data[2] : chartData1.datasets[0].data[3],
        yScaleID: 'y1'
      };

      setChartOption1({
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 0
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          datalabels: {
            color: '#2e75b6'
          },
          tooltip: {
            enabled: false,
          },
          annotation: {
            annotations: {
              annotation1,
              annotation2,
            }
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
    const year = new Date().format("yyyy");

    setRate(data1[0].VALUE6)
    setChartData1({
      labels: ['Current', ['Disposal Plan', '(Current~`' + year.substr(2, 2) + ')'], 'End of year(E)', 'Target'],
      //labels: [data1Columns.VALUE1, data1Columns.VALUE2, data1Columns.VALUE3, data1Columns.VALUE4],
      datasets: [
        {
          type: "bar",
          fill: true,
          label: '',
          data: [data1[0].VALUE1, data1[0].VALUE2, data1[0].VALUE3, data1[0].VALUE4],
          borderColor: ['#b3c6e7', '#fed966', '#f4af85', '#c6e0b3'],
          backgroundColor: [themeStore.palette.secondary.main, themeStore.palette.secondary.dark, themeStore.palette.primary.main, themeStore.palette.primary.light],
          borderWidth: 1,
          barPercentage: 0.5,
          yAxisID: 'y1',
          datalabels: {
            formatter: function (value, context) {
              return toNumberRoundFormat(value);
            },
          },
        },
      ],
    });
  }
  const numberFormat = (val) => {
    if (val) {
      val = Math.round(val).toLocaleString()
    } else {
      val = 0;
    }
    return val;
  }

  function changeFilter(val) {
    setFilterVal(val);
  }

  return (
    <WidgetContent>
      <Box id={contentId} style={{ display: 'flex', flexDirection: 'column', width: "100%", height: "100%" }}>
        <Box style={{ height: '10%', display: 'flex', marginBottom: '10px' }}>
          <Box style={{ width: '50%' }}>
            <Typography style={{ color: themeStore.palette.base.colorA, fontWeight: 'bold', fontSize: '1.2rem' }}>{numberFormat(rate)}%</Typography>
          </Box>
        </Box>
        <Box style={{ position: 'relative', width: '90%', margin: '0 auto', minHeight: '34px' }}>
          <Box style={{ display: 'block', width: '100%', ...calculateStyle(rate) }}>
            {gapText}
          </Box>
          <Box style={{ display: 'flex', width: '100%', marginTop: '-6px' }}>
            <Box style={{ width: '20%', position: 'relative' }}>
              {rate < 0 &&
                <Box style={{ position: 'absolute', zIndex: 2, left: `calc(${calculateLeftPercentage(-40, 0, rate)} - 7px)`, color: '#ca4b42' }}>▼</Box>
              }
            </Box>
            <Box style={{ width: '60%', position: 'relative' }}>
              {rate < 100 && rate >= 0 &&
                <Box style={{ position: 'absolute', zIndex: 2, left: `calc(${rate}% - 7px)`, color: '#ca4b42' }}>▼</Box>
              }
            </Box>
            <Box style={{ width: '20%', position: 'relative' }}>
              {rate >= 100 &&
                <Box style={{ position: 'absolute', zIndex: 2, left: `calc(${calculateLeftPercentage(100, 140, rate)} - 7px)`, color: '#3f6ad8' }}>▼</Box>
              }
            </Box>
          </Box>
        </Box>
        <Box style={{ position: 'relative', height: '10%', width: '90%', margin: '0 auto' }}>
          <Box style={{ ...lineWrapStyle, left: '10%' }}>
            <Box style={{ ...lineStyle }}>
            </Box>
            <Box style={{ ...percentStyle }}>-20%</Box>
          </Box>
          <Box style={{ ...lineWrapStyle, left: '20%' }}>
            <Box style={{ ...lineStyle }}>
            </Box>
            <Box style={{ ...percentStyle }}>0%</Box>
          </Box>
          <Box style={{ ...lineWrapStyle, left: '80%' }}>
            <Box style={{ ...lineStyle }}>
            </Box>
            <Box style={{ ...percentStyle }}>100%</Box>
          </Box>
          <Box style={{ ...lineWrapStyle, left: '90%' }}>
            <Box style={{ ...lineStyle }}>
            </Box>
            <Box style={{ ...percentStyle }}>120%</Box>
          </Box>
          <NegBarGraph />
          <GradientBarGraph />
          <PosBarGraph />
        </Box>
        <Box style={{ height: '65%', width: '100%' }}>
          <ChartComponent options={chartOption1} dataset={chartData1} ref={chart1} config={false}></ChartComponent>
        </Box>
      </Box>
    </WidgetContent >
  )
}

export default DashboardWidget21;