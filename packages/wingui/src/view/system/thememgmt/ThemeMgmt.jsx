import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { Box, ButtonGroup, InputAdornment, TextField, Typography } from "@mui/material";
import {
  ContentInner, WorkArea, SplitPanel, VLayoutBox, HLayoutBox, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchArea, SearchRow, InputField, BaseGrid,
  CommonButton, GridAddRowButton, GridDeleteRowButton, GridSaveButton, useViewStore, useContentStore, zAxios
} from "@wingui/common/imports";

import PopColorPicker from "./PopColorPicker";
import PropertiesPanel from "./PropertiesPanal";

function ThemeColorInput(props) {
  let [value, setValue] = useState('')
  let [hexCode, setHexCode] = useState('')
  useEffect(() => {
    if (Object.keys(props.inputColors).length > 0) {
      if (props.inputColors[props.label] && props.inputColors[props.label].includes('--')) {
        setValue(props.inputColors[props.label])
        setHexCode(props.inputColors[props.inputColors[props.label]])
      } else {
        setValue(props.inputColors[props.label])
        setHexCode(props.inputColors[props.label])
      }
    }
  }, [props.inputColors])
  useEffect(() => {
    props.handleChange(props.label, value)
  }, [value])
  function getContrastColor(hexcolor) {
    let color = '';
    if (hexcolor && hexcolor.includes('#')) {
      let r = parseInt(hexcolor.substring(1, 3), 16);
      let g = parseInt(hexcolor.substring(3, 5), 16);
      let b = parseInt(hexcolor.substring(5, 7), 16);
      let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      color = (yiq >= 128) ? '#000' : '#fff'
    } else {
      color = "#000"
    }
    return color;
  }

  return (
    <TextField
      variant="filled"
      label={props.label}
      id="filled-start-adornment"
      disabled={true}
      sx={{ m: 1, width: '220px', '& .MuiFilledInput-input.Mui-disabled': { WebkitTextFillColor: getContrastColor(hexCode) }, '& .MuiInputLabel-root.Mui-disabled': { color: getContrastColor(hexCode) }, '& .MuiFilledInput-root.Mui-disabled': { backgroundColor: hexCode } }}
      value={value}
      InputProps={{
        disableUnderline: true,
        endAdornment: (
          <InputAdornment position='end'>
            <CommonButton title={transLangKey("SELECT_COLOR")}>
              <Icon.Search stroke={getContrastColor(hexCode)} onClick={props.clickActionButton} />
            </CommonButton>
          </InputAdornment>
        )
      }}
    />
  )
}

