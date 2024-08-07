import React, { useState, useCallback, useEffect } from 'react'
import { Controller } from "react-hook-form";
import moment from 'moment'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ContentInner, WorkArea, ButtonArea, CommonButton, zAxios, InputField } from "@wingui/common/imports";

import { Box, IconButton, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from "@mui/material";
import { useForm } from "react-hook-form";
import { makeStyles } from '@mui/styles';
import { CalendarMonth, People } from '@mui/icons-material'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Typography from "@mui/material/Typography";
import DeleteIcon from '@mui/icons-material/Delete';
import PopSnopCalendar from "./PopSnopCalendar";
import PopSnopCategory from "./PopSnopCategory";
import PopSnopCalendarShowList from "./PopSnopCalendarShowList";
import Toolbar from './Toolbar'
import DatePicker from "react-datepicker";

function InlineDateTimePicker({ name, control, defaultValue, value, rules, ...props }) {
  return (<Controller name={name} control={control}
    defaultValue={defaultValue || value}
    rules={rules}
    render={
      ({ field: { onChange, value: val }, fieldState: { error } }) =>
        <DatePicker {...props} onChange={onChange}></DatePicker>
    }
  />)
}

createCSSSelector(
  "dateIn",
  JSonToStyleString({
    color: "white",
    "&:hover, &:focus": {
      "background-color": "grey",
    },
    "background-image": "url('/images/icons/calSelect.png')",
    "background-repeat": "no-repeat",
    "background-position": "50% bottom",
    "background-size": "20%",
    "border-top-left-radius": "50%",
    "border-bottom-left-radius": "50%",
    "border-top-right-radius": "50%",
    "border-bottom-right-radius": "50%",
  })
);

const ActionBar = {
  padding: '4px 4px 4px 4px',
  border: ' 1px solid #efefef',
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  height: '30px'
}

function getDate(dateStr) {
  const date = new Date(dateStr);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
let layoutShowList = { 'layout1': ['Y'], 'layout2': ['Y'], 'layout3': ['Y'], 'layout4': ['Y'], 'layout5': ['Y'] };

moment.locale("ko-KR");
const localizer = momentLocalizer(moment) // or globalizeLocalizer

let defaultCheckBox = [];
function snopCalendar() {
  //4. FORM 데이터 처리
  const { handleSubmit, reset, control, getValues, setValue, watch, register, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      MEET_DT: new Date(),
      searchAgenda: "",
    },
  });
  const [scheduleDateList, setScheduleDateList] = useState([]);
  const [date, setDate] = useState(new Date());
  const [eventData, setEventData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [editProps, setEditProps] = useState({});
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [dateFormat, setDateFormat] = useState("");
  const [popSnopCalendarOpen, setPopSnopCalendarOpen] = useState(false);
  const [popSnopCategoryOpen, setPopSnopCategoryOpen] = useState(false);
  const [popSnopCalendarLayoutList, setPopSnopCalendarLayoutList] = useState(false);
  const [layoutData, setLayoutData] = useState({});   // show list 팝업
  const [calendarView, setCalendarView] = useState('month');
  const [hiddenLeftColumn, setHiddenLeftColumn] = useState(false);
  const [hiddenSamllCal, setHiddenSamllCal] = useState(false);
  const [hiddenSearch, setHiddenSearch] = useState(false);
  const [hiddenCategory, setHiddenCategory] = useState(false);

  async function loadDataCalendar() {
    zAxios({
      method: "get",
      header: { "content-type": "application/json" },
      url: "calendar"
    }).then(function (res) {
      if (res.data) {
        setScheduleDateList(res.data.map(str => getDate(str.schStartDttm)));
        let calendarData = [];

        res.data.forEach(function (data) {
          let eventDataRow = {}
          eventDataRow.id = data.id
          eventDataRow.categoryId = data.categoryId
          eventDataRow.schId = data.schId
          eventDataRow.title = data.schNm
          eventDataRow.fullDay = data.fullDayYn === "Y" ? ["Y"] : ""
          eventDataRow.meetId = data.meetId ? data.meetId : ""
          eventDataRow.start = new Date(data.schStartDttm)
          eventDataRow.end = new Date(data.schEndDttm)
          eventDataRow.hexColor = data.categoryColor
          eventDataRow.repeatTp = data.repeatTp
          eventDataRow.memo = data.memo
          eventDataRow.canDelete = data.canDeleteYn
          eventDataRow.userId = data.userId
          calendarData.push(eventDataRow);
        });

        setEventData(calendarData);
        setFilteredEvents(calendarData);
      } else {
        setScheduleDateList([])
        setEventData([]);
        setFilteredEvents([]);
      }

    })
      .catch(function (err) {
        console.log(err);
      })
  }

  async function loadDataCategory() {
    zAxios({
      method: "get",
      header: { "content-type": "application/json" },
      url: "calendar-category"
    }).then(function (res) {
      let categoryData = [];
      if (res.data.length > 0) {
        res.data.forEach(function (data) {
          let categoryDataRow = {}

          categoryDataRow.USER_ID = data.userId
          categoryDataRow.CATEGORY_ID = data.id
          categoryDataRow.CATEGORY_NM = data.categoryNm
          categoryDataRow.CATEGORY_COLOR = data.categoryColor
          categoryDataRow.CAN_DELETE = data.canDeleteYn
          categoryData.push(categoryDataRow);

          defaultCheckBox.push(data.id)
        });
      }
      setCategoryData(categoryData);
    }).catch(function (err) {
      console.log(err);
    })
  }

  useEffect(() => {
    setFilteredEvents(eventData.filter(event => {
      if ((getValues('checkedCatg') && !getValues('checkedCatg').includes(event.categoryId)) || event.title.trim().replace(" ", "").indexOf(searchWord) == -1) { // checkedCategory.length > 0 &&
        return false;
      }
      return true;
    }
    ));
  }, [watch('checkedCatg'), searchWord])

  // calendar 양식(회의록이 있는 일자 배경)
  const dayClassName = date => {
    const idx = scheduleDateList ? scheduleDateList.findIndex(d => isDateDayEqual(d, date)) : -1;
    return idx >= 0 ? "dateIn" : undefined;
  };

  function makeCategory(categoryData) {

    const useStyle = makeStyles({
      label: {
        width: "100%",
        // position: "absolute",
      },
      'icon-button-root:hover': {
        color: 'transparent',
        '&:hover': {
          backgroundColor: 'white',
          color: 'gray',
        },
      },
    });
    const styleClasses = useStyle();
    return (
      <Controller
        defaultValue={defaultCheckBox}
        name={"checkedCatg"}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error }, }) => {
          if (value === undefined) {
            value = ""
          }
          return (
            <>
              <FormControl
                style={{ height: "200px" }}
                component="fieldset"
                variant="filled"
                size={"small"}
                error={!!error}
                fullWidth>
                <FormLabel sx={{ marginLeft: '10px', visibility: 'visible' }} id='CheckboxGroup'>
                </FormLabel>
                <FormGroup aria-labelledby="CheckboxGroup" row={false}>
                  {
                    categoryData.map((option, index) => {
                      return (
                        <FormControlLabel key={option.CATEGORY_ID} sx={{ width: "100%", height: "40px" }}
                          label={
                            <>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                className={useStyle.label}
                              >
                                {option.CATEGORY_ID.trim() !== "SNOP" && option.CAN_DELETE === 'Y' ? (
                                  <>
                                    <Typography style={{ width: "230px" }}>{transLangKey(option.CATEGORY_NM)}</Typography>
                                    <IconButton edge="end" aria-label="delete" onClick={(e) => deleteCategory(option.CATEGORY_ID)}
                                      classes={{ root: styleClasses['icon-button-root:hover'] }}
                                    >
                                      <DeleteIcon fontSize={"small"} />
                                    </IconButton>
                                  </>
                                ) : (
                                  <>
                                    <Typography style={{ width: "230px" }}>{transLangKey(option.CATEGORY_NM)}</Typography>
                                  </>
                                )
                                }
                              </Box>
                            </>
                          }
                          control={
                            <>
                              <Checkbox
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 20 }, color: option.CATEGORY_COLOR, '&.Mui-checked': { color: option.CATEGORY_COLOR } }}
                                defaultChecked
                                value={option.CATEGORY_ID.trim()}
                                onChange={(event, checked) => {
                                  if (event.target.readOnly) {
                                    return false;
                                  } else {
                                    if (checked) {
                                      onChange([...(value || []), event.target.value])
                                    } else {
                                      onChange(value && value.filter(
                                        (value) => value !== event.target.value
                                      ))
                                    }
                                  }
                                }}
                              />
                            </>
                          }
                        />
                      )
                    }
                    )
                  }
                </FormGroup>
              </FormControl>
            </>
          )
        }}
      />
    )
  }

  useEffect(() => {
    loadDataCalendar();
    loadDataCategory();
  }, []);

  // 카테고리 color 지정
  function eventPropGetter(event, start, end, isSelected) {
    let backgroundColor = event.hexColor;
    let style = {
      backgroundColor: backgroundColor,
    }
    return {
      style: style
    }
  }

  function deleteCategory(categoryId) {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_DELETE_CATEGORY'), function (answer) {
      if (answer) {
        zAxios({
          method: "post",
          headers: { "content-type": "application/json" },
          url: "calendar-category/delete",
          params: {
            'category-id': categoryId,
          },
        }).then(function (response) {
          loadDataCalendar();
          loadDataCategory();
        }).catch(function (e) {
          console.error(e);
        });
      }
    })
  }

  const handleSelectSlot = useCallback(({ start, end }) => {
    setEditProps({ "start": start, "end": end, "popupTitle": "INSERT_SCHEDULE" });
    setPopSnopCalendarOpen(true);
  }, [])

  const handleSelectEvent = useCallback((event) => {
    if (event.categoryId.trim() !== 'SNOP') {
      setEditProps({ ...event, "popupTitle": "EDIT_SCHEDULE" });
      setPopSnopCalendarOpen(true);
    }
  }, [])

  function openLayoutPopup() {
    setLayoutData(layoutShowList);
    setPopSnopCalendarLayoutList(true);
  }
  function onSetLayout(data) {
    layoutShowList = data;
    if (data.layout1[0] === 'Y') {
      setHiddenSamllCal(false)
    } else {
      setHiddenSamllCal(true)
    }
    if (data.layout2[0] === 'Y') {
      setHiddenSearch(false)
    } else {
      setHiddenSearch(true)
    }
    if (data.layout3[0] === 'Y') {
      setHiddenCategory(false)
    } else {
      setHiddenCategory(true)
    }
    if (data.layout1[0] !== 'Y' && data.layout2[0] !== 'Y' && data.layout3[0] !== 'Y') {
      setHiddenLeftColumn(true);
    } else {
      setHiddenLeftColumn(false);
    }
  }

  useEffect(() => {
    handleDateSelect(getValues("MEET_DT"));
  }, [watch("MEET_DT")]);

  const handleDateSelect = (date) => {
    setDate(date);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  function searchAgenda(date) {
    setSearchWord(getValues("searchAgenda"));
  }

  const customTitleAccessor = (event, start, end, isSelected) => {
    let titleAcc = "";
    if (event.fullDay[0] !== 'Y') {
      let startHour = Number(event.start.format('HH'));
      let startMinute = Number(event.start.format('mm'));
      let minuteStr = startMinute.toString().length === 1 ? '0' + startMinute.toString() : startMinute.toString()
      titleAcc = startMinute === 0 ?
        (startHour > 12 ? ("오후 " + ((startHour - 12).toString().length === 1 ? (startHour - 12).toString().replace('0', '12') : (startHour - 12).toString()) + "시") : ("오전 " + ((startHour).toString().length === 1 ? (startHour).toString().replace('0', '12') : (startHour).toString()) + "시"))
        : (startHour > 12 ? ("오후 " + ((startHour - 12).toString().length === 1 ? (startHour - 12).toString().replace('0', '12') : (startHour - 12).toString()) + ":" + minuteStr) : ("오전 " + ((startHour).toString().length === 1 ? (startHour).toString().replace('0', '12') : (startHour).toString()) + ":" + minuteStr))
    }
    return `${titleAcc} ${event.title}`;
  };

  useEffect(() => {
    let year = date.format("yyyy");
    let month = date.format("MM");
    let day = date.format("dd");
    if (calendarView === "month") {
      setDateFormat(year + "년 " + month + "월");
    } else if (calendarView === "week") {
      setDateFormat(year + "년 " + month + "월 " + Math.ceil((date.getDate() + new Date(new Date(date.getTime()).setDate(1)).getDate()) / 7) + "주차");
    } else if (calendarView === "day") {
      setDateFormat(year + "년 " + month + "월 " + day + "일");
    } else {
      setDateFormat(year + "년 " + month + "월 " + day + "일");
    }
  }, [date, calendarView]);

  const [dateRange, setDateRange] = useState({
    start: moment().startOf('year').toDate(),
    end: moment().endOf('year').toDate(),
  });

  const handleRangeChange = range => {
    setDateRange(range);
  };

  const onView = view => {
    setCalendarView(view);
    if (view === Views.AGENDA) {
      setDateRange({
        start: moment().startOf('year').toDate(),
        end: moment().endOf('year').toDate(),
      });
    }
  };

  return (
    <>
      <ContentInner>
        <WorkArea>
          <div style={ActionBar}>
            <IconButton onClick={() => { openLayoutPopup(); }}><FormatListBulletedIcon /></IconButton>{transLangKey('LAYOUT_LIST')}
          </div>
          <Box sx={{ display: "flex", height: "100%", flexDirection: "row", alignContent: "stretch", alignItems: "stretch" }} >
            <Box hidden={hiddenLeftColumn} sx={{ display: "flex", height: "100%", width: "calc(0% + 300px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }} >
              <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }} >
                <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }} >
                  <Box hidden={hiddenSamllCal} style={{ padding: '4px', borderRadius: '8px', marginBottom: '4px', height: (hiddenSearch && hiddenCategory) ? 'calc(100%)' : '352px' }}>
                    <Box style={{ display: "block", textAlign: "left", margin: "10px 0", fontWeight: "bold", }} >
                      <CalendarMonth />{transLangKey('MONTHLY_CALENDAR')}
                    </Box>
                    <Box sx={{ display: "block", textAlign: "center", width: "100%" }} >
                      <InlineDateTimePicker
                        inline
                        name="MEET_DT"
                        dateformat="yyyy-MM-dd"
                        dayClassName={dayClassName}
                        control={control}
                        style={{ width: "initial", maxWidth: "initial" }}
                      />
                    </Box>
                  </Box>
                  <Box hidden={hiddenSearch} style={{ padding: '4px', borderRadius: '8px', marginBottom: '4px', height: hiddenCategory ? 'calc(100%)' : '64px' }}>
                    <Box sx={{ display: "block", textAlign: "center", width: "calc(100% - 20px)" }} >
                      <InputField
                        type={"action"}
                        name={"searchAgenda"}
                        label={transLangKey(('SEARCH_SCHEDULE'))}
                        control={control}
                        style={{ width: "100%" }}
                        onClick={() => {
                          searchAgenda(date)
                        }}>
                        <Icon.Search />
                      </InputField>
                    </Box>
                  </Box>
                  <Box hidden={hiddenCategory} style={{ padding: '4px', borderRadius: '8px', marginBottom: '4px', height: 'calc(100%)' }}>
                    <ButtonArea>
                      <Box style={{ display: "block", textAlign: "left", margin: "10px 0", fontWeight: "bold", }} >
                        <People />{transLangKey('CALENDAR_CATEGORY')}
                      </Box>
                      <Box sx={{ flex: 1 }} style={{ textAlign: "right" }}>
                        <CommonButton title={transLangKey('ADD_CATEGORY')} onClick={() => { setPopSnopCategoryOpen(true) }}><Icon.Plus size={20} /></CommonButton>
                      </Box>
                    </ButtonArea>
                    <Box style={{ height: "100%" }}>
                      {makeCategory(categoryData)}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", height: "100%", width: hiddenLeftColumn ? "calc(100%)" : "calc(100% - 300px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }} >
              <Box style={{ padding: '4px', borderRadius: '8px', marginBottom: '4px', marginLeft: '4px', height: 'calc(100%)' }}>
                <div className="myCustomHeight" style={{ height: "80vh" }}>
                  <Calendar
                    localizer={localizer}
                    events={filteredEvents}
                    startAccessor="start"
                    endAccessor="end"
                    eventPropGetter={eventPropGetter}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    onNavigate={handleNavigate}
                    date={date}
                    components={{
                      toolbar: (props) => <Toolbar {...props} dateFormat={dateFormat} />
                    }}
                    titleAccessor={customTitleAccessor}
                    defaultView="month"
                    onView={onView}
                    range={dateRange}
                    onRangeChange={handleRangeChange}
                    view={calendarView}
                  />
                </div>
              </Box>
            </Box>
          </Box>
        </WorkArea>
      </ContentInner>
      {popSnopCategoryOpen && (<PopSnopCategory open={popSnopCategoryOpen} onClose={() => { setPopSnopCategoryOpen(false) }} editProps={editProps} confirm={loadDataCategory}></PopSnopCategory>)}
      {popSnopCalendarOpen && (<PopSnopCalendar onTopPosition={true} open={popSnopCalendarOpen} onClose={() => { setPopSnopCalendarOpen(false) }} editProps={editProps} confirm={loadDataCalendar} category={categoryData}></PopSnopCalendar>)}
      {popSnopCalendarLayoutList && <PopSnopCalendarShowList id={'showListPop'} open={popSnopCalendarLayoutList} onClose={() => setPopSnopCalendarLayoutList(false)} confirm={onSetLayout} data={layoutData}></PopSnopCalendarShowList>}
    </>
  )
}

export default snopCalendar;