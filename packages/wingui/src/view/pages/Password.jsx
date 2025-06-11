import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputField, CommonButton, zAxios, useUserStore,userStoreApi } from "@wingui/common/imports";
import { transLangKey } from "@zionex/wingui-core/lang/i18n-func";
import { useMenuStore } from "@zionex/wingui-core/store/contentStore";
import { uiSettings } from "@wingui/common/uiSettings";
import { existLangValue } from "@zionex/wingui-core";

const PasswordBox = {
  display: 'flex', justifyContent: 'center',
  alignItems: 'center', background: '#f6f6f6 !important',
  width: '100%'
}
const PasswordContentBox = {
  display: 'flex',
  alignItems: 'left',
  flexDirection: 'column',
  justifyContent: 'center',
  background: '#fff !important',
  width: '940px',
  padding: '35px'
}

function Password(props) {
  const [initMenu] = useMenuStore(state => [state.initMenu])
  const [isLogin, setIsLogin] = useUserStore(state => [state.isLogin, state.setIsLogin])
  const [helperText, setHelperText] = useState({
    required: transLangKey('PW_ERROR_MSG_0012'),
    confirmPassword: transLangKey('PW_ERROR_MSG_0013')
  })
  const [helperPolicyText, setHelperPolicyText] = useState(transLangKey('PW_ERROR_MSG_0012'))
  const [passwordTitle, setPasswordTitle] = useState('you need to change the password for your account.')
  const [errorPassword, setErrorPassword] = useState(false)
  const [passwordRule, setPasswordRule] = useState()
  const [username] = useUserStore(state => [state.username])
  const { control, getValues, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });
  function loadPasswordRule() {
    zAxios.get('/password-rule')
      .then(function (res) {
        setPasswordRule(res.data);
        setHelperPolicyText(res.data)
      })
      .catch(function (err) {
        console.log(err);
      })
  }
  function savePassword() {
    let param = {
      newPassword: getValues('password'),
      confirmPassword: getValues('confirmPassword')
    }

    zAxios.post('system/users/password/init', param, {
      errorMessage: false
    })
      .then(res => {
        if (res.data.status === 200) {
          setErrorPassword(false)
          setIsLogin(true)
        }
      }).catch((error) => {
        if (error.response.data.status === 400) {
          setHelperPolicyText(error.response.data.message + "\n" +passwordRule);
          setErrorPassword(true)
        }
      })
  }
  useEffect(() => {
    setValue('username', username);
    loadPasswordRule()
    if (existLangValue('PASSWORD_TITLE_MSG')) {
      setPasswordTitle(transLangKey('PASSWORD_TITLE_MSG'))
    }
  }, [])
  useEffect(() => {
    if (isLogin) {
      userStoreApi.getState().setUserInfo();
      initMenu(uiSettings.mode)

      props.history.push("/home");
    }
  }, [isLogin])
  return (<>
    <Box className="main" sx={PasswordBox}>
      <Box sx={PasswordContentBox}>
        <Box sx={{ fontSize: '35px', marginBottom: '15px', borderRadius: '16px' }}>
          <Typography variant="h4" style={{ color: '#4682b4' }}>{passwordTitle}</Typography>
        </Box>
        <Box><InputField control={control} label={transLangKey("USER_ID")} name="username" disabled={true} width="420px"></InputField></Box>
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <InputField control={control} dataType='password' label={transLangKey("PASSWORD")} name="password"
            error={errorPassword} rules={{ required: true }}
            validationText={helperPolicyText} width="420px"></InputField>
        </Box>
        <Box>
          <InputField control={control} dataType='password' label={transLangKey("CONFIRM_PASSWORD")} name="confirmPassword"
            rules={{ required: true, validate: { confirmPassword: value => value === getValues('password') } }}
            validationText={helperText} width="420px">
          </InputField>
        </Box>
        <Box><CommonButton type="text" variant="contained" title={"Save Password"} onClick={handleSubmit(savePassword)} style={{ width: "420px", height: "40px", margin: '6px' }}></CommonButton></Box>
      </Box>
    </Box>
  </>
  )
}

export default Password;