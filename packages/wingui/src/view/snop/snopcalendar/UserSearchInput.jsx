import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Autocomplete, Chip, Avatar,
  Button, IconButton,
  InputAdornment, Popover,
  TextField, Tooltip,
  List, ListItem, ListItemButton,
  Box, FormControl, Select, MenuItem
} from "@mui/material";
import { CommonButton } from "@wingui/common/imports";
import { blue } from "@mui/material/colors";
import { transLangKey } from "@wingui";

import PopUserSearch from "./PopUserSearch";
import InputField from "@zionex/wingui-core/component/input/InputField";

const searchAreaPosition = getAppSettings("layout").searchArea;
const defStyles = {
  width: 260,
  display: "block",
};
const maxTags = 10; // Maximum number of searchable items
const attributes = [...Array(25).keys()].map(key => (key < 9 ? "0" : "") + (key + 1).toString()).map((id) => ("ITEM_ATTR_" + id));  // define item attributes

export function UserSearchInput(props, ref) {

  const [popUserSearchOpen, setPopUserSearchOpen] = useState(false);
  const [attr, setAttr] = useState(attributes[0]);
  const buttonRef = useRef(null);
  const keyItem = "id"
  const displayItem = "displayName"
  const { reset, control, getValues, setValue, watch } = useForm({
    defaultValues: {
      USERNAME: []
    },
  });

  // return function
  useImperativeHandle(ref, () => ({
    getItem() {
      let arr = getValues("USERNAME");
      let rs = arr.map((r) => {
        if (typeof r === "object") {
          return JSON.stringify(r);
        } else {
          let obj = {};
          obj[displayItem] = r;
          return JSON.stringify(obj);
        }
      });
      return "[" + rs.toString() + "]";
    },
    getLevelId() {
      const val = getValues("LV_MGMT_ID");
      return (val === undefined ? "" : val);
    },
    setItem(value, key = displayItem) {
      let obj = {};
      obj[key] = value;
      setValue("USERNAME", [obj]);
    },

    reset() {
      reset();
      popRefresh();
    },
  }));


  useEffect(() => {
    // console.log("USERNAME =>", getValues("USERNAME"));
    if (watch("USERNAME").length === 0) {
      popRefresh();
    }
  }, [watch("USERNAME")]);


  const popRefresh = () => {
    const popoverFields = getPopOverFields();
    for (let i = 0, n = popoverFields.length; i < n; i++) {
      setValue("POP_" + popoverFields[i], "");
    }
  };

  const onSetItemCd = (items) => {
    const itemLength = items.length;
    if (itemLength === 0) return;
    let itemCodeParam = [];

    let itemKeys = [keyItem, displayItem];

    for (let i = 0, n = itemLength; i < n; i++) {
      if (i > maxTags) {
        break;
      }
      let item = items[i];
      let obj = {};
      for (let j = 0, m = itemKeys.length; j < m; j++) {
        let keyIdx = itemKeys[j];
        if (item[keyIdx]) { //item
          obj[keyIdx] = item[keyIdx];
        }
        // else { // item level
        //   const lvItemKey = keyIdx.replace("USERNAME", "ITEM_LV");
        //   obj[keyIdx] = item[lvItemKey]; //displayItem <= lvItemKey
        // }
      }
      itemCodeParam.push(obj);
    }

    setValue("USERNAME", itemCodeParam);
    // setValue("LV_MGMT_ID", items[0]["LV_MGMT_ID"]);
    popRefresh();
  }


  const getPopOverFields = () => {
    let popoverFields = ["username", "displayName"];
    if (props.hasAttr) popoverFields.push(attr);
    return popoverFields;
  }


  const validation = () => {
    return watch("USERNAME").length > maxTags
  }


  const getPopUserSearch = () => {
    return (popUserSearchOpen && <PopUserSearch
      id="DpItemPopup"
      open={popUserSearchOpen}
      onClose={() => {
        setPopUserSearchOpen(false);
      }}
      confirm={onSetItemCd}
      empNo={props.userId}
      authTpId={props.authTypeId} // undefined or specific authority types
      multiple={!props.isSingular}
    />)
  }

  return (
    <>
      <InputField type='custom' {...props}
        name="userName"
        inputComponent={
          ({
            defInputWidth, defInputHeight,variant,size,
            setPreferredWidth,
            setPreferredHeight,
            label,
            value,
            options,
            onChange,
            InputProps,
            error,
            languageCode,
            searchPosition,
            locale,
            ...props })=> {
                useEffect(()=>{
                  setPreferredWidth(260)
                },[])
                  return (
                    <Autocomplete
                      sx={{width: 260,
                          "& .MuiInputAdornment-positionEnd": {
                            position: "absolute",
                            right: 5,
                            top: '50%',
                          },
                      }}
                      variant={variant}
                      open={false}
                      // readOnly={true}
                      size={size}
                      freeSolo
                      readOnly={props.isOnlyPopupSelect}
                      multiple
                      renderTags={(tag, props) =>
                        tag.map((option, index) => (
                          <Tooltip arrow key={index} title={typeof option === "string" ? transLangKey(displayItem) + " : " + option
                            : (Object.keys(option).map((key) => (transLangKey(key) + " : " + option[key])).toString())} >
                            <Chip size={"small"} style={{ maxWidth: 140 }}
                              avatar={<Avatar sx={{ bgcolor: blue[100] }} style={{ width: 16, height: 16 }}>
                                {(typeof option === "string" ? displayItem : Object.values(option)[1]).substr(0, 1)}
                              </Avatar>}
                              label={typeof option === "string" ? option : option[Object.keys(option)[1]]} {...props({ index })}
                              color={"primary"} variant={"outlined"} 
                              //disabled={false}
                              />
                          </Tooltip>))
                      }
                      renderInput={(params) => 
                          <TextField 
                            variant={variant}
                            label={transLangKey("ATTENDEE")}
                            size={size}
                            ref={buttonRef} 
                            {...params}
                            error={validation()} 
                            helperText={validation() ? transLangKey("MSG_SEARCH_INPUT") : ""}
                            InputProps={{
                              ...params.InputProps,
                              disableUnderline: true,
                              endAdornment: (
                                <InputAdornment position='end'>
                                  <CommonButton title={transLangKey("INPUT_POP_OPEN")} onClick={() => setPopUserSearchOpen(true)}>
                                    <Icon.Search />
                                  </CommonButton>
                                </InputAdornment>
                              )
                            }}
                          />}
                      onChange={(e, val) => {
                        if (props.isSingular) {
                          if (val.length <= 1 || e.type === "click") {
                            setValue("USERNAME", val);
                          }
                        } else if (val.length <= maxTags + 1) {
                          setValue("USERNAME", val);
                        }
                      }}
                      defaultValue={[]}
                      value={watch("USERNAME")}
                      options={watch("USERNAME")}
                      limitTags={1}
                      disableClearable
                      getOptionLabel={(option) => typeof option === "string" ? option : option[Object.keys(option)[0]]}
                    />
                  );
              }
        }
    />
      {getPopUserSearch()}
    </>
  )
}

export default forwardRef(UserSearchInput);