function ThemeMgmt() {
  const activeViewId = getActiveViewId()
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])
  const [dialogOpen, setDialogOpen] = useState(false);
  const [colorsChanges, setColorsChanges] = useState([])
  const [orgPaletteColors, setOrgPaletteColors] = useState([])
  const [inputColors, setInputColors] = useState({});
  const [defaultPalette, setDefaultPalette] = useState({});
  const [colorKey, setColorKey] = useState('');
  const [selectOptions, setSelectOptions] = useState([]);

  const themeMode = localStorage.getItem('themeMode');
  useEffect(() => {
    if (themeMode) {
      resetConditions(themeMode);
    }
  }, [themeMode]);

  const { control, getValues, setValue, watch } = useForm({
    defaultValues: {
    }
  });
  const [propsDataPanel, setPropsDataPanel] = useState(false)
  function loadThemes() {
    zAxios.get('system/themes').then(function (res) {
      let resultData = JSON.stringify(res.data);
      let result = [];
      $.each(JSON.parse(resultData), function (idx, obj) {
        result.push({ label: transLangKey(obj.themeCd), value: obj.themeCd })
      });
      setSelectOptions(result);
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
    });
  }
  const globalButtons = [
    { name: "search", action: (e) => { loadMainData() }, visible: true, disable: false },
    {
      name: "openPanel",
      title: "OPEN_PANEL",
      iconName: 'Grid',
      action: (e) => { openPanel() },
      visible: true, disable: false
    }
  ];
  useEffect(() => {
    loadThemes()
    setViewInfo(activeViewId, 'globalButtons', globalButtons);
    loadMainData()
  }, [])

  function resetConditions(themeMode) {
    setValue('themeCd', themeMode)
  }
  const openPanel = () => {
    setPropsDataPanel((previousOpen) => !previousOpen)
  }
  function loadMainData() {
    zAxios.get('system/themes/' + getValues('themeCd'))
      .then(function (res) {
        let palette = {}
        let defaultPalette = {}
        let orgPalette = []
        res.data.forEach((re) => {
          if (re.category == 'palette') {
            palette[re.referCd] = re.propValue
            orgPalette.push(re)
          }
          if (re.category == 'palette' && re.defaultYn) {
            defaultPalette[re.referCd] = re.propValue
          }
        })
        setDefaultPalette(defaultPalette)
        setInputColors(palette)
        setOrgPaletteColors(orgPalette)
      }).catch(function (err) {
        console.log(err);
      }).then(function () {
      });
  }
  const handleChange = (key, color) => {
    let li = colorsChanges
    orgPaletteColors.forEach(palette => {
      if (palette.referCd === key && palette.themeCd === getValues('themeCd')) {
        palette.propValue = color
        let index = li.findIndex(l => l.referCd === key && l.themeCd === getValues('themeCd'))
        if (index >= 0) {
          li[index] = palette
        } else {
          li.push(palette)
        }
      }
    })
    setColorsChanges(li);
  }
  function saveBaseThemeData() {
    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: 'system/themes/' + getValues('themeCd'),
      data: colorsChanges
    }).catch(function (error) {
      console.log(error);
    }).then(function () {
      setColorsChanges([]);
    });
  }
  function clickActionButton(key, e) {
    setDialogOpen(true)
    setColorKey(key)
  }
  return (
    <>
      <ContentInner>
        <WorkArea>
          <SearchArea>
            <SearchRow>
              <InputField control={control} label={transLangKey("THEME_CD")} name="themeCd" type="select" options={selectOptions} rules={{}} onKeyDown={(e) => { if (e.key === 'Enter') { onSubmit() } }}></InputField>
            </SearchRow>
          </SearchArea>
          <ResultArea sizes={[25, 30, 25]} direction={"vertical"}>
            <Box id="mainPalette">
              <ButtonArea title={"Brand Colors"} >
                <LeftButtonArea />
                <RightButtonArea>
                  <CommonButton title={transLangKey('RESET')} onClick={loadMainData}><Icon.RefreshCcw /></CommonButton>
                  <CommonButton title={transLangKey('SAVE')} onClick={saveBaseThemeData}><Icon.Save /></CommonButton>
                </RightButtonArea>
              </ButtonArea>
              <Box id="colorInputs">
                <Box style={{ display: 'flex', padding: '8px' }}>
                  <Box>
                    <ThemeColorInput label={'--palette-base-colorA'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-base-colorA', e)} />
                    <ThemeColorInput label={'--palette-base-colorB'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-base-colorB', e)} />
                    <ThemeColorInput label={'--palette-base-colorC'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-base-colorC', e)} />
                  </Box>
                  <Box>
                    <ThemeColorInput label={'--palette-base-colorD'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-base-colorD', e)} />
                    <ThemeColorInput label={'--palette-base-colorE'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-base-colorE', e)} />
                    <ThemeColorInput label={'--palette-base-colorF'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-base-colorF', e)} />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box id="statusColors">
              <ButtonArea title={"Status Colors"} >
                <LeftButtonArea />
                <RightButtonArea>
                  <CommonButton title={transLangKey('RESET')} onClick={loadMainData}><Icon.RefreshCcw /></CommonButton>
                  <CommonButton title={transLangKey('SAVE')} onClick={saveBaseThemeData}><Icon.Save /></CommonButton>
                </RightButtonArea>
              </ButtonArea>
              <Box id="statusColorInputs">
                <Box style={{ display: 'flex', padding: '8px' }}>
                  <Box style={{ paddingRight: '12px' }}>
                    <ThemeColorInput label={'--palette-error-light'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-error-light', e)} />
                    <ThemeColorInput label={'--palette-error-normal'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-error-normal', e)} />
                    <ThemeColorInput label={'--palette-error-strong'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-error-strong', e)} />
                  </Box>
                  <Box>
                    <ThemeColorInput label={'--palette-warning-light'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-warning-light', e)} />
                    <ThemeColorInput label={'--palette-warning-normal'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-warning-normal', e)} />
                    <ThemeColorInput label={'--palette-warning-strong'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-warning-strong', e)} />
                  </Box>
                </Box>
                <Box style={{ display: 'flex', padding: '8px' }}>
                  <Box style={{ paddingRight: '12px' }}>
                    <ThemeColorInput label={'--palette-confirm-light'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-confirm-light', e)} />
                    <ThemeColorInput label={'--palette-confirm-normal'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-confirm-normal', e)} />
                    <ThemeColorInput label={'--palette-confirm-strong'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-confirm-strong', e)} />
                  </Box>
                  <Box>
                    <ThemeColorInput label={'--palette-success-light'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-success-light', e)} />
                    <ThemeColorInput label={'--palette-success-normal'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-success-normal', e)} />
                    <ThemeColorInput label={'--palette-success-strong'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-success-strong', e)} />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box id="muiPalette">
              <ButtonArea title={"Mui Palette: button, Input, dropdown, dialog ,,"} >
                <LeftButtonArea />
                <RightButtonArea>
                  <CommonButton title={transLangKey('RESET')} onClick={loadMainData}><Icon.RefreshCcw /></CommonButton>
                  <CommonButton title={transLangKey('SAVE')} onClick={saveBaseThemeData}><Icon.Save /></CommonButton>
                </RightButtonArea>
              </ButtonArea>
              <Box id="muicolorInputs">
                <Box style={{ display: 'flex', padding: '8px' }}>
                  <ThemeColorInput label={'--palette-primary-main'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-primary-main', e)} />
                  <ThemeColorInput label={'--palette-primary-light'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-primary-light', e)} />
                  <ThemeColorInput label={'--palette-primary-dark'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-primary-dark', e)} />
                  <ThemeColorInput label={'--palette-primary-contrastText'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-primary-contrastText', e)} />
                </Box>
                <Box style={{ display: 'flex', padding: '8px' }}>
                  <ThemeColorInput label={'--palette-secondary-main'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-secondary-main', e)} />
                  <ThemeColorInput label={'--palette-secondary-light'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-secondary-light', e)} />
                  <ThemeColorInput label={'--palette-secondary-dark'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-secondary-dark', e)} />
                  <ThemeColorInput label={'--palette-secondary-contrastText'} inputColors={inputColors} handleChange={handleChange} clickActionButton={(e) => clickActionButton('--palette-secondary-contrastText', e)} />
                </Box>
              </Box>
            </Box>
          </ResultArea>
          <PopColorPicker colorKey={colorKey} defaultPalette={defaultPalette} open={dialogOpen} onClose={() => setDialogOpen(false)} setInputColors={setInputColors} ></PopColorPicker>
        </WorkArea>
        {
          propsDataPanel && <PropertiesPanel openPanel={propsDataPanel} themeMode={getValues('themeCd')} onClose={() => setPropsDataPanel(false)} />
        }
      </ContentInner>
    </>
  );
}

export default ThemeMgmt
