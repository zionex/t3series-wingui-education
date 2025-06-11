import React, { useState, useEffect, useRef } from "react";
import { transLangKey } from "@wingui";
import {
  Box, ButtonGroup, IconButton, Tooltip, ToggleButtonGroup, ToggleButton, InputLabel, FormControl
  , TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell, TextField, MenuItem, Select, NativeSelect
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material/styles';
import { DeleteForever, Add, Save, EditOff, Edit, SubdirectoryArrowLeft } from '@mui/icons-material';
import { useForm, Controller } from "react-hook-form";
import './SchedulerJobMgmt.css';
import {
  ContentInner,
  WorkArea,
  ResultArea,
  ButtonArea,
  LeftButtonArea,
  RightButtonArea,
  InputField,
  GridDeleteRowButton,
  BaseGrid,
  useViewStore,
  useUserStore,
  zAxios,
  useSearchPositionStore
} from "@wingui/common/imports";
import { useInputStyles } from "@zionex/wingui-core/style/DefCommonStyle";

const grid1Items = [
  { name: "jobGroup", dataType: "text", headerText: "UI_SCHEDULER_JOB_GROUP", visible: true, editable: false, width: 50 },
  { name: "jobName", dataType: "text", headerText: "UI_SCHEDULER_JOB_NAME", visible: true, editable: false, width: 150 },
  { name: "descrip", dataType: "text", headerText: "UI_SCHEDULER_JOB_DESC", visible: true, editable: false, width: 200 },
  { name: "status", dataType: "text", headerText: "UI_SCHEDULER_JOB_STATUS", lang: true, visible: true, editable: false, width: 100 },
  { name: "useYn", dataType: "boolean", headerText: "USE_YN", visible: true, editable: true, width: 50, defaultValue: true },
  { name: 'action', headerText: 'EXEC', dataType: 'text', width: '80', editable: false, renderer: 'executeButton' },
  { name: "timeZoneId", dataType: "text", headerText: "UI_SCHEDULER_JOB_TIME_ZONE", visible: true, editable: false, width: 120 },
  { name: "startDate", dataType: "datetime", headerText: "UI_SCHEDULER_JOB_START_AT", visible: true, editable: false, width: 140 },
  { name: "endDate", dataType: "datetime", headerText: "UI_SCHEDULER_JOB_END_AT", visible: true, editable: false, width: 140 },
  { name: "prevFireAt", dataType: "datetime", headerText: "UI_SCHEDULER_JOB_PREV_FIRE_AT", visible: true, editable: false, width: 140 },
  { name: "nextFireAt", dataType: "datetime", headerText: "UI_SCHEDULER_JOB_NEXT_FRIE_AT", visible: true, editable: false, width: 140 },
  { name: 'createBy', dataType: 'text', headerText: 'CREATE_BY', visible: true, editable: false, width: 100 },
  { name: 'createDttm', dataType: 'datetime', headerText: 'CREATE_DTTM', visible: true, editable: false, width: 140 },
  { name: 'modifyBy', dataType: "text", headerText: 'MODIFY_BY', visible: true, editable: false, width: 100 },
  { name: 'modifyDttm', dataType: "datetime", headerText: 'MODIFY_DTTM', visible: true, editable: false, width: 140 },
  // visible : false
  { name: "jobData", dataType: "text", headerText: "jobData", visible: false, editable: false, width: 50 },
  { name: "jobCode", dataType: "text", headerText: "jobCode", visible: false, editable: false, width: 50 },
  { name: "jobDataObj", dataType: "data", headerText: "jobDataObj", visible: false, editable: false, width: 50 },
  { name: "attrObj", dataType: "data", headerText: "attrObj", visible: false, editable: false, width: 50 },
  { name: "jobClass", dataType: "text", headerText: "jobClass", visible: false, editable: false, width: 50 },
  { name: "cron", dataType: "text", headerText: "cron", visible: false, editable: false, width: 50 },
  { name: "triggerState", dataType: "text", headerText: "triggerState", visible: false, editable: false, width: 50 },
  { name: "startAt", dataType: "text", headerText: "UI_SCHEDULER_JOB_START_AT", visible: false, editable: false, width: 140 },
  { name: "endAt", dataType: "text", headerText: "UI_SCHEDULER_JOB_END_AT", visible: false, editable: false, width: 140 },
  { name: "id", dataType: "text", headerText: "id", visible: false, editable: false, width: 50 },
  { name: "btnActive", dataType: "boolen", headerText: "btnActive", visible: false, editable: false, width: 50 }
];

const cronMonthArr = [
  { label: transLangKey("UI_SCHEDULER_JOB_MONTHLY"), value: "*" }, { label: transLangKey("CALENDAR_JAN"), value: "1" }, { label: transLangKey("CALENDAR_FEB"), value: "2" }, { label: transLangKey("CALENDAR_MAR"), value: "3" },
  { label: transLangKey("CALENDAR_APR"), value: "4" }, { label: transLangKey("CALENDAR_MAY"), value: "5" }, { label: transLangKey("CALENDAR_JUN"), value: "6" }, { label: transLangKey("CALENDAR_JUL"), value: "7" }, { label: transLangKey("CALENDAR_AUG"), value: "8" },
  { label: transLangKey("CALENDAR_SEP"), value: "9" }, { label: transLangKey("CALENDAR_OCT"), value: "10" }, { label: transLangKey("CALENDAR_NOV"), value: "11" }, { label: transLangKey("CALENDAR_DEC"), value: "12" }
];

const cronWeekArr = [
  { label: transLangKey("UI_SCHEDULER_JOB_WEEKLY"), value: "" }, { label: transLangKey("UI_SCHEDULER_JOB_WEEK_1"), value: "#1" }, { label: transLangKey("UI_SCHEDULER_JOB_WEEK_2"), value: "#2" }, { label: transLangKey("UI_SCHEDULER_JOB_WEEK_3"), value: "#3" },
  { label: transLangKey("UI_SCHEDULER_JOB_WEEK_4"), value: "#4" }, { label: transLangKey("UI_SCHEDULER_JOB_WEEK_5"), value: "#5" },
];

const cronDayOfWeekArr = [
  { label: transLangKey("UI_SCHEDULER_JOB_DAY_OF_WEEK_SUN"), value: "1" }, { label: transLangKey("UI_SCHEDULER_JOB_DAY_OF_WEEK_MON"), value: "2" }, { label: transLangKey("UI_SCHEDULER_JOB_DAY_OF_WEEK_TUES"), value: "3" },
  { label: transLangKey("UI_SCHEDULER_JOB_DAY_OF_WEEK_WED"), value: "4" }, { label: transLangKey("UI_SCHEDULER_JOB_DAY_OF_WEEK_THURS"), value: "5" }, { label: transLangKey("UI_SCHEDULER_JOB_DAY_OF_WEEK_FRI"), value: "6" },
  { label: transLangKey("UI_SCHEDULER_JOB_DAY_OF_WEEK_SAT"), value: "7" }
];

const cronDayArr = [
  { label: transLangKey("UI_SCHEDULER_JOB_DAILY"), value: "*" }, { label: transLangKey("UI_SCHEDULER_JOB_DAY_1"), value: "1" },
];

const cronDaySelectArr = [...Array(31).keys()].map(key => {
  return { label: String(key + 1), value: String(key + 1) }
});

cronDaySelectArr.unshift({ label: "*", value: "*" });

function SchedulerJobMgmt(props) {
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);
  const [setSearchPosition] = useSearchPositionStore(state => [state.setSearchPosition])
  const activeViewId = getActiveViewId()
  const classes = useInputStyles(props);
  const [serviceUri, setServiceUri] = useState("");
  const [serverInfo, setServerInfo] = useState({});
  const [jobClassArr, setJobClassArr] = useState([]);
  const [timeZoneId, setTimeZoneId] = useState("");
  const [insert, setInsert] = useState(false);
  const [edit, setEdit] = useState(false);
  const [jobDataArr, setJobDataArr] = useState([]);

  const { reset, control, getValues, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      jobGroup: "",
      jobName: "",
      jobDescription: "",
      jobStatus: "",
      cronMonth: "*",
      cronWeek: "",
      cronDayOfWeek: "",
      cronDay: "",
      cronTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0),
      cronTimeError: false,
      cronText: "",
      cronTextKeyPress:false,
      jobClass: "",
      startDate: new Date(),
      endDate: null,
      timeZoneId: timeZoneId
    },
  });

  const globalButtons = [
    {
      name: "search",
      action: () => {
        loadGridData();
      },
      visible: true,
      disable: false,
    },
  ];

  const jobDataFunObj = {
    "SERVICE_CHANGE": function (e, data, inx) {
      let server = serverInfo[e.target.value.toLowerCase()];
      let uri = serviceUri;
      let hostEl = document.getElementById("jobDataValue_" + String(inx + 1));
      let portEl = document.getElementById("jobDataValue_" + String(inx + 2));
      let uriEL = document.getElementById("jobDataValue_" + String(inx + 3));

      if (server) {
        hostEl.value = server["host"];
        portEl.value = server["port"];
      } else {
        hostEl.value = null;
        portEl.value = null;
      }

      uriEL.value = (e.target.value.toLowerCase() !== "fp" && server && uri) ? uri : null;
    }
  }

  const labelFontStyle = { fontWeight: "normal", color: "#363636" };
  const textFieldStyle = {
    width: "250px",
    height: "35px",
    margin: "3.5px 3.5px",
    padding: 0,
    "& .MuiInputBase-input": {
      width: "250px",
      height: "25px",
      margin: 0,
      padding: "0px 12px"
    }
  }

  const jobGropDisabled = !insert;
  const jobNameDisabled = !insert;
  const jobDescDisabled = (!edit && !insert);
  const dateRangeDisabled = (!edit && !insert)
  const monthDisabled = !edit && !insert ? true : false;
  const weekDisabled = !edit && (!insert || watch("cronDay")) ? true : false;
  const dayOfWeekDisabled = !edit && (!insert || watch("cronDay")) ? true : false;
  const dayDisabled = !edit && (!insert || (watch("cronWeek") || watch("cronDayOfWeek"))) ? true : false;
  const timeDisabled = !edit && !insert ? true : false;
  const cronTextDisabled = !edit && !insert;
  const jobClassDisabled = !insert;
  const timeZoneIdDisabled = true;//!edit && !insert;

  const generateRow = () => {
    let keyFieldStyle = {
      height: "35px",
      margin: "3.5px 3.5px",
      padding: 0,
      "& .MuiInputBase-input": {
        height: "25px",
        margin: 0,
        padding: "0px 12px"
      }
    }

    return (
      jobDataArr?.length > 0 && jobDataArr.map((data, inx) => {
        return (
          <>
          <TableRow key={inx}>
            <TableCell align="center" style={{ width: "30%" }}>
              { data.keyEdit ?
                <TextField sx={keyFieldStyle} id={"jobDataKey_" + String(inx)} size="small" disabled={!data.keyEdit} defaultValue={!data.keyEdit ? data.key : ""} /> :
                <InputLabel style={labelFontStyle} id={"jobDataKey_" + String(inx)}>{data.key}</InputLabel>
              } 
            </TableCell>
            <TableCell style={{ width: "60%" }} align="left">
              {
                data.type === "SELECT" ?
                  <NativeSelect
                    sx={textFieldStyle}
                    inputProps={{ ...{ id: "jobDataValue_" + String(inx) } }}
                    onChange={(e) => {
                      if (data.funcName && jobDataFunObj[data.funcName]) {
                        let func = jobDataFunObj[data.funcName];
                        func(e, data, inx);
                      }
                    }}
                  >
                    {
                      data.value.map((val) => {
                        return <option key={val} value={val}>{val}</option>
                      })
                    }
                  </NativeSelect> :
                  <TextField sx={textFieldStyle} type={"text"} label="" id={"jobDataValue_" + String(inx)} size="small"
                     defaultValue={!data.valueEdit ? data.value : ""} InputProps={{readOnly: !edit && !data.valueEdit}}
                    />
              }
            </TableCell>
            <TableCell style={{ width: "10%" }} align="right">
              {
                (edit || insert) && data.deleteShow &&
                <IconButton onClick={() => { deleteRow(inx) }}>
                  <DeleteForever style={{ color: "#F15F5F" }} />
                </IconButton>
              }
              {
                (insert || edit) && (inx === jobDataArr.length - 1) &&
                addRowButtonRender()
              }
            </TableCell>
          </TableRow>
        </>
        )
      })
    )
  };

  const addRowButtonRender = () => {
    return (
      <Tooltip title={transLangKey("UI_SCHEDULER_JOB_TOOLTIP_ADD_DATA")} placement="bottom" arrow>
        <IconButton
          onClick={() => {
            addRow("TEXT");
          }}
        >
          <Add />
        </IconButton>
      </Tooltip>
    )
  }

  const filterRowArr = async (inx) => {
    let temp = JSON.parse(JSON.stringify(jobDataArr));
    temp = temp.filter((data, index) => index !== inx);

    return temp;
  }

  const deleteRow = async (inx) => {
    setJobDataArr([]);
    let arr = await filterRowArr(inx);
    setJobDataArr(arr);
  }

  const addRow = async (type) => {
    let rowObject = {};
    let find = findJobInfo(getValues("jobClass"));

    if (find?.groupType === "LIST") {
      rowObject = { "key": find.group + (String(jobDataArr.length)), "value": "", keyEdit: false, valueEdit: true, type: type ? type : "TEXT", deleteShow: true };
    } else {
      rowObject = { "key": "", "value": "", keyEdit: true, valueEdit: true, type: type ? type : "TEXT", deleteShow: true };
    }

    setJobDataArr(jobDataArr?.length > 0 ? [...jobDataArr, rowObject] : [rowObject]);
  };

  //GRID
  const [grid1, setGrid1] = useState(null);

  function afterGridCreate1(gridObj, gridView, dataProvider) {
    setGrid1(gridObj);
    gridObj.gridView.displayOptions.fitStyle = "fill";
    gridObj.gridView.setStateBar({ visible: true });
    gridObj.gridView.setCheckBar({ visible: true });

    gridObj.gridView.setCellStyleCallback(function (grid, dataCell) {
      let ret = {};

      if (dataCell.index.column.name === 'status') {
        let triggerState = gridObj.gridView.getValues(dataCell.index.itemIndex).triggerState;

        if (["BLOCKED", "RUNNING"].includes(triggerState)) {
          return { style: { color: '#4374D9', bold: true } }; //#DB4455
        } else if (["COMPLETE", "NONE"].includes(triggerState)) {
          return { style: { color: '#4374D9', bold: true } };
        } else if (["WAITING", "ACQUIRED", "SCHEDULED"].includes(triggerState)) {
          return { style: { color: '#47C83E', bold: true } };
        } else if (triggerState === "ERROR") {
          return { style: { color: '#FF5E00', bold: true } };
        } else if (triggerState === "PAUSED") {
          return { style: { color: '#8C8C8C', bold: true } };
        } else {
          return { style: { color: '#8C8C8C', bold: true } };
        }
      }

      return ret;
    });

    gridObj.gridView.onCurrentChanging = function (grid, oldIndex, newIndex) {
      let jsonRow = gridObj.dataProvider.getJsonRow(newIndex.dataRow);
      showJobDataInfo(jsonRow);
    };
  }

  const loadGridData = () => {
    resetAll();
    zAxios({
      method: "get",
      url: "scheduler-mgmt/jobs",
    })
      .then((res) => {
        if (res.status === HTTP_STATUS.SUCCESS) {
          let dataArr = res.data;

          dataArr.forEach((data) => {
            data["jobDataObj"] = JSON.parse(data["jobData"]);
            data["attrObj"] = JSON.parse(data["attr"]);
          });
          
          if (dataArr?.length > 0) {
            grid1.setData(dataArr);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      }).then(() => {
      });
  };

  const gridAfterSetDataLocal = (gridView, dataProvider, resultData) => {
    let current = gridView.getCurrent();

    if(resultData.length > 0) {
      if (current.dataRow === -1) {
        gridView.setCurrent({ itemIndex: 0, column: "jobName" });
      } else {
        let jsonRow = dataProvider.getJsonRow(current.dataRow);
        showJobDataInfo(jsonRow);
      }
    }
  };

  const insertNewJob = () => {
    resetAll();
    setInsert(true);
    setEdit(true);
    setValue("timeZoneId", timeZoneId);
  };

  const resetAll = () => {
    reset();
    setJobDataArr([]);
    setInsert(false);
    setEdit(false);
  }

  const showJobDataInfo = (data) => {
    resetAll();

    setTimeout(() => {
      // Cron 관련[초, 분, 시, 일, 월, (요일#주차)];
      let cronArr = data["cron"].split(" ");
      let time = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()
        , cronArr[2], cronArr[1], cronArr[0], 0);
      let day = cronArr[3];
      let month = cronArr[4];
      let weekInfo = cronArr[5];
      let week = null;
      let dayOfWeek = null;

      // 주차 요일 판단
      if (weekInfo.includes("#")) {
        let infoArr = weekInfo.split("#");
        week = "#" + infoArr[1];
        dayOfWeek = infoArr[0];
      } else if (!isNaN(Number(weekInfo))) {
        week = "";
        dayOfWeek = weekInfo;
      } else {
        week = null;
        dayOfWeek = weekInfo;
      }

      if (data["jobDataObj"]) {
        let dataArr = [];
        let jobData = data["jobDataObj"];

        Object.keys(jobData).forEach((key) => {

          if (typeof (jobData[key]) === "object") {
            Object.keys(jobData[key]).forEach((objKey) => {
              let obj = {};

              obj["key"] = isNaN(Number(objKey)) ? objKey : key + String(objKey);
              obj["value"] = jobData[key][objKey];
              obj["keyEdit"] = false;
              obj["valueEdit"] = false;
              obj["type"] = "TEXT";

              dataArr.push(obj);
            });
          } else {
            let obj = {};

            obj["key"] = key;
            obj["value"] = jobData[key];
            obj["keyEdit"] = false;
            obj["valueEdit"] = false;
            obj["type"] = "TEXT";

            dataArr.push(obj);
          }
        });

        let attrObj = data["attrObj"];

        // sort
        dataArr.sort((pre, cur) => {
          let preVal = attrObj[pre.key] === undefined ? 999 : attrObj[pre.key] === 0 ? -1 : attrObj[pre.key];
          let curVal = attrObj[cur.key] === undefined ? 999 : attrObj[cur.key] === 0 ? -1 : attrObj[cur.key];

          return (preVal - curVal);
        });

        // delete button show = true
        dataArr.forEach((data) => {
          data.deleteShow = true;
        });

        setJobDataArr([...dataArr]);
      }

      // JOB 관련
      setValue("jobClass", data["jobClass"]);
      setValue("jobGroup", data["jobGroup"]);
      setValue("jobName", data["jobName"]);
      setValue("jobDescription", data["descrip"]);
      setValue("jobStatus", data["status"]);

      // CRON
      setValue("cronText", data["cron"]);
      setValue("cronTime", time);
      setValue("cronDay", day);
      setValue("cronMonth", month);
      setValue("cronWeek", week);
      setValue("cronDayOfWeek", dayOfWeek);
      setValue("startDate", data["startDate"] ? new Date(data["startDate"]) : null);
      setValue("endDate", data["endDate"] ? new Date(data["endDate"]) : null);
      setValue("timeZoneId", data["timeZoneId"] ? data["timeZoneId"] : "");
    }, 100);
  }

  const getTime = (date) => {
    return [date.getSeconds(), date.getMinutes(), date.getHours()];
  }

  const validCronExpression = async (cronExpression, startDate, endDate, timeZoneId) => {

    return zAxios({
      method: "post",
      url: "scheduler-mgmt/cron-check",
      data: {
        cronExpression: cronExpression,
        startDate: startDate,
        endDate: endDate,
        timeZoneId: timeZoneId
      }
    })
      .then((res) => {
        if (res.status === HTTP_STATUS.SUCCESS) {
          return res.data;
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      })
  };

  const validFormData = async () => {

    if (!getValues("jobGroup")) {
      showMessage(transLangKey("WARNING"), transLangKey("UI_SCHEDULER_JOB_MSG_VALID_1"), { close: false });
      return;
    } else if (!getValues("jobName")) {
      showMessage(transLangKey("WARNING"), transLangKey("UI_SCHEDULER_JOB_MSG_VALID_2"), { close: false });
      return;
    } else if (!getValues("jobClass")) {
      showMessage(transLangKey("WARNING"), transLangKey("UI_SCHEDULER_JOB_MSG_VALID_7"), { close: false });
      return;
    } else if (!getValues("timeZoneId")) {
      showMessage(transLangKey("WARNING"), transLangKey("UI_SCHEDULER_JOB_MSG_VALID_9"), { close: false });
      return;
    }

    if(!getValues("cronTextKeyPress")) {
      if (!getValues("cronDay") && getValues("cronWeek") !== undefined && !getValues("cronDayOfWeek")) {
        showMessage(transLangKey("WARNING"), transLangKey("UI_SCHEDULER_JOB_MSG_VALID_3"), { close: false });
        return;
      } else if (!getValues("cronDay") && getValues("cronDayOfWeek") && getValues("cronWeek") === undefined) {
        showMessage(transLangKey("WARNING"), transLangKey("UI_SCHEDULER_JOB_MSG_VALID_4"), { close: false });
        return;
      } else if (!getValues("cronDayOfWeek") && getValues("cronWeek") === undefined && !getValues("cronDay")) {
        showMessage(transLangKey("WARNING"), transLangKey("UI_SCHEDULER_JOB_MSG_VALID_5"), { close: false });
        return;
      } else if (getValues("cronTimeError")) {
        showMessage(transLangKey("WARNING"), transLangKey("UI_SCHEDULER_JOB_MSG_VALID_6"), { close: false });
        return;
      }
    }

    return true;
  }

  const getJobData = () => {
    let jobData = null;
    let jobKeyMap = null;

    if (jobDataArr?.length > 0) {
      jobData = {};
      jobKeyMap = {};

      let find = findJobInfo(getValues("jobClass"))
      let assentialArr = find.essentials ?? [];
      let group = find.group ?? null;
      let groupType = find.groupType;

      if (groupType === "Object" || groupType === undefined) {
        let groupedObj = {}
        jobDataArr.forEach((data, inx) => {
          let keyEl = document.getElementById("jobDataKey_" + inx);
          let valEl = document.getElementById("jobDataValue_" + inx);

          let key = keyEl.tagName === "LABEL" ? keyEl.innerText.trim() : keyEl.value.trim();
          let value = valEl.value.trim();

          jobKeyMap[key] = inx;

          if (assentialArr.includes(key)) {
            jobData[key] = value;
          } else {
            groupedObj[key] = value;
          }
        });

        jobData[group] = groupedObj;
      } else if (groupType === "LIST") {
        let arr = [];

        jobDataArr.forEach((data, inx) => {
          let keyEl = document.getElementById("jobDataKey_" + inx);
          let valEl = document.getElementById("jobDataValue_" + inx);

          let key = keyEl.tagName === "LABEL" ? keyEl.innerText.trim() : keyEl.value.trim();
          let value = valEl.value.trim();

          jobKeyMap[key] = inx;

          if (assentialArr.includes(key)) {
            jobData[key] = value;
          } else {
            arr.push(value);
          }
        });

        jobData[group] = arr;
      }

    }

    return { "jobData": jobData, "jobKeyMap": jobKeyMap };
  }


  const jobEdit = (val) => {
    setEdit(val);
  }

  const updateJob = () => {
    showMessage(transLangKey("MSG_CONFIRM"),
      transLangKey("MSG_SAVE"), (answer) => {
        if (answer) {
          let changes = [];
          let changeRowData = [];

          changes = grid1.dataProvider.getAllStateRows().updated

          changeRowData = changes.map((row) => {
            let data = grid1.dataProvider.getJsonRow(row);
            data["userName"] = username;
            return data;
          });

          if (changeRowData.length === 0) {
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
          } else {

            zAxios({
              method: "post",
              url: "scheduler-mgmt/job/updates",
              data: changeRowData
            })
              .then((res) => {
                if (res.status === HTTP_STATUS.SUCCESS) {
                  let data = res.data;

                  if(data) {
                    showMessage(transLangKey("WARNING"), transLangKey(data), { close: false });
                  } else {
                    loadGridData();
                    resetAll();
                  }
                }
              })
              .catch((err) => {
                console.log(err);
              })
              .then(() => {
                grid1.gridView.hideToast();
              });
          }
        }
      });
  }

  const makeDateRange = () => {
    //let dateRange = getValues("dateRange");
    let startDate = getValues("startDate");
    let endDate = getValues("endDate");

    // 시작 날짜
    if (startDate) {
      let today = new Date();
      if (startDate.getFullYear() === today.getFullYear()
        && startDate.getMonth() === today.getMonth()
        && startDate.getDate() === today.getDate()) {
        startDate = today;
      } else {
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0)
      }
    } else {
      startDate = new Date();
    }

    // 종료 날짜
    if (endDate) {
      endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 0)
    }

    return [startDate, endDate];
  }

  // REGISTER, RESCHEDULE
  const jobValidations = async () => {
    let validation = false;

    validation = await validFormData();
    if (!validation) {
      return;
    }

    // Cron Expression Check
    let dateRange = makeDateRange();
    let cronExpression = getValues("cronText");

    validation = await validCronExpression(cronExpression, dateRange[0], dateRange[1], getValues("timeZoneId"));

    if (!validation) {
      showMessage(transLangKey("INFO"), transLangKey("UI_SCHEDULER_JOB_MSG_VALID_8"));
      return;
    } else {
      return { cron: cronExpression, dateRange: dateRange };
    }
  }

  // 신규
  const registerJob = async () => {
    let info = await jobValidations();

    if (info) {
      await save(info["cron"], info["dateRange"]);
    }
  };

  // UPDATE
  const rescheduleJob = async () => {
    let info = await jobValidations();

    if (info) {
      await update(info["cron"], info["dateRange"]);
    }
  }

  const update = async (cronExpression, dateRange) => {
    showMessage(transLangKey("MSG_CONFIRM"),
      transLangKey("MSG_SAVE"), (answer) => {

        if (answer) {
          let jobObj = getJobData();
          let jobData = jobObj["jobData"];
          let jobKeyMap = jobObj["jobKeyMap"];
          let find = findJobInfo(getValues("jobClass"));

          let data = {
            "name": getValues("jobName"),
            "group": getValues("jobGroup"),
            "cron": cronExpression,
            "description": getValues("jobDescription"),
            "jobClass": getValues("jobClass"),
            "jobCode": find?.jobCode ? find?.jobCode : "",
            "jobData": jobData,
            "attr": jobKeyMap,
            "startDate": dateRange[0] ? new Date(dateRange[0].format("yyyy-MM-ddTHH:mm:ss")) : null,
            "endDate": dateRange[1] ? new Date(dateRange[1].format("yyyy-MM-ddTHH:mm:ss")) : null,
            "userName": username,
            "timeZoneId": getValues("timeZoneId")
          };

          zAxios({
            method: "post",
            url: "scheduler-mgmt/job/reschedule",
            data: data
          })
            .then(() => { })
            .catch((err) => {
              console.log(err);
            })
            .then(() => {
              grid1.gridView.hideToast();
              resetAll();
              loadGridData();
            });
        }
      });
  }

  const save = async (cronExpression, dateRange) => {
    showMessage(transLangKey("MSG_CONFIRM"),
      transLangKey("MSG_SAVE"), (answer) => {
        if (answer) {
          let jobObj = getJobData();
          let jobData = jobObj["jobData"];
          let jobKeyMap = jobObj["jobKeyMap"];

          let find = findJobInfo(getValues("jobClass"));

          let data = {
            "name": getValues("jobName"),
            "group": getValues("jobGroup"),
            "cron": cronExpression,
            "description": getValues("jobDescription"),
            "jobClass": getValues("jobClass"),
            "jobCode": find?.jobCode ? find?.jobCode : "",
            "jobData": jobData,
            "attr": jobKeyMap,
            "startDate": dateRange[0] ? new Date(dateRange[0].format("yyyy-MM-ddTHH:mm:ss")) : null,
            "endDate": dateRange[1] ? new Date(dateRange[1].format("yyyy-MM-ddTHH:mm:ss")) : null,
            "userName": username,
            "timeZoneId": getValues("timeZoneId")
          };

          zAxios({
            method: "post",
            url: "scheduler-mgmt/job",
            data: data
          })
            .then((res) => { 
              if (res.status === HTTP_STATUS.SUCCESS) {
                let data = res.data;

                if(data) {
                  showMessage(transLangKey("WARNING"), transLangKey(data), { close: false });
                }
              }
            })
            .catch((err) => {
              console.log(err);
            })
            .then(() => {
              grid1.gridView.hideToast();
              resetAll();
              loadGridData();
            });
        }
      });
  }

  const deleteData = (targetGrid, deleteRows) => {
    targetGrid.gridView.commit(true);
    let rows = deleteRows;

    if (deleteRows.length > 0) {

      zAxios({
        method: "post",
        url: "scheduler-mgmt/jobs-delete",
        data: rows
      })
        .then(function (response) {
          if (response.status === HTTP_STATUS.SUCCESS) {
          }
        })
        .catch(function (err) {
          console.log(err);
        })
        .then(function () {
          loadGridData();
          resetAll();
        });
    }
  }

  const execButtonOnClick = (data) => {
    showMessage(transLangKey("MSG_CONFIRM"),
      transLangKey("UI_SCHEDULER_JOB_MSG_EXEC"), (answer) => {

        let jobName = data["jobName"];
        let jobGroup = data["jobGroup"];

        if (answer) {
          zAxios({
            method: "post",
            url: "/scheduler-mgmt/execute",
            data:{
              JOB_NAME: jobName,
              JOB_GROUP: jobGroup
            }
          })
            .then((res) => {
              if (res.status === HTTP_STATUS.SUCCESS) {
              }
            })
            .catch((err) => {
              console.log(err);
            }).then(() => {
              loadGridData();
            });
        }
      });
  }
  const setExecActionBtn = () => {
    const gridView = grid1.gridView;
    const dataProvider = grid1.dataProvider;
    gridView.registerCustomRenderer('executeButton', {
      initContent: function (parent) {
        const grid = this.grid.handler;
        const index = this.index.toProxy();
        parent.style.textAlign = "center";

        let execButton = document.createElement('button');
        execButton.type = 'button';
        execButton.innerText = transLangKey('EXEC');
        execButton.style.margin = 0;
        execButton.className = 'grid-btn exec-btn';

        parent.appendChild(this._execButton = execButton);
      },
      canClick: function () {
        return true;
      },
      clearContent: function (parent) {
        parent.innerHTML = '';
      },
      render: function (grid, model) {
        let execButton = this._dom.children[0];
        let row = dataProvider.getJsonRow(model.index.dataRow);
        let active = row["btnActive"];
        let triggerState = row["triggerState"];

        execButton.className = active && !["RUNNING", "BLOCKED"].includes(triggerState) ? 'grid-btn exec-btn' : 'grid-btn exec-btn grid-btn-disabled';
      },
      click: function (event) {
        const grid = this.grid.handler;
        const index = this.index.toProxy();

        event.preventDefault;
        let data = dataProvider.getJsonRow(index.dataRow);

        let active = data["btnActive"];
        let triggerState = data["triggerState"];
        
        if (!active || ["RUNNING", "BLOCKED"].includes(triggerState)) {
          return;
        } else {
          execButtonOnClick(data);
        }
      }
    });

    gridView.setColumnProperty('action', 'renderer', 'executeButton');
  }

  const onHandleGroupButton = (e, name) => {
    if (getValues(name) === e.target.value) {
      setValue(name, null);
    } else {
      setValue(name, e.target.value);
    }
  }

  const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
      height: 30,
      margin: theme.spacing(0.5),
      border: 0,
      '&.Mui-disabled': {
        border: 0,
      },
      '&:not(:first-of-type)': {
        borderRadius: theme.shape.borderRadius,
      },
      '&:first-of-type': {
        borderRadius: theme.shape.borderRadius,
      },
    },
  }));

  const setDefJobDataByJobClass = (jobClass) => {
    setJobDataArr([]);

    setTimeout(() => {
      let find = findJobInfo(getValues("jobClass"));

      if (find) {
        let jobDataArr = [];
        let essentials = find.essentials ?? [];

        essentials.forEach((key) => {
          let obj = {};
          let type = "TEXT";
          let value = null;

          if (find.attrKey && key === find.attrKey) {
            obj["type"] = find.attrType;
            obj["value"] = find.attrVal;

            if (find.funcName) {
              obj["funcName"] = find.funcName;
            }
          }

          obj["key"] = key;
          obj["keyEdit"] = false;
          obj["valueEdit"] = true;

          jobDataArr.push(obj);
        });

        setJobDataArr((arr) => [...jobDataArr]);
      }
    }, 100);
  };

  const findJobInfo = (value) => {
    let find = jobClassArr.find((data) => data.value == value);
    return find;
  };

  const getServerInfo = () => {
    zAxios({
      method: "get",
      url: "scheduler-mgmt/server-info",
    })
      .then((res) => {
        if (res.status === HTTP_STATUS.SUCCESS) {
          if (res.data) {
            let data = res.data;
            setServiceUri(data["service-uri"]);
            setServerInfo(data["server-info"]);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      }).then(() => {
      });
  };

  const getJobClassArr = () => {

    zAxios({
      method: "get",
      url: "system/common/codes",
      params: {
        "group-cd": "JOB_CLASS"
      }
    })
      .then((res) => {
        if (res.status === HTTP_STATUS.SUCCESS) {
          let dataArr = [];

          if (res.data?.length > 0) {
            dataArr = res.data.map((d) => {
              let obj = {
                label: transLangKey(d.descrip),
                value: d.attr01Val,
                jobCode: d.comnCd,
                essentials: d.attr02Val ? d.attr02Val.split(",") : [],
                group: d.attr03Val,
                groupType: d.attr04Val,
              };

              if (d.attr05Val) {
                obj["attrKey"] = d.attr05Val.split("|")[0];
                obj["attrType"] = d.attr05Val.split("|")[1];
                obj["attrVal"] = d.attr05Val.split("|")[2].split(",");
                obj["funcName"] = d.attr05Val.split("|")[3];
              }

              return obj;
            });
          }
          setJobClassArr([...dataArr]);
        }
      })
      .catch((err) => {
        console.log(err);
      }).then(() => {
      });
  }

  const getTimeZone = () => {

    zAxios({
      method: "get",
      url: "scheduler-mgmt/timezone",
    })
      .then((res) => {
        if (res.status === HTTP_STATUS.SUCCESS) {
          if (res.data) {
            setTimeZoneId(res.data);
            setValue("timeZoneId", res.data);
          } else {
            setTimeZoneId("");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      }).then(() => {
      });
  }

  // EFFECT 
  useEffect(() => {
    if (grid1) {
      setViewInfo(activeViewId, "globalButtons", globalButtons);
      setExecActionBtn();
      loadGridData();
    }
  }, [grid1]);

  useEffect(() => {
    if (insert && getValues("jobClass")) {
      setDefJobDataByJobClass(getValues("jobClass"));
    }
  }, [watch("jobClass")]);

  useEffect(() => {
    if (edit || insert) {
      let cronText = "";
      let cronTime = getValues("cronTime") instanceof Date && !isNaN(getValues("cronTime")) ? getTime(getValues("cronTime")) : [0, 0, 0];
      let month = getValues("cronMonth") ?? "";
      let week = getValues("cronWeek") ?? "";
      let cronDayOfWeek = getValues("cronDayOfWeek") ?? "";
      let cronDay = getValues("cronDay") ?? "";
      let sec = cronTime[0];
      let min = cronTime[1];
      let hour = cronTime[2];

      if (cronDayOfWeek && cronDayOfWeek !== "?") {
        cronText = `${sec} ${min} ${hour} ? ${month} ${cronDayOfWeek}${week}`;
      } else {
        cronText = `${sec} ${min} ${hour} ${cronDay} ${month} ?`;
      }

      setValue("cronText", cronText);
    }

  }, [watch("cronMonth"), watch("cronWeek"), watch("cronDayOfWeek"), watch("cronDay"), watch("cronTime")]);

  useEffect(() => {
    getServerInfo();
    getJobClassArr();
    getTimeZone();
  }, []);

  return (
    <>
      <ContentInner>
        <WorkArea>
          <ResultArea sizes={[50, 50]} direction={"vertical"} minSize={150}>
            <Box style={{ height: '100%' }}>
              <ButtonArea>
                <LeftButtonArea>
                  <ButtonGroup>
                  </ButtonGroup>
                </LeftButtonArea>
                <RightButtonArea>
                  <ButtonGroup>
                    <Tooltip title={transLangKey("UI_SCHEDULER_JOB_TOOLTIP_ADD")} placement="bottom" arrow>
                      <IconButton onClick={insertNewJob}>
                        <Add />
                      </IconButton>
                    </Tooltip>
                    <GridDeleteRowButton grid="grid1" type="icon" onDelete={deleteData} />
                    <Tooltip title={transLangKey("UI_SCHEDULER_JOB_TOOLTIP_SAVE")} placement="bottom" arrow>
                      <IconButton
                        onClick={() => {
                          updateJob();
                        }}
                      >
                        <Save />
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                </RightButtonArea>
              </ButtonArea>
              <Box style={{ height: "calc(100% - 42px)" }}>
                <BaseGrid id="grid1" items={grid1Items} afterGridCreate={afterGridCreate1} onAfterDataSet={gridAfterSetDataLocal}/>
              </Box>
            </Box>
            <Box style={{ width: "100%", height: "100%" }}>
              <Box
                component={"div"}
                sx={{ display: "block", height: '40px', width: '100%', marginTop: "25px" }}
              >
                <ButtonArea>
                  <LeftButtonArea>
                  </LeftButtonArea>
                  <RightButtonArea>
                    <ButtonGroup style={{ display: "inline-block" }}>
                      {
                        insert &&
                        <>
                          <Tooltip title={transLangKey("UI_SCHEDULER_JOB_TOOLTIP_INPUT_CANCEL")} placement="bottom" arrow>
                            <IconButton
                              onClick={() => {
                                resetAll();
                              }}
                            >
                              <EditOff />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={transLangKey("UI_SCHEDULER_JOB_TOOLTIP_REGISTER")} placement="bottom" arrow>
                            <IconButton
                              onClick={() => { registerJob(); }}
                            >
                              <Save />
                            </IconButton>
                          </Tooltip>

                        </>
                      }
                      {
                        !insert && getValues("jobName") && getValues("jobGroup") &&
                        <>
                          {
                            !edit &&
                            <Tooltip title={transLangKey("UI_SCHEDULER_JOB_TOOLTIP_MODIFY")} placement="bottom" arrow>
                            <IconButton
                              onClick={() => { jobEdit(true) }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          }
                          {
                            edit &&
                            <Tooltip title={transLangKey("UI_SCHEDULER_JOB_TOOLTIP_RE_REGISTER")} placement="bottom" arrow>
                              <IconButton
                                onClick={() => { rescheduleJob() }}
                              >
                                <Save />
                              </IconButton>
                            </Tooltip>
                          }
                        </>
                      }
                    </ButtonGroup>
                  </RightButtonArea>
                </ButtonArea>
              </Box>
              <Box style={{ display: "block", width: "100%", height: "100%" }}>
                <Box
                  component={"div"}
                  sx={{ display: "inline-flex", height: 'calc(100% - 80px) !important', width: 'calc(40% - 15px) !important', marginTop: "10px", marginLeft: "10px", float: "left" }}
                >
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" style={{ width: "30%" }}>
                            <InputLabel style={labelFontStyle}>{transLangKey("UI_SCHEDULER_JOB_GROUP")}</InputLabel>
                          </TableCell>
                          <TableCell style={{ width: "70%" }} align="left" >
                            <Controller name='jobGroup' control={control} rules={{ required: true }}
                              render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <TextField sx={textFieldStyle} value={value} onChange={onChange} size="small" disabled={edit && jobGropDisabled} InputProps={{readOnly: !edit && {jobGropDisabled}}} />
                              )}
                            />
                          </TableCell>
                          <TableCell align="right">
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="center">
                            <InputLabel style={labelFontStyle}>{transLangKey("UI_SCHEDULER_JOB_NAME")}</InputLabel>
                          </TableCell>
                          <TableCell align="left">
                            <Controller name='jobName' control={control} rules={{ required: true }}
                              render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <TextField sx={textFieldStyle} value={value} onChange={onChange} size="small" disabled={edit && jobNameDisabled} InputProps={{readOnly: !edit && {jobNameDisabled}}} />
                              )}
                            />
                          </TableCell>
                          <TableCell align="right">
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="center">
                            <InputLabel style={labelFontStyle}>{transLangKey("UI_SCHEDULER_JOB_DESC")}</InputLabel>
                          </TableCell>
                          <TableCell align="left">
                            <Controller name='jobDescription' control={control} rules={{ required: true }}
                              render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <TextField sx={textFieldStyle} value={value} onChange={onChange} size="small" disabled={edit && jobDescDisabled} InputProps={{readOnly: !edit && {jobDescDisabled}}} />
                              )}
                            />
                          </TableCell>
                          <TableCell align="right">
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="center">
                            <InputLabel style={labelFontStyle}>{transLangKey("UI_SCHEDULER_JOB_CLASS")}</InputLabel>
                          </TableCell>
                          <TableCell align="left">
                            <InputField type="select" name="jobClass"
                              control={control} options={jobClassArr} style={{ width: textFieldStyle.width, height: textFieldStyle.height }} disabled={edit && jobClassDisabled} readonly={!edit && jobClassDisabled} />
                          </TableCell>
                          <TableCell align="right">
                            {
                              insert && (jobDataArr?.length === 0) &&
                              addRowButtonRender()
                            }
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {generateRow()}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                <Box
                  component={"div"}
                  sx={{ display: "inline-flex", position: "relative", alignItem: "middle", height: 'calc(100% - 80px) !important', width: 'calc(60% - 15px) !important', marginTop: "10px", marginRight: "10px", float: "right" }}
                >
                  <Box
                    component={"div"}
                    sx={{ height: '100%', width: '100%' }}
                  >
                    <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                      <Table size="small">
                        <TableHead>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell align="center">
                              <InputLabel style={labelFontStyle}>{transLangKey("UI_SCHEDULER_JOB_DATE_RANGE")}</InputLabel>
                            </TableCell>
                            <TableCell align="left">
                              <InputField style={{ width: '120px', height: textFieldStyle.height, margin: 0, padding: 0 }} type={"datetime"} name="startDate" control={control} disabled={edit && dateRangeDisabled} readOnly= {!edit && dateRangeDisabled}
                                InputProps={{ style: { width: "120px", height: textFieldStyle.height, margin: 0, padding: 0 } }}
                              />
                              <Box sx={{ display: 'inline-flex', alignItems: 'center', margin: '0px 4px 0px 4px' }}>-</Box>
                              <InputField style={{ width: '120px', height: textFieldStyle.height, margin: 0, padding: 0 }} type={"datetime"} name="endDate" control={control} disabled={edit && dateRangeDisabled} readOnly= {!edit && dateRangeDisabled}
                                InputProps={{ style: { width: "120px", height: textFieldStyle.height, margin: 0, padding: 0 } }}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">
                              <InputLabel style={labelFontStyle}>{transLangKey("UI_SCHEDULER_JOB_MONTH")}</InputLabel>
                            </TableCell>
                            <TableCell>
                              <Controller name='cronMonth' control={control} rules={{ required: true }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                  <StyledToggleButtonGroup
                                    color={"primary"}
                                    value={value}
                                    onChange={onChange}
                                    exclusive={true}
                                    aria-label="Platform"
                                    disabled={monthDisabled}
                                  >
                                    {cronMonthArr?.length > 0 &&
                                      cronMonthArr.map((cronData) => {
                                        return (
                                          <ToggleButton key={cronData.value} value={cronData.value}>
                                            {cronData.label}
                                          </ToggleButton>
                                        )
                                      })
                                    }
                                  </StyledToggleButtonGroup>
                                )}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">
                              <InputLabel style={labelFontStyle}>{transLangKey("UI_SCHEDULER_JOB_WEEK")}</InputLabel>
                            </TableCell>
                            <TableCell>
                              <Controller name='cronWeek' control={control} rules={{ required: true }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                  <StyledToggleButtonGroup
                                    color={"primary"}
                                    value={value}
                                    onChange={(e) => { onHandleGroupButton(e, "cronWeek") }}
                                    exclusive={true}
                                    aria-label="Platform"
                                    disabled={weekDisabled}
                                  >
                                    {cronWeekArr?.length > 0 &&
                                      cronWeekArr.map((cronData) => {
                                        return (
                                          <ToggleButton key={cronData.value} value={cronData.value}>
                                            {cronData.label}
                                          </ToggleButton>
                                        )
                                      })
                                    }
                                  </StyledToggleButtonGroup>
                                )}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">
                              <InputLabel style={labelFontStyle}>{transLangKey("UI_SCHEDULER_JOB_DAY_OF_WEEK")}</InputLabel>
                            </TableCell>
                            <TableCell>
                              <Controller name='cronDayOfWeek' control={control} rules={{ required: true }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                  <StyledToggleButtonGroup
                                    color={"primary"}
                                    value={value}
                                    onChange={(e) => { onHandleGroupButton(e, "cronDayOfWeek") }}
                                    exclusive={true}
                                    aria-label="Platform"
                                    disabled={dayOfWeekDisabled}
                                  >
                                    {cronDayOfWeekArr?.length > 0 &&
                                      cronDayOfWeekArr.map((cronData) => {
                                        return (
                                          <ToggleButton key={cronData.value} value={cronData.value}>
                                            {cronData.label}
                                          </ToggleButton>
                                        )
                                      })
                                    }
                                  </StyledToggleButtonGroup>
                                )}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">
                              <InputLabel style={labelFontStyle}>{transLangKey("UI_SCHEDULER_JOB_DAY")}</InputLabel>
                            </TableCell>
                            <TableCell>
                              <Controller name='cronDay' control={control} rules={{ required: true }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                  <>
                                    <StyledToggleButtonGroup
                                      color={"primary"}
                                      value={value}
                                      onChange={(e) => { onHandleGroupButton(e, "cronDay") }}
                                      exclusive={true}
                                      aria-label="Platform"
                                      disabled={dayDisabled}
                                    >
                                      {cronDayArr?.length > 0 &&
                                        cronDayArr.map((cronData) => {
                                          return (
                                            <ToggleButton key={cronData.value} value={cronData.value}>
                                              {cronData.label}
                                            </ToggleButton>
                                          )
                                        })
                                      }
                                    </StyledToggleButtonGroup>
                                    <FormControl>
                                      <InputLabel id="cronDay-select">{transLangKey("UI_SCHEDULER_JOB_DAY")}</InputLabel>
                                      <Select
                                        style={{ height: textFieldStyle.height}}
                                        value={value}
                                        labelId="cronDay-select"
                                        label={transLangKey("UI_SCHEDULER_JOB_DAY")}
                                        onChange={onChange}
                                        MenuProps={{
                                          classes: { paper: classes.selectPaper },
                                          sx: { maxHeight:"460px" }
                                        }}
                                        disabled={edit && dayDisabled}
                                        inputProps={{ readOnly: !edit && {dayDisabled} }}
                                      >
                                        {cronDaySelectArr?.length > 0 &&
                                          cronDaySelectArr.map((day) => {
                                            return (
                                              <MenuItem key={day.value} value={day.value}>{day.label}</MenuItem>
                                            )
                                          })
                                        }
                                      </Select>
                                    </FormControl>
                                  </>
                                )}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">
                              <InputLabel style={labelFontStyle}>{transLangKey("UI_SCHEDULER_JOB_TIME")}</InputLabel>
                            </TableCell>
                            <TableCell>
                                <Controller name='cronTime' control={control} rules={{ required: true }}
                                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                      <TimePicker
                                        sx={{ width: "120px", height:"40px", margin:"3.5px 3.5px", padding:"0px"}}
                                        ampm={false}
                                        openTo="hours"
                                        views={['hours', 'minutes', 'seconds']}
                                        inputFormat="HH:mm:ss"
                                        mask="__:__:__"
                                        value={value}
                                        onChange={onChange}
                                        disabled={edit && timeDisabled}
                                        readOnly={!edit && timeDisabled}
                                        onError={(error) => { setValue("cronTimeError", error ? true : false) }}
                                        renderInput={(params) => {
                                          return (<TextField size={"small"} sx={{
                                            width: "120px",
                                            height: "35px",
                                            margin: "3.5px 3.5px",
                                            padding: 0,
                                            "& .MuiInputBase-input": {
                                              width: "120px",
                                              height: "25px",
                                              margin: 0,
                                              padding: "0px 12px"
                                            }
                                          }} {...params} />)
                                        }}
                                      />
                                    </LocalizationProvider>
                                  )}
                                />
                                <Controller name='timeZoneId' control={control} rules={{ required: true }}
                                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <TextField sx={{
                                        width: "120px",
                                        height: "35px",
                                        margin: "3.5px 3.5px",
                                        padding: 0,
                                        "& .MuiInputBase-input": {
                                          width: "120px",
                                          height: "25px",
                                          margin: 0,
                                          padding: "0px 12px"
                                        }
                                      }} 
                                      value={value} onChange={onChange} size="small" disabled={edit && timeZoneIdDisabled}  InputProps={{readOnly: !edit && {timeZoneIdDisabled}}}
                                    />
                                  )}
                                />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center">
                              <InputLabel style={labelFontStyle}>{transLangKey("UI_SCHEDULER_JOB_CRON_INPUT")}</InputLabel>
                            </TableCell>
                            <TableCell>
                              <Controller name='cronText' control={control} rules={{ required: true }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                  <TextField sx={textFieldStyle} value={value} onChange={onChange} onKeyDown={(e) => setValue("cronTextKeyPress", true)} size="small" disabled={edit && cronTextDisabled} InputProps={{readOnly: !edit && {cronTextDisabled}}} />
                                )}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              </Box>
            </Box>
          </ResultArea>
        </WorkArea>
      </ContentInner >
    </>
  )
}

export default SchedulerJobMgmt;