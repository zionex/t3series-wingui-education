
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";
import React from "react";
function Toast(props) {
  const { open, onClose, type, timer, message } = props
  return (
    <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={timer} open={open} onClose={onClose}>
      <Alert onClose={onClose} variant="filled" severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Toast;