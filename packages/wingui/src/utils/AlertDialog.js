
import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

function AlertDialog(props) {
  const classes = usePopupDialogStyles(props)
  const { open, title, message, options, onClose } = props
  let confirm = '';
  let cancel = '';
  if (options && typeof options.text == 'object') {
    confirm = transLangKey(options.text[0])
    cancel = transLangKey(options.text[1])
  } else {
    if (options && options.text === 'YESNO') {
      confirm = transLangKey('YES')
      cancel = transLangKey('NO')
    } else if (options && options.text === 'CONFIRMCANCEL') {
      confirm = transLangKey('CONFIRM')
      cancel = transLangKey('CANCEL')
    } else {
      confirm = transLangKey('OK')
      cancel = transLangKey('CANCEL')
    }
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={classes.alertDialog}
      disableEscapeKeyDown
    >
      <DialogTitle id="alert-dialog-title">
        {title}
        <IconButton aria-label="close" onClick={() => onClose(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => onClose(true)}>{confirm}</Button>
        {options && options.close !== false ? <Button variant="outlined" onClick={() => onClose(false)}>{cancel}</Button> : null}
      </DialogActions>
    </Dialog>
  )
}

export default AlertDialog;