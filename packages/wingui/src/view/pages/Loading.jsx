import React, { useEffect } from "react";
import { transLangKey } from "@zionex/wingui-core/lang/i18n-func";
import { Box, LinearProgress, Typography } from "@mui/material";

function Loading() {
  useEffect(() => {
  }, []);
  return (
    <>
      <LinearProgress />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}> </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ }} >
          <Typography variant="h4">{transLangKey('MSG_LOADING')}</Typography>
        </Box>
      </Box>
    </>
  )
}

export default Loading;