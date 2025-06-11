import { transLangKey } from "..";

/* 주석처리된 부분은 setFilteringOptions 로 설정되고 있음 */
const getLangdata = () => ({
  dateEditorCancelLabel: transLangKey("CANCEL"),
  dateEditorDeleteLabel: transLangKey("DELETE"),
  dateEditorSaveLabel: transLangKey("SAVE"),
  dateEditorTodayLabel: transLangKey("TODAY"),
  dateEditorWeekDays: [transLangKey('CALENDAR_SUN'), transLangKey('CALENDAR_MON'), transLangKey('CALENDAR_TUE'), transLangKey('CALENDAR_WED'), transLangKey('CALENDAR_THU'),
  transLangKey('CALENDAR_FRI'), transLangKey('CALENDAR_SAT')],
  filterSelectorAcceptText: transLangKey("MSG_CONFIRM"),
  filterSelectorAllCheckText: "(" + transLangKey("MSG_CONFIRM") + ")",
  filterSelectorCancelText: transLangKey("DELETE"),
  //filterSelectorEmptyFilterText: `(${transLangKey("NN")})`,
  //filterSelectorFilterResetText: transLangKey("REFRESH"),
  //filterSelectorFiltersResetText: `(${transLangKey("ALL")} ${transLangKey("REFRESH")})`,
  //filterSelectorSearchPlaceholder: transLangKey("SEARCH") + "...",
  filterSelectorSearchedCheckText: `(${transLangKey("SEARCH")} ${transLangKey("ALL_SELECT")})`,
  dataDropModeCopy: transLangKey("COPY"),

  groupingPrompt: transLangKey("MSG_GRID_GROUP_COLUMN_HEADER"),
  deleteRowsMessage: transLangKey("MSG_DELETE"),

  displayEmptyMessage: transLangKey("MSG_NO_DATA"),
  checkListCancelText: transLangKey("CANCEL"),
  checkListAllCheckText: transLangKey("ALL_SELECT"),
  invalidFormatMessage: transLangKey("MSG_0020"),

  filterOperatorReset: transLangKey("REFRESH"),
  filterOperatorEmpty: transLangKey("NN"),
  filterSelectorDateYearFormat: "{YYYY}"+transLangKey("FILTER_YEAR"),
  filterSelectorDateQuarterFormat: "{Q}"+transLangKey("FILTER_QUARTER"),
  filterSelectorDateMonthFormat: "{M}"+transLangKey("FILTER_MONTH"),
  filterSelectorDateDayFormat: "YYYY-MM-DD",
})

// var message = {
//   ko: {
//     ...langdata,
//     dateEditorHourLabel: "시",
//     dateEditorMinuteLabel: "분",
//     dateEditorMonths: undefined,
//     dateEditorSecondLabel: "초",
//     dateEditorYearDisplayFormat: "{Y}년",
//     dateEditorMonthDisplayFormat: "{M}월",

//     searchEditorMoreText: "더보기",

//     checkListAcceptText: "Accept",


//     dataDropProxyLabel: "${rows}행 ${mode}",
//     dataDropModeMove: "이동",
//     groupingToastMessage: "Grouping...",

//     filterOperatorContains: "포함",
//     filterOperatorNotContains: "포함하지 않음",
//     filterOperatorStartsWith: "시작 문자",
//     filterOperatorEndsWith: "끝 문자",
//     filterOperatorEqual: "같음",
//     filterOperatorNotEqual: "같지 않음",
//     filterOperatorGreater: "보다 큼",
//     filterOperatorGreaterEqual: "크거나 같음",
//     filterOperatorLower: "보다 작음",
//     filterOperatorLowerEqual: "작거나 같음",
//     filterOperatorBetween: "범위",
//     filterToastMessage: "Filtering...",

//     invalidDatetimeFormat1:
//       "Invalid datetime read format - 'H'와 'a'가 같이 존재할 수 없습니다: ",
//     invalidDatetimeFormat2:
//       "Invalid datetime read format - 'h'가 있으면 'a'가 반드시 있어야 합니다: ",
//     commitEditingMessage: "먼저 편집을 완료 하십시오.",

//     decimalSeparator: ".",
//     thousandsSeparator: ",",

//     sortingToastMessage: "Sorting...",

//     exportProgressMessage: "Exporting...",

