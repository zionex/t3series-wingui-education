import React, { useState, useEffect, useRef } from "react";
import { Box, Icon, Tab, Tabs, Breadcrumbs, TextField, Slider, Typography } from '@mui/material';
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent'
import ChartComponent from '@zionex/wingui-core/component/chart/ChartComponent'
import WidgetButton from '@zionex/wingui-core/component/chart/WidgetButton';
import { useTheme } from '@mui/material/styles';
import { zAxios, useViewStore } from "@wingui/common/imports";
import { Tooltip } from 'chart.js';
import { isDeepEqual, useContentId } from "@zionex/wingui-core/utils/common";
import { getThemeStore } from "@zionex/wingui-core/store/themeStore";


const GradientBarGraph = ({ percentage }) => {
  const themeStore = getThemeStore('themeData');
  const filledPercentage = Math.min(100, Math.max(0, percentage));
  const barStyle = {
    background: `linear-gradient(to right, ${themeStore.palette.primary.main}, ${themeStore.palette.primary.dark} ${filledPercentage}%)`,
    borderRadius: '20px',
    height: '25px',
    width: `${filledPercentage}%`,
  };

  const containerStyle = {
    position: 'relative',
    height: '40px',
    width: '100%',
    background: '#ececec',
    borderRadius: '20px',
    overflow: 'hidden',
    padding: '8px 12px',
  };  

  const textStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    width: '100%',
    color: filledPercentage>=55 ? '#fff' : '#28247d',
    fontWeight: 'bold',
    fontSize: '14px'
  };

  return (
    <div style={containerStyle}>
      <div style={barStyle}></div>
      <div style={textStyle}>{`${filledPercentage}%`}</div>
    </div>
  );
};

function DashboardWidget25(props) {
  const themeStore = getThemeStore('themeData');
  const contentId = useContentId();
  const [data1, setData1] = useState([]);
  const [data1Columns, setData1Columns] = useState([]);
  const [barPercentage, setBarPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aggrId = 'KPI_SUPPLY_PROCURE_ACHIEVEMENT';
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
    if(data1.length>0){
      createChart();
    }else{
      setBarPercentage(0);
    }
  }, [data1]);

  const createChart = ()=> {
    setBarPercentage(data1[0].VALUE3.toFixed(2))
  }

  return (
      <WidgetContent>
      <Box style={{ width: '100%', padding: '1px 10px 1px 0px', marginBottom: '30px' }}>
        <Typography style={{ color: themeStore.palette.base.colorA, fontWeight: 'bold', fontSize: '1.2rem' }}>Total {barPercentage}%</Typography>
      </Box>
      <Box  id={contentId}  style={{  width: "80%", height: '100%', position: 'relative'}}>
        <Box style={{width: "100%", position: 'absolute', bottom: 0}}>
          <GradientBarGraph percentage={barPercentage} />
        </Box>
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'row', width: "80%", height: "100%"}}>
        <Box style={{ width: '50%', color: '#616161', fontWeight: 'bolder' }}>Actual</Box>
        <Box style={{ width: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'end', color: '#346eaf'}}>
          <Box>100</Box>
        </Box>
      </Box>
    </WidgetContent >
  )
}

export default DashboardWidget25;