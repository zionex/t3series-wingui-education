import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { Grid, TextField, Button, Card, CardContent, Box } from '@mui/material';
import { InputField, zAxios } from "@wingui/common/imports";

const Password = forwardRef((props, ref) => {
  const { control, getValues, reset } = useForm({
    defaultValues: {
    }
  });

  const saveUserPassword = () => {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        zAxios({
          method: 'post',
          headers: { 'content-type': 'application/json' },
          url: 'system/users/password',
          data: getValues()
        })
          .then(function (response) {
            if (response.status === HTTP_STATUS.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), response.data.message, { close: false }, function (answer) {
                if (answer) {
                  reset({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  return;
                }
              })
            }
          })
          .catch(function (err) {
            showMessage(transLangKey('MSG_ERROR'), err.response.data.message, { close: false }, function (answer) {
              if (answer) {
                return;
              }
            });
          });
      }
    });
  }
  return (
    <Box display="flex" justifyContent="center" p={2}>
      <Box width="50%">
        <Card sx={{boxShadow:"none", border:"1px solid #ccc"}}>
          <CardContent>
            <form>
              <Box component="div" p={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <InputField inputType="text" control={control} labelWidth="110px" width="100%" dataType="password" label={transLangKey("USER_PW_NOW")} name="oldPassword" ></InputField>
                      </Grid>
                      <Grid item xs={12}>
                        <InputField inputType="text" control={control} labelWidth="110px" width="100%" dataType="password" label={transLangKey("USER_PW_INPUT")} name="newPassword" ></InputField>
                      </Grid>
                      <Grid item xs={12}>
                        <InputField inputType="text" control={control} labelWidth="110px" width="100%" dataType="password" label={transLangKey("USER_PW_INPUT_RE")} name="confirmPassword" ></InputField>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </CardContent>
        </Card>
        <Box sx={{ marginTop: '16px', display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={saveUserPassword}> {transLangKey('SAVE')} </Button>
        </Box>
      </Box>
    </Box>
  )
});

export default Password;