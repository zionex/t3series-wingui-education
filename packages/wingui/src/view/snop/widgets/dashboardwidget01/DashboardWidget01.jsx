import React, { useState, useEffect, useRef } from "react";
import { Box, Slider } from "@mui/material";
import WidgetContent from "@zionex/wingui-core/component/dashboard/WidgetContent";
import { zAxios } from "@wingui/common/imports";
import { transLangKey } from "@wingui";
import { themeStoreApi } from "@zionex/wingui-core/store/themeStore";

function DashboardWidget01(props) {
  const [bfAccuracy, setBFAccuracy] = useState(21);
  const [dpAccuracy, setDPAccuracy] = useState(32);
  const themeStore = themeStoreApi().themeData;

  const marks = [
    {
      value: 0,
      label: "0%",
    },
    {
      value: 100,
      label: "100%",
    },
  ];

  function valuetext(value) {
    return value + "%";
  }

  return (
    <WidgetContent>
      <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center"}}>
        <Box>
          <Box sx={{ marginBottom: 18, width: 200, textAlign: "center" }}>
            <span style={{ fontSize: 16 }}>{transLangKey("MENU_07")}</span>
          </Box>
          <Box sx={{ width: 200 }}>
            <Slider aria-label="Always visible" value={bfAccuracy} getAriaValueText={valuetext} step={1} marks={marks} valueLabelDisplay="on" sx={{color: themeStore.palette.color.greenH }} />
          </Box>
        </Box>
        <Box>
          <Box sx={{ marginBottom: 18, width: 200, textAlign: "center" }}>
            <span style={{ fontSize: 16 }}>{transLangKey("MENU_05")}</span>
          </Box>
          <Box sx={{ width: 200 }}>
            <Slider aria-label="Always visible" value={dpAccuracy} getAriaValueText={valuetext} step={1} marks={marks} valueLabelDisplay="on" sx={{color: themeStore.palette.color.blueH }}/>
          </Box>
        </Box>
      </Box>
    </WidgetContent>
  );
}

export default DashboardWidget01;