//     rowIndicatorHeadText: "No.",
//     rowIndicatorFootText: "Σ",
//     rowIndicatorSumText: "Σ",

//     stateTextCreateAndDeleted: "X",
//     stateTextCreated: "C",
//     stateTextDeleted: "D",
//     stateTextUpdated: "U",

//     rowOutOfBounds: "row is out of bounds: ",
//     fieldIndexOutOfBounds: "fieldIndex is out of bounds: ",
//     fieldNameMustExists: "fieldName must be exists.",
//     fieldNameAlreadyExists: "fieldName is already exists: ",
//     clientEditingError: "Client is editing (call grid.commit() or grid.cancel() first)",
//     gridElementAttachFail: "Grid is already contained ContainerDiv",
//     gridContainerNotFind: "Invalid grid container element: ",
//   },
//   en: {
//     ...langdata,
//     dateEditorHourLabel: "Hour",
//     dateEditorMinuteLabel: "Minute",
//     dateEditorSecondLabel: "Second",
//     dateEditorYearDisplayFormat: "{Y}",
//     dateEditorMonthDisplayFormat: undefined,

//     searchEditorMoreText: "more",

//     checkListAcceptText: "Accept",

//     filterSelectorDateYearFormat: "{YYYY}",
//     filterSelectorDateQuarterFormat: "Q{Q}",
//     filterSelectorDateMonthFormat: "{M}",
//     filterSelectorDateDayFormat: "YYYY-MM-DD",
//     filterToastMessage: "Filtering...",

//     dataDropProxyLabel: "${rows} rows ${mode}",
//     dataDropModeCopy: "Move",
//     groupingToastMessage: "Grouping rows...",

//     filterOperatorContains: "contains",
//     filterOperatorNotContains: "not contains",
//     filterOperatorStartsWith: "starts with",
//     filterOperatorEndsWith: "ends width",
//     filterOperatorEqual: "equal",
//     filterOperatorNotEqual: "not Equal",
//     filterOperatorGreater: "greater then",
//     filterOperatorGreaterEqual: "greater then or equal",
//     filterOperatorLower: "less then",
//     filterOperatorLowerEqual: "less then or equal",
//     filterOperatorBetween: "between",

//     invalidDatetimeFormat1: "Invalid date format - 'H' and 'a' cannot exist together: ",
//     invalidDatetimeFormat2:
//       "Invalid date format - If 'h' is present, 'a' must be present as well: ",
//     commitEditingMessage: "Please complete editing first.",

//     decimalSeparator: ".",
//     thousandsSeparator: ",",

//     sortingToastMessage: "Sorting...",

//     exportProgressMessage: "Exporting...",

//     rowIndicatorHeadText: "No.",
//     rowIndicatorFootText: "Σ",
//     rowIndicatorSumText: "Σ",

//     stateTextCreateAndDeleted: "X",
//     stateTextCreated: "C",
//     stateTextDeleted: "D",
//     stateTextUpdated: "U",

//     rowOutOfBounds: "Row is out of bounds: ",
//     fieldIndexOutOfBounds: "Field index is out of bounds: ",
//     fieldNameMustExists: "Field name must exist.",
//     fieldNameAlreadyExists: "Field name already exists: ",
//     clientEditingError: "Client is editing (call grid.commit() or grid.cancel() first)",
//     gridElementAttachFail: "Grid is already contained ContainerDiv",
//     gridContainerNotFind: "Invalid grid container element: ",
//   },
// };

export const getGridLocale = () => ({
  ko: {
    locale: "ko-KR",
    currency: "KRW",
    messages: getLangdata(),
    numberFormats: {
      currency: {
        style: "currency",
        currency: "KRW",
        excelFormat: "₩#,##0",
      },
      accounting: {
        style: "currency",
        currency: "KRW",
        currencySign: "accounting",
        excelFormat: '"₩"#,##0_);[Red]("₩"#,##0)',
      },
      USD: {
        style: "currency",
        currency: "USD",
      },
    },
  },
  en: {
    locale: "en-US",
    currency: "USD",
    messages: getLangdata(),
    numberFormats: {
      currency: {
        style: "currency",
        currency: "USD",
      },
      accounting: {
        style: "currency",
        currency: "USD",
        currencySign: "accounting",
      },
      USD: {
        style: "currency",
        currency: "USD",
      },
    },
  },
});
