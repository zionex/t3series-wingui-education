import { createStyles, makeStyles } from '@mui/styles';

/**
 * 입력 콤포넌트 MUI variant
 */
export const DEF_INPUT_VARIANT = 'outlined';
export const DEF_INPUT_SIZE = "small";
export const INPUT_HEIGHT = 45
export const INPUT_WIDTH = 200
export const INPUT_PADDING = 0
export const INPUT_BORDER_RADIUS = 6
export const INPUT_WIDTH_LONG = 265 // dateRange 인경우
export const INPUT_WIDTH_LONG2 = 360 //dateRange에서 showTimeSelect 인경우

//라벨 width/height
export const LEFT_LABEL_WIDTH = 70
export const TOP_LABEL_WIDTH = 120

export const useInputConstant = (props) => {
  return {
    DEF_INPUT_VARIANT,
    DEF_INPUT_SIZE,
    INPUT_HEIGHT,
    INPUT_WIDTH,
    INPUT_WIDTH_LONG,
    INPUT_WIDTH_LONG2,
    INPUT_PADDING,
    INPUT_BORDER_RADIUS,
    LEFT_LABEL_WIDTH,
    TOP_LABEL_WIDTH,
  }
}

/**
 * FormItem  스타일
 */
export const useFormInputStyles = makeStyles((theme) =>
  createStyles({
    wrapBox: {
      display: 'inline-flex',
      alignItems: 'center',
      flexDirection: "row",
      minHeight: `${INPUT_HEIGHT}px`,
    },
    labelBox: {
      display: "flex",
      alignItems: 'center',
      wordBreak: "break-all",
      padding: '4px',
      justifyContent: 'center',
      fontWeight: 800,
      //color: theme.palette.inputField.color,
      backgroundColor: 'cyon',
      height: '100%',
      fontSize: '14px',
      //outline: theme.type === 'dark' ? '1px solid #353535' : '1px solid #dde1ee',
      width: `${LEFT_LABEL_WIDTH}px !important`,
    },
  })
)
/**
 * InputComponent 추가 스타일
 */
export const useInputStyles = makeStyles((theme) =>
  createStyles({
    wrapBox: {
      display: 'inline-flex',
      alignItems: 'center',
      flexDirection: "row",
      padding: '5px 4px 4px 4px',
      margin: 0,
    },
    labelBox: {
      display: "flex",
      alignItems: 'center',
      wordBreak: "break-all",
      padding: '4px',
      justifyContent: 'center',
      fontWeight: 800,
      fontSize: '12px',
      backgroundColor: 'transparent',
      height: '100%',
      //outline: theme.type === 'dark' ? '1px solid #353535' : '1px solid #dde1ee',
    },
    inputBox: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${INPUT_PADDING}px`,
      '& .MuiSvgIcon-root': {
        color: theme.type === 'dark'? theme.themeData.palette.typography.color : null
      },
      '&:hover fieldset.MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${theme.themeData.palette.base.colorC}`
      },
      '& fieldset.Mui-focused.MuiOutlinedInput-notchedOutline': {
        border: `2px solid ${theme.themeData.palette.base.colorC}`
      },
    },
    AutoComplete: {
    },
    AutoCompleteRenderInput: {
    },
    inputSelect: {
    },
    inputSelectPaper: {
      maxHeight: 310
    },
    inputMultiSelect: {
    },
    inputMultiSelectPaper: {
      maxHeight: 310,
      width: 200
    },
    inputCheck: {
    },

    inputRadio: {
    },

    zDateTimePickerWrapper: { //react-datepicker-wrapper override
      width: (props) => props ? props.defInputWidth : undefined,
      "& .react-datepicker__input-container": {
        width: (props) => props ? props.defInputWidth : undefined,
      },
    },
    zDateTimePickerInput: {
    },

    timePickerInput: {
    },

    popoverInputText: {

    },
    textInput: {

    },

    multilineTextInput: {
    },
    helperText: {
      marginLeft: "6px",
      marginTop: "0px",
      "&.Mui-error": {
        color: theme.palette.error.main
      }
    },
    helperTooltip: {
      marginTop: '2px !important',
      backgroundColor: theme.palette.primary.main
    },
    validationTooltip: {
      marginTop: '2px !important',
      backgroundColor: theme.palette.warning.main
    }
  })
)
