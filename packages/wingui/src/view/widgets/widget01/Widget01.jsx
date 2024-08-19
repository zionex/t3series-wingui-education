import React, { useState, useEffect, useRef } from "react";
import { Box, Icon, Tab, Tabs, Breadcrumbs, TextField, Slider, Typography, Button } from '@mui/material';
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent'
import { useMenuStore } from "@zionex/wingui-core/store/contentStore";
import { useHistory } from "react-router-dom";

function Widget01(props) {
  const [getViewPath] = useMenuStore((state) => [state.getViewPath]);
  const history = useHistory();

  useEffect(() => {
    console.log("Widget01");
  }, []);

  return (
    <WidgetContent>
      <Box tyle={{ width: "100%", height: "100%", backgroundColor: "#ffffff" , border: "1px solid #000"}} >
        WIDGET
        <Button
                                color="inherit"
                                size="small"
                                onClick={() => {
                                  history.push({
                                    pathname: getViewPath("UI_AD_22"),
                                    state: {
                                      params: {
                                      },
                                    },
                                  });
                                }}>
                                GO
                              </Button>
      </Box>
    </WidgetContent >
  )
}

export default Widget01;