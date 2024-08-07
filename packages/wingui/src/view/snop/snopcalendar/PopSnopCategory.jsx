import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Grid } from '@mui/material';
import { PopupDialog, InputField, zAxios } from '@wingui/common/imports';
import { MuiColorInput } from 'mui-color-input'

function PopSnopCategory(props) {
  const [categoryColor, setCatgColor] = useState();
  const { handleSubmit, reset, control, getValues, setValue, watch, register, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      category: props.editProps.categoryId ? props.editProps.categoryId : "",
      grpShareYn: ['']
    }
  });
  const colorTextStyle = {
    marginLeft: 7.5,
    fontSize: 12
  }
  const colorInputStyle = {
    marginLeft: 7.5
  }

  const handleChange = (color) => {
    setCatgColor(color);
  }

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  const saveSubmit = () => {
    const data = {
      categoryNm: getValues('categoryName'),
      categoryColor: categoryColor,
      grpShareYn: getValues('grpShareYn').includes('Y') ? true : false
    };
    let formData = new FormData();
    formData.append('changes', JSON.stringify(data));

    zAxios({
      method: 'post',
      url: 'calendar-category',
      data: formData
    })
      .then(function (response) {
        props.confirm();
        props.onClose(false);
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title={transLangKey('ADD_CATEGORY')} resizeHeight={310} resizeWidth={280}>
        <Box style={{ marginTop: '3px', width: '100%', height: '100%' }}>
          <Box sx={{ height: "calc(100% - 50px)" }}>
            <Grid container direction="column">
              <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '100%' }}>
                <InputField name='categoryName' label={transLangKey('CATEGORY_NM')} control={control} />
              </Grid>
              <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '50%' }}>
                <Box>
                  <span style={colorTextStyle}>{transLangKey('CATEGORY_COLOR')}</span>
                  <MuiColorInput format="hex" style={colorInputStyle} value={categoryColor} onChange={handleChange} />
                </Box>
              </Grid>
              <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '50%' }}>
                <InputField type="check" name="grpShareYn" control={control} options={[{ label: transLangKey('GROUP_SHARE'), value: 'Y' }]} />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </PopupDialog>
    </>
  );
}

export default PopSnopCategory;
