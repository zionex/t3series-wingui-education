import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useHistory } from 'react-router-dom';
import { useUserStore } from "@zionex/wingui-core/store/userStore";
import { useForm } from "react-hook-form";
import { Grid, TextField, Button, Card, CardContent, Box } from '@mui/material';
import { InputField, zAxios } from "@wingui/common/imports";

const Info = forwardRef((props, ref) => {
  const [username] = useUserStore(state => [state.username])
  const history = useHistory();
  const { control, getValues, reset } = useForm({
    defaultValues: {
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    zAxios.get('system/users/' + username, { waitOn: false })
      .then(function (res) {
        if (res.status === HTTP_STATUS.SUCCESS) {
          reset(res.data);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const saveUserInfo = () => {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        zAxios({
          method: 'post',
          headers: { 'content-type': 'application/json' },
          url: 'system/users/' + username,
          data: getValues()
        })
          .then(function (response) {
            if (response.status === HTTP_STATUS.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), response.data.message, { close: false }, function (answer) {
                if (answer) {
                  history.go(0);
                }
              });
            }
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    });
  }
  return (
    <Box display="flex" justifyContent="center" p={2}>
      <Box width="50%">
        <Card sx={{boxShadow:"none", border:"1px solid #ccc"}}>
          <CardContent>
            <Box component="div" p={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <InputField inputType="text" control={control} width="100%" readonly={true} label={transLangKey("USER_ID")} name="username" ></InputField>
                    </Grid>
                    <Grid item xs={12}>
                      <InputField inputType="text" control={control} width="100%" label={transLangKey("UNIQUE_VALUE")} name="uniqueValue" ></InputField>
                    </Grid>
                    <Grid item xs={12}>
                      <InputField inputType="text" control={control} width="100%" label={transLangKey("DEPARTMENT")} name="department" ></InputField>
                    </Grid>
                    <Grid item xs={12}>
                      <InputField inputType="text" control={control} width="100%" label={transLangKey("BUSINESS")} name="businessValue" ></InputField>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={4} container alignItems="center" justifyContent="center">
                  <img src={"images/common/user.png"} alt="User" style={{ width: '180px' }} />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ marginTop: '16px', boxShadow:"none", border:"1px solid #ccc" }}>
          <CardContent>
            <Box component="div" p={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Grid item xs={12}>
                    <InputField inputType="text" control={control} width="100%" label={transLangKey("USER_NAME")} name="displayName" ></InputField>
                  </Grid>
                  <Grid item xs={12}>
                    <InputField inputType="text" control={control} width="100%" label={transLangKey("EMAIL")} name="email" ></InputField>
                  </Grid>
                  <Grid item xs={12}>
                    <InputField inputType="text" control={control} width="100%" label={transLangKey("PHONE")} name="phone" ></InputField>
                  </Grid>
                  <Grid item xs={12}>
                    <InputField inputType="text" control={control} width="100%" label={transLangKey("etc")} name="etc" ></InputField>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
        <Box sx={{ marginTop: '16px', display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={saveUserInfo}> {transLangKey('SAVE')} </Button>
        </Box>
      </Box>
    </Box>
  )
});

export default Info;