import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box, IconButton } from "@mui/material";
import {
  InputField, useViewStore, useContentStore, useIconStyles, PopupDialog, SearchArea, SearchRow, BaseGrid, zAxios, CommonButton
} from '@wingui/common/imports';
import { ChromePicker } from 'react-color'
import { Square } from "@mui/icons-material";

function PopColorPicker(props) {
  const [registedColors, setRegistedColors] = useState([]);
  const { handleSubmit, getValues, control, watch, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      colorType: "R",
    }
  });
  const [pickNewColor, setPickedNewColor] = useState('#fff')
  const [colorType, setColorType] = useState('R');
  useEffect(() => {
    if (props.defaultPalette) {
      let li = []
      Object.keys(props.defaultPalette).forEach(key => {
        let o = {}
        o.label = key;
        o.value = key;
        o.color = props.defaultPalette[key]

        li.push(o)
      })
      setRegistedColors(li)
    }
  }, [props.defaultPalette])
  useEffect(() => {
    let colorType = getValues('colorType')
    setColorType(colorType)
  }, [watch('colorType'), watch('registedColor')]);
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
    props.onClose(false);
  }
  function handleChange(color, event) {
    setPickedNewColor(color)
  }
  function setPickColor(e) {
    if (colorType === 'R') {
      props.setInputColors((prevState) => {
        if(getValues('registedColor') !== null) {
          return { ...prevState, ...{ [props.colorKey]: getValues('registedColor').value } }
        } else {
          return { ...prevState}
        }
      });
    } else if (colorType === 'N') {
      props.setInputColors((prevState) => {
        return { ...prevState, ...{ [props.colorKey]: pickNewColor.hex } }
      });
    }
    props.onClose()
  }
  return (
    <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[]} onClick={handleSubmit(saveSubmit, onError)} title={transLangKey("SELECT_COLOR")} resizeHeight={colorType === 'R' ? 300 : 450} resizeWidth={400}>
      <Box sx={{ display: "flex", flexDirection: 'column', height:'100%' }}>
        <InputField name="colorType" type="radio" hiddenLabel options={[{ label: transLangKey('SELECT_REGISTED_COLOR'), value: 'R' }, { label: transLangKey('SELECT_NEW_COLOR'), value: 'N' }]} control={control} />
        {
          colorType === 'R' ?
            <InputField
              hiddenLabel inputType="labelText" name="registedColor" type="autocomplete"
              label={transLangKey('REGIST_COLOR')} style={{ width: '240px' }}
              disableClearable={true}
              ListboxProps={{ style: { maxHeight: 200 } }}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  <Square sx={{ color: option.color }} />{option.label}
                </Box>
              )}
              disablePortal={false}
              options={registedColors}
              readonly={false} disabled={false} control={control} />
            :
            <ChromePicker
              color={pickNewColor}
              onChange={handleChange}
            />
        }
      </Box>
      <Box sx={{ textAlign: "center", justifyContent: 'center', flexGrow: 1 }}>
        <CommonButton type="text" variant="contained" onClick={setPickColor}>{transLangKey("SELECT")}</CommonButton>
      </Box>
    </PopupDialog>
  );
}
export default PopColorPicker;