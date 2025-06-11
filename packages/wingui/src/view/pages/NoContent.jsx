import React, { useEffect } from "react";
import { transLangKey } from "@zionex/wingui-core/lang/i18n-func";
import { Avatar, Box, Typography } from "@mui/material";
import AnnouncementIcon from '@mui/icons-material/Announcement';

function NoContent() {
  useEffect(() => {
  }, []);
  return (
    <Box style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
      }}
    >
      <Box className="row justify-content-md-center">
        <Box>
          <AnnouncementIcon sx={{ width: 56, height: 56 }} />
        </Box>
      </Box>
      <Box className="row justify-content-md-center">
        <Box>
          <Typography variant="h4">{transLangKey('MSG_NO_CONTENT')}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default NoContent;