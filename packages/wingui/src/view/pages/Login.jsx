import React, { useEffect, useState } from "react";
import { InputField, userStoreApi,useUserStore, CommonButton } from "@wingui/common/imports";
import { Controller, useForm } from "react-hook-form";
import { Alert, Box, IconButton, InputAdornment, Snackbar, Typography,FormControl, FormGroup,FormControlLabel,
  Checkbox
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { uiSettings } from "@wingui/common/uiSettings";
import { useMenuStore } from "@zionex/wingui-core/store/contentStore";
import { transLangKey } from "@zionex/wingui-core/lang/i18n-func";
import { TextField } from'@mui/material'
import ClearIcon from '@mui/icons-material/Clear';

/** 사용자 입력 필드*/
function InputUser({name, control}) {
  return (
    <Controller name={name} 
                control={control}
                render={
                  ({ field: { onChange, value }, fieldState: { error } }) =>
                    <TextField 
                      value={value || ''}
                      hiddenLabel={true} 
                      variant="filled" 
                      size="small"
                      style={{width:330}}
                      onChange={onChange}
                      InputProps={{
                        disableUnderline: true,
                        endAdornment: (value ? (
                                    <IconButton size="small" sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }} onClick={() => {
                                      onChange('');
                                    }}>
                                    <ClearIcon />
                                  </IconButton>
                                ) : undefined)
                      }}
                    />
      }
    />)
}

/** 패스워드 입력 필드*/
function InputPasword({name, control, handleClickShowPassword,showPassword,onKeyDown,dataType}) {
  return (
    <Controller name={name} 
                control={control}
                render={
                  ({ field: { onChange, value: val }, fieldState: { error } }) =>
                    <TextField 
                      hiddenLabel={true} 
                      variant="filled" 
                      size="small"
                      type={dataType !== undefined ? dataType : 'text'}
                      style={{width:330}}
                      onChange={onChange}
                      InputProps={{
                        disableUnderline: true,
                        endAdornment: (<InputAdornment position="end">
                                      <IconButton onClick={handleClickShowPassword}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                      </IconButton>
                                    </InputAdornment>)
                      }}
                      onKeyDown={onKeyDown}
                  ></TextField>
                }
    />)
}


function MyCheckBox({name, control, value,options}) {

  // const inputId = useContentId();
  return (
    <Controller name={name} 
                control={control}
                render={
                  ({ field: { onChange, value: val }, fieldState: { error } }) =>
                    <FormControl           
                      variant="filled" 
                      size="small"
                      error={error !== undefined}
                    >
                      <FormGroup row={true}>
                        {
                          options.map((option, index) => {
                            return (
                          <FormControlLabel
                                    key={`${option.value}`}
                                    label={option.label}
                                    control={
                                      <Checkbox
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                                        checked={value && value.includes(option.value) ? true : false}
                                        value={option.value}
                                        onChange={(event, checked) => {
                                          if (event.target.readOnly) {
                                            return false;
                                          } else {
                                            if (checked) {
                                              onChange([...(value || []), event.target.value]);
                                            } else {
                                              onChange(value.filter(
                                                (value) => value !== event.target.value
                                              ));
                                            }
                                          }
                                        }}
                                      />
                                    }
                                  />
                                ) //return
                              })
                            }
                          </FormGroup>
            </FormControl>
                }
    />)
}

function Login(props) {
  const classes = useLoginStyles();

  const [initMenu, getDefaultUrl] = useMenuStore(state => [state.initMenu, state.getDefaultUrl])
  const [toast, setToast] = useState(false);
  const [isLogin, login, passwordExpired] = useUserStore(state => [state.isLogin, state.login, state.passwordExpired])
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { control, getValues, setValue, watch } = useForm({
    defaultValues: {
      rememberme: []
    }
  });
  useEffect(() => {
    let rememberCheck = JSON.parse(localStorage.getItem('rememberCheck'));
    if (rememberCheck) {
      const username = localStorage.getItem('username');
      setValue('rememberme', ['true'])
      setValue('username', username)
    } else {
      setValue('rememberme', [''])
    }
  }, [])
  useEffect(() => {
    rememberUsername()
  }, [watch('rememberme')]);
  useEffect(() => {
    if (isLogin) {
      userStoreApi.getState().setUserInfo();
      // initMenu(uiSettings.mode, null)
      let defaultUrl = getDefaultUrl();
      props.history.push(defaultUrl);
    } else {
      if (passwordExpired) {
        props.history.push("/password");
      }
    }
  }, [isLogin, passwordExpired])

  function loginHandler() {
    rememberUsername()
    login({ username: getValues('username'), password: getValues('password'), }).then((res => {
      if (res) {
      } else {
        setToast(true)
      }
    }))
  }
  function rememberUsername() {
    if (getValues('rememberme').includes('true')) {
      localStorage.setItem('rememberCheck', true)
      localStorage.setItem('username', getValues('username'))
    } else {
      localStorage.setItem('rememberCheck', false)
      localStorage.setItem('username', '')
    }
  }
  function hideToast() {
    setToast(false)
  }
  return (
    <>
      <Box className={`login-main ${classes.loginBox}`}>
        <Box className={classes.loginContentBox}>
          <Box><img alt="T3SmaertSCM-Logo" src={"images/login/logo.png"} /></Box>
          <Box style={{padding:'4px'}}>
            <InputUser control={control} name="username" value={getValues('username')}></InputUser>
          </Box>
          <Box style={{padding:'4px'}}>
            <InputPasword control={control} 
                          name="password" 
                          dataType={showPassword ? 'text' : 'password'} 
                          onKeyDown={(e) => { if (e.key === 'Enter') { loginHandler() } }}
                          handleClickShowPassword={handleClickShowPassword} showPassword={showPassword} 
              />
            </Box>
          <Box style={{padding:'4px'}} ><MyCheckBox control={control} name="rememberme" value={getValues('rememberme')} options={[{ label: "Remember me", value: "true" }]}></MyCheckBox></Box>
          <Box><CommonButton type="text" variant="contained" title={"Sign in"} onClick={loginHandler} style={{ width: "330px", height: "40px", margin: '6px' }}></CommonButton></Box>
          <Box><Typography variant="h7" align="center" style={{ margin: "0 20px" }}>{"Copyright © " + new Date().getFullYear() + "."}</Typography></Box>
        </Box>
      </Box>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000} open={toast}
      >
        <Alert onClose={hideToast} variant="outlined" severity="error" sx={{ width: "100%" }}>
          {transLangKey('MSG_LOGIN_FAIL')}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Login;