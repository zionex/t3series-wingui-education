import React, { useEffect } from "react";
import { transLangKey } from "@zionex/wingui-core/lang/i18n-func";
import { LinearProgress, Typography } from "@mui/material";

function Loading() {
  useEffect(() => {
  }, []);
  return (
    <>
      <LinearProgress />
      <div className="row justify-content-md-center">
      </div>
      <div className="row justify-content-md-center">
        <div className="col-md-auto" >
          <Typography variant="h4">{transLangKey('MSG_LOADING')}</Typography>
        </div>
      </div>
    </>
  )
}

export default Loading;