import React, { useState, useEffect } from 'react';
import AlertDialog from './AlertDialog';
import Toast from './Toast';

let showMessageConfig = null;

const AlertDialogContext = React.createContext();

export const AlertDialogProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info',
    timer: '',
    dialog: '',
    options: {}
  });

  const showMessage = function (title, message, options = {}, callback = () => { }) {
    if (arguments.length === 3 && typeof arguments[2] === 'function') {
      callback = options;
      options = {};
    }

    if (dialogState.open) {
      setDialogState({ ...dialogState, open: false });
      setTimeout(() => {
        setDialogState({ open: true, title, message, callback });
      }, 0);
    } else {
      setDialogState({ open: true, title, message, callback });
    }
    showMessageConfig = { title, message, options, callback };
    setDialogState({ open: true, title, message, options, callback });
  };

  const handleClose = (action, reason) => {
    if(reason == 'backdropClick') {
      return 
    }
    if (dialogState.callback) {
      dialogState.callback(action);
    }
    setDialogState({ ...dialogState, open: false });
  };

  function showToast(message, type, timer) {
    if (arguments.length === 2) {
      timer = type;
      type = undefined;
    }

    if (dialogState.open) {
      setDialogState({ ...dialogState, open: false, dialog: 'toast' });
      setTimeout(() => {
        setDialogState({ open: true, message, type, timer, dialog: 'toast' });
      }, 0);
    } else {
      setDialogState({ open: true, message, type, timer, dialog: 'toast' });
    }
    showMessageConfig = { message, type, timer, dialog: 'toast' };
    setDialogState({ open: true, message, type, timer, dialog: 'toast' });
  }

  useEffect(() => {
    window.showMessage = showMessage;
    window.showToast = showToast;
  }, [dialogState]);
  return (
    <AlertDialogContext.Provider value={{ showMessage }}>
      {children}
      {dialogState.dialog === 'toast' ?
        <Toast
          open={dialogState.open}
          type={dialogState.type}
          timer={dialogState.timer}
          message={dialogState.message}
          onClose={handleClose}
        ></Toast> :
        <AlertDialog
          open={dialogState.open}
          title={dialogState.title}
          message={dialogState.message}
          options={dialogState.options}
          onClose={handleClose}
        />}

    </AlertDialogContext.Provider>
  );
};

export default AlertDialogProvider;