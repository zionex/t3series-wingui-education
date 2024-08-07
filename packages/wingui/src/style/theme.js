import { createTheme } from '@mui/material/styles';
import { axios, zAxios } from '../index'
import { themeStoreApi } from '@zionex/wingui-core/store/themeStore'

import {
  useLoginStyles,
  useContentStyles,
  useSidebarStyles,
  useAppBarStyles,
  useViewPathStyles,
  useHistoryStyles,
  useFavoriteStyles,
  useWorkflowStyles,
  useLocaleSetupStyles,
  useTabContentStyles,
  useContentInnerStyles,
  useWorkAreaStyles,
  useSearchAreaStyles,
  useResultAreaStyles,
  useTabSetupStyles,
  usePopupDialogStyles,
  useTabContainerStyles,
  useButtonAreaStyles,
  useSearchMenuStyles,
  useIconStyles,
  useAllMenuStyles,
  useFloatMenuStyles,
  useLargeMenuDropdownStyles,
  useDashboardStyle,
  useWidgetStyle,
  useFloatIssueListStyles,
  CustomIcon,
} from '@wingui/style/AppCommonStyle'


import {
  useInputStyles, useInputConstant, useFormInputStyles,
  DEF_INPUT_VARIANT, DEF_INPUT_SIZE,
  INPUT_HEIGHT,
  INPUT_WIDTH,
  INPUT_PADDING,
  INPUT_BORDER_RADIUS,
} from '@wingui/style/AppInputStyle'
import { useAppLayoutStyles } from '@wingui/style/AppLayoutStyle'

export function getAppStyle() {
  return {
    useAppLayoutStyles,
    useSearchMenuStyles,
    useInputStyles, useSearchMenuStyles, useFormInputStyles,
    useIconStyles, useAllMenuStyles, useFloatMenuStyles, useLargeMenuDropdownStyles,
    CustomIcon, useDashboardStyle, useWidgetStyle, useSidebarStyles,
    useWorkAreaStyles, useTabContentStyles, useSearchAreaStyles, useContentInnerStyles,
    useTabSetupStyles, useLoginStyles, useFloatIssueListStyles,
    usePopupDialogStyles, useResultAreaStyles,
    useViewPathStyles, useHistoryStyles, useFavoriteStyles, useWorkflowStyles, useLocaleSetupStyles,
    useTabContainerStyles,
    useContentStyles,
    useButtonAreaStyles,
    useAppBarStyles, useInputConstant
  }
}

async function fetchThemeData() {
  // Simulate an asynchronous data fetch
  return await new Promise((resolve) => {
    let data = null;
    axios.get('themes/' + localStorage.getItem('themeMode')).then(function (res) {
      data = res.data
      resolve(data);
    }).catch(function (err) {
      console.log(err);
    })
  });
}

/**
 * App theme 을 생성한다.
 * 
 * 이 theme 은 
 * import { useTheme } from '@mui/material/styles';
 * 
 * const theme = useTheme(); 으로 theme 접근 가능
 * 
 */
