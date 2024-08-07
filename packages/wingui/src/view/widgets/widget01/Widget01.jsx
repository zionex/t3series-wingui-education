import React, { useState, useEffect, useRef } from "react";
import { Box, Icon, Tab, Tabs, Breadcrumbs, TextField, Slider, Typography } from '@mui/material';
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent'

function Widget01(props) {

  return (
    <WidgetContent>
      <Box tyle={{ width: "100%", height: "100%", backgroundColor: "#ffffff" , border: "1px solid #000"}} >
        WIDGET
      </Box>
    </WidgetContent >
  )
}

export default Widget01;