async function createCustomTheme() {
  const themeDataAll = await fetchThemeData();
  const themeData = themeDataAll.category
  const themeType = localStorage.getItem('themeMode');
  const style = document.documentElement.style
  if (themeDataAll) {
    Object.keys(themeDataAll.variable).forEach((element, inx) => {
      style.setProperty(element, themeDataAll.variable[element])
    });
  }

  /** theme store에 themeData를 설정: 할 필요가 없을 듯
   * import { useTheme } from '@mui/material/styles';
   * 
   * const theme = useTheme(); 으로 theme 접근 가능
  */
  themeStoreApi.getState().setThemeData(themeData);

  // Use the fetched data to create or modify your theme
  return createTheme({
    mode: themeType,
    // 테마 타입: theme.type 이것을 사용하기 보다는 themeData를 설정한다.
    type: themeType,
    // DB에 저장된 테마설정값, theme.themeData.xxx 로 접근가능
    themeData: {
      ...themeData
    },
    palette: themeType === 'system' ? {
      primary: {
        main: themeData.palette.primary.main,
        light: themeData.palette.primary.light,
        dark: themeData.palette.primary.dark,
        contrastText: themeData.palette.primary.contrastText
      },
      secondary: {
        main: themeData.palette.secondary.main,
        light: themeData.palette.secondary.light,
        dark: themeData.palette.secondary.dark,
        contrastText: themeData.palette.secondary.contrastText
      },
      error: {
        main: themeData.palette.error.normal,
        light: themeData.palette.error.light,
        dark: themeData.palette.error.strong,
        contrastText: themeData.palette.typography.color
      },
      warnning: {
        main: themeData.palette.warning.normal,
        light: themeData.palette.warning.light,
        dark: themeData.palette.warning.strong,
        contrastText: themeData.palette.typography.color
      },
      info: {
        main: themeData.palette.confirm.normal,
        light: themeData.palette.confirm.light,
        dark: themeData.palette.confirm.strong,
        contrastText: themeData.palette.typography.color
      },
      success: {
        main: themeData.palette.success.normal,
        light: themeData.palette.success.light,
        dark: themeData.palette.success.strong,
        contrastText: themeData.palette.typography.color
      },
    } : {},
    typography: {
      fontSize: parseInt(themeData.palette.typography.fontSize),
      fontFamily: themeData.palette.typography.fontFamily,
      caption: {
        color: themeData.palette.typography.color,
        fontSize: parseInt(themeData.palette.typography.fontSize),
        fontFamily: themeData.palette.typography.fontFamily,
      },
      button: {
        color: themeData.palette.typography.color,
        fontSize: parseInt(themeData.palette.typography.fontSize),
        fontFamily: themeData.palette.typography.fontFamily,
      },
      subtitle1: {
        color: themeData.palette.typography.color,
        fontSize: parseInt(themeData.palette.typography.fontSize),
        fontFamily: themeData.palette.typography.fontFamily,
      },
      body2: {
        color: themeData.palette.typography.color,
        fontSize: parseInt(themeData.palette.typography.fontSize),
        fontFamily: themeData.palette.typography.fontFamily,
      },
      overline: {
        color: themeData.palette.typography.color,
        fontSize: parseInt(themeData.palette.typography.fontSize),
        fontFamily: themeData.palette.typography.fontFamily,
      },
      body1: {
        color: themeData.palette.typography.color,
        fontSize: parseInt(themeData.palette.typography.fontSize),
        fontFamily: themeData.palette.typography.fontFamily,
      },
      subtitle2: {
        color: themeData.palette.typography.color,
        fontSize: parseInt(themeData.palette.typography.fontSize),
        fontFamily: themeData.palette.typography.fontFamily,
      },
      h1: {
        color: themeData.palette.typography.color,
        fontFamily: themeData.palette.typography.fontFamily,
      },
      h2: {
        color: themeData.palette.typography.color,
        fontFamily: themeData.palette.typography.fontFamily,
      },
      h3: {
        color: themeData.palette.typography.color,
        fontFamily: themeData.palette.typography.fontFamily,
      },
      h4: {
        color: themeData.palette.typography.color,
        fontFamily: themeData.palette.typography.fontFamily,
      },
      h5: {
        color: themeData.palette.typography.color,
        fontFamily: themeData.palette.typography.fontFamily,
      },
      h6: {
        color: themeData.palette.typography.color,
        fontFamily: themeData.palette.typography.fontFamily,
      },
      title: {
        color: themeData.palette.typography.color,
        fontWeight: "bold",
        fontSize: parseInt(themeData.palette.typography.fontSize)
      },
      subtitle: {
        color: themeData.palette.typography.color,
        fontWeigth: "bold",
        fontSize: parseInt(themeData.palette.typography.fontSize),
      },
    },
    spacing: 2,
    components: {
      MuiBreadcrumbs: {
        styleOverrides: {
          root: {
            color: themeData.palette.typography.color,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: themeData.palette.typography.fontFamily,
            fontSize: themeData.palette.typography.fontSize,
            height: "30px",
            minWidth: "60px",
            // padding: "5px",
            "&:hover": {
              // color: "#000000",
            },
            "&.Mui-disabled": {},
            textTransform: "inherit",
          }
        },
      },
      MuiButtonGroup: {
        styleOverrides: {
          root: {
            border: 0
          },
          grouped: {
          }
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            // margin: "3.5px 3.5px",
            fontFamily: themeData.palette.typography.fontFamily,
          },
        },
      },
      MuiFormGroup: {
        styleOverrides: {
          root: {},
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            // marginLeft: "6px",
            // marginTop: "1px",
            // fontFamily: themeData.palette.typography.fontFamily
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            fontFamily: themeData.palette.typography.fontFamily,
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: themeType === 'dark' ? themeData.palette.appBar.color : null,
            height: 20,
            width: 20,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            paddingLeft: 12,
            paddingRight: 12,
            minHeight: 30,
            textTransform: "inherit",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            fontFamily: themeData.palette.typography.fontFamily,
            color: themeData.palette.typography.color
          },
          input: {
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            //   top:'-3px', //기본값 가운데로, input height 에 따라 다르게 설정될수 있다.
            //   color: themeData.palette.inputField.color,
            // "&.MuiInputLabel-outlined.MuiInputLabel-shrink" : {
            //     transform: 'translate(12px, 7px) scale(0.75)',
            // },
            // "&.MuiInputLabel-outlined.Mui-focused" : {
            //   transform: 'translate(12px, 7px) scale(0.75)',
            // },
            //   "&.MuiInputLabel-filled.MuiInputLabel-shrink":{
            //     top: '-4px'
            //   },
            //   "&.MuiInputLabel-filled.Mui-focused":{
            //     top: '-4px'
            //   }
          }
        }
      },
      MuiList: {
        styleOverrides: {
          root: {
            fontFamily: themeData.palette.typography.fontFamily,
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            dense: true,
            fontFamily: themeData.palette.typography.fontFamily,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            fontFamily: themeData.palette.typography.fontFamily,
            // border: "1px solid #e2e2e1",
            borderRadius: "8px",
            backgroundColor: themeData.palette.inputField.backgroundColor,
            "&.Mui-disabled": {
              backgroundColor: themeData.palette.color.greyB,
            },
            minHeight: '40px'
          },
          notchedOutline: {
            //border: "none",
            border: "1px solid #a1a5ab", //MuiFilledInput과 맞춘다.
            borderRadius: "8px",
          }
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            fontFamily: themeData.palette.typography.fontFamily,
            color: themeData.palette.typography.color,
            border: "1px solid #e2e2e1",
            borderRadius: "8px",
            // padding: "0px 0px 0px 12px",
            // height: "45px",
            "&.Mui-focused": {
            },
            "&.Mui-focused:hover": {
            },
          },
          input: {},
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            fontFamily: themeData.palette.typography.fontFamily,
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            fontFamily: themeData.palette.typography.fontFamily,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            // margin: "3.5px 3.5px",
            fontFamily: themeData.palette.typography.fontFamily,
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            variant: "dense",
            fontFamily: themeData.palette.typography.fontFamily,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: themeData.palette.typography.color,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: themeData.palette.main.backgroundColor,
            color: themeData.palette.typography.color
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: themeData.palette.main.backgroundColor,
            color: themeData.palette.typography.color
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: themeData.palette.typography.color,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            // fontSize: parseInt(themeData.palette.typography.fontSize),
          },
        },
      },
      MuiListSubheader: {
        styleOverrides: {
          root: {
            backgroundColor: "#2e3440",
            color: themeData.palette.typography.color,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: themeData.palette.typography.color,
          },
        },
      },
      MuiColorInput: {
        styleOverrides: {
          root: {
            color: themeData.palette.typography.color,
          },
        },
      },
    },
  });
}

export default createCustomTheme;


