import React, { useState, useEffect, useContext } from "react";
import { createStyles, makeStyles } from '@mui/styles';
import { Avatar } from "@mui/material";
import PropTypes from 'prop-types';


export const useAppBarStyles = makeStyles(theme => ({
  appBar: {
    boxShadow: "none",
    backgroundColor: theme.themeData.palette.base.colorA,
  },
  appToolBar: {
    backgroundColor: theme.themeData.palette.base.colorA,
    minHeight: "38px",
  },
  appBarMenuInput: {
    color: theme.themeData.palette.appBarMenuInput.color,
    "& .MuiInputBase-input": {
      color: theme.themeData.palette.appBarMenuInput.color,
    },
    "& .MuiInputBase-root": {
      borderBottom: "1px solid " + theme.themeData.palette.appBarMenuInput.color,
    },
    "& .MuiIconButton-root": {
      color: theme.themeData.palette.appBarMenuInput.color,
    },
  },
  appBarTextButton: {
    border: "1px solid #5d92bd",
    color: theme.themeData.palette.appBar.color,
    marginRight: "1px",
    height: "28px",
    borderRadius: "4px",
    "& .MuiTypography-root": {
      color: theme.themeData.palette.appBar.color,
    },
    textTransform: "inherit"
  },
  appBarIconButton: {
    "& .MuiSvgIcon-root": {
      height: 24,
      width: 24,
      color: theme.themeData.palette.appBar.color,
    },
  },
  appBarFloatPaper: {
    position: 'absolute',
    zIndex: 9999999,
    top: 30,
    left: 0,
    width: '280px',
    height: "400px",
    border: "1px solid #e9e9e9",
    /* backgroundColor: "#e9e9e9", */
    borderRadius: 4,
    padding: 0,
    margin: 0,
    boxShadow:
      "rgb(0 0 0 / 20%) 0px 1px 3px 0px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 2px 1px -1px",
  },
}));


export const useContentStyles = makeStyles(theme => (
  {
    main: {
      display: "flex",
      width: "100vw",
      minWidth: 0,
      height: "100vh",
      /* min-height: 100vh, */
      transition:
        "margin-left .35s ease-in-out, left .35s ease-in-out, margin-right .35s ease-in-out, right .35s ease-in-out",
      background: theme.themeData.palette.main.backgroundColor,
      flexDirection: "column",
      overflow: "hidden",
    },
  }
))

export const useWorkAreaStyles = makeStyles(theme => (
  {
    workArea: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
  }
))

export const useTabContentStyles = makeStyles(theme => (
  {
    tabContent: {
      whiteSpace: "nowrap",
      // borderBottom: theme.palette.tabContent.borderBottom,
      background: theme.themeData.palette.base.colorA,
      "& .MuiTab-root>.MuiSvgIcon-root": {
        height: 12,
        width: 12,
        position: 'absolute',
        top: 10,
        right: 14,
        strokeWidth: 2,
      },
      "& .MuiTabs-root": {
        height: 32,
        minHeight: 32,
        flexWrap: 'wrap',
        paddingLeft: 0,
        marginBottom: 0,
        listStyle: 'none',
        // margin: '5px 0.25rem 0 0.25rem',
        flexWrap: 'nowrap',
        /* overflowX: 'scroll', */
        overflowY: 'hidden',
        // border: 0,
        "& .MuiTabs-indicator": {
          height: 0
        }
      },
      "& #tabSetup": {
        opacity: 1,
        flexShrink: 0,
        paddingLeft: '10px',
        paddingTop: '2px',
        justifyContent: 'center',
        display: 'flex',
        right: 0,
        zIndex: 100,
        float: 'right'
      },
      "& .MuiTab-root": {
        color: "#e8e8e8",
        // backgroundColor: theme.palette.primary.dark,
        marginRight: 0,
        minWidth: '10px',
        minHeight: '32px',
        // border: '1px solid ' + theme.palette.primary.dark,
        // padding: '0.45rem 0.25rem 0.55rem 0.6rem',
        display: 'block',
        padding: '8px 12px',
        transition: 'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out',
        textTransform: "inherit",
        textOverflow: "ellipsis",
        paddingRight: '40px',
        position: 'relative',
      },
      "& .MuiTab-root:hover": {
        // color: theme.palette.primary.light
      },
      "& .MuiTab-root.Mui-selected": {
        color: `${theme.type === 'dark' ? theme.themeData.palette.sidebarSelectedItem.color : theme.themeData.palette.base.colorC} !important` ,
        backgroundColor: `${theme.themeData.palette.main.backgroundColor} !important`,
        fontWeight: 'bold',
        borderTopLeftRadius: '0.6rem',
        borderTopRightRadius: '0.6rem',
      },
      "& .MuiTab-root.Mui-selected > .v-line": {
        border: "0 !important"
      },
      "& .MuiTabs-flexContainer > a:last-child > .v-line": {
        border: "0 !important"
      },
      "& .MuiTabs-scrollButtons": {
        color: theme.themeData.palette.color.white,
      }
    },
  }
))

export const LEFT_SEARCH_AREA_WIDTH = 300;
export const LEFT_SEARCH_AREA_PADDING = 10;

export const useSearchAreaStyles = makeStyles(theme => (
  {
    searchArea: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      overflow: 'hidden',
      width: '100%',
      border: '1px solid #E0E0E0',
      // borderRight: '1px solid #E0E0E0 !important',
      backgroundColor: theme.themeData.palette.searchArea.backgroundColor,
      margin: 0,
      padding: '6px 3px 4px 3px',
    },
    FormArea: { //입력 폼
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      border: '1px solid #E0E0E0',
      // backgroundColor: "#fff",
      backgroundColor: theme.themeData.palette.searchArea.backgroundColor,
      margin: 0,
      padding: '5px 3px 5px 3px',
    },

    leftSearchArea: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      height: '100%',
      width: `${LEFT_SEARCH_AREA_WIDTH}px`,
      backgroundColor: theme.themeData.palette.searchArea.backgroundColor,
      margin: 0,
      padding: `${LEFT_SEARCH_AREA_PADDING}px`,
      border: 'none',
      overflowX: 'hidden',
      overflowY: 'auto',
    },
    searchAreaLeftContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    searchCollapse: {
      height: "calc(95%)",
      "& .MuiCollapse-wrapper": {
        height: "100%",
      },
    },
    searchAreaItem: {
      padding: 0,
      margin: 0,
      gridRow: '1',
      gridColumn: 'span 2'
    },
    searchAreaItemBox: {
      padding: 0,
      margin: 0,
      backgroundColor: theme.themeData.palette.searchArea.backgroundColor,
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      '& > div:first-child > div:first-child': {
        // borderTop: props => props.searchPosition == 'left' ? '1px solid #dde1ee' : 'none'
      }
    },
    searchAreaButton: {
    },
  }
))

export const useContentInnerStyles = makeStyles(theme => (
  {
    content: {
      padding: '0 20px 5px 20px',
      display: 'flex',
      alignContent: 'stretch',
      alignItems: 'stretch',
      height: '100% !important',
      width: '100% !important',
      overflow: 'hidden',
      flexDirection: props => props.searchPosition == 'left' ? 'row' : 'column',
      "& .MuiCollapse-hidden": {
        width: props => props.searchPosition == 'left' ? '0px !important' : 'auto'
      },
    },
  }
))

export const useTabSetupStyles = makeStyles(theme => (
  {
    tabSetupBox: {
      position: 'absolute',
      height: 400,
      top: 28,
      zIndex: 999,
      right: 0,
    },
    tabSetupListBox: {
      maxHeight: 'calc(100% - 45px)',
      minHeight: '350px',
      margin: '2px',
      overflow: 'auto',
      boxShadow: 'none',
    },
    tabSetupButtonBox: {
      display: 'block',
      width: '100%',
      height: '40px',
      textAlign: 'right',
      "& .MuiButton-root": {
        border: 0
      }
    },
    tabIcon: {
      color: theme.themeData.palette.color.white
    }
  }
))

export const useLoginStyles = makeStyles(theme => (
  {
    loginBox: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      transition: 'margin-left .35s ease-in-out, left .35s ease-in-out, margin-right .35s ease-in-out, right .35s ease-in-out',
      overflow: 'hidden',
      backgroundColor: theme.type === 'dark' ? '#2b2b2b' : '#ffffff'
    },
    loginContentBox: {
      display: 'flex',
      alignItems: 'left',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  }
))

export const useFloatIssueListStyles = makeStyles(theme => (
  {
    issueList: {
      width: '400px',
      height: '410px',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgb(226, 226, 225)',
    },
    issueListTitleBox: {
      fontWeight: 500,
      fontSize: '15px',
    },
    issueListTitle: {
      paddingLeft: '10px'
    },
  }
))



export const usePopupDialogStyles = makeStyles(theme => (
  {
    resizable: {
      position: "relative",
      "& .react-resizable-handle": {
        position: "absolute",
        width: "20px",
        height: "20px",
        bottom: "0",
        right: "0",
        background:
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+')",
        "background-position": "bottom right",
        // padding: "0 3px 3px 0",
        "background-repeat": "no-repeat",
        "background-origin": "content-box",
        "box-sizing": "border-box",
        cursor: "se-resize"
      }
    },
    popupDialogTitle: {
      cursor: "move",
      display: "flex",
      height: '40px',
      background: theme.type === 'dark' ? '#1b1e25' : '#222e3c',
      color: "#fff",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 14px"
    },
    popupDialogTitleIcon: {
      cursor: "pointer"
    },
  }
))

export const useResultAreaStyles = makeStyles(theme => (
  {
    resultArea: {
      margin: "3px 0",
      width: props => props.style !== undefined && props.style.width !== undefined ? props.style.width : '100%',
      height: props => props.style !== undefined && props.style.height !== undefined ? props.style.height : '100%',
    },
  }
))

export const useViewPathStyles = makeStyles(theme => (
  {
    viewPath: {
      margin: "2px 20px"
    },
    viewPathIconButton: {
      borderRadius: "6px",
      width: "35px",
      height: "30px",
      border: theme.type == 'dark' ? 'none' : "1px solid #bebec0",
      "& .Mui-disabled": {
        backgroundColor: "#f8f8fa",
        border: "1px solid #bebec0",
        borderRadius: "0",
      },
    },
  }
))

export const useHistoryStyles = makeStyles(theme => (
  {
    historyPaper: {
      height: '100%',
      margin: 0,
      padding: '0px 15px',
    },
    historyTopBox: {
      display: 'inline-flex',
      width: '100%',
      height: '40px',
      justifyContent: 'space-between'
    },
    historyTitleBox: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '10px'
    },
    historyListPaper: {
      maxHeight: 'calc(100% - 45px)',
      overflow: 'auto',
      margin: '2px',
      boxShadow: 'none'
    },
    historyListBox: {
      width: '100%',
      padding: '0px 2px',
    },
    historyListItem: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      margin: '4px 0px',
      borderRadius: '5px',
      backgroundColor: theme.type == 'dark' ? '#1c2a3e' : '#f3f3f3'
    },
    historyListItemText: {
      paddingLeft: "10px",
      "& .MuiListItemText-secondary": {
        color: theme.type === 'dark' ? '#969696' : '#919191'
      }
    },
  }
))

export const useFavoriteStyles = makeStyles(theme => (
  {
    favoritePaper: {
      height: '100%',
      margin: 0,
      padding: '0px 15px',
    },
    favoriteTopBox: {
      display: 'inline-flex',
      height: '40px',
      width: '250px',
      justifyContent: 'space-between'
    },
    favoriteTitleBox: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '10px'
    },
    favoriteListPaper: {
      maxHeight: 'calc(100% - 45px)',
      overflowY: 'auto',
      margin: '2px',
      boxShadow: 'none',
    },
    favoriteListBox: {
      width: '100%',
      padding: '0px 2px',
    },
    favoriteListItem: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      margin: '4px 0px',
      borderRadius: '5px',
      backgroundColor: theme.type == 'dark' ? '#1c2a3e' : '#f3f3f3'
    },
    favoriteListItemText: {
      paddingLeft: "10px"
    },
  }
))

export const useWorkflowStyles = makeStyles(theme => (
  {
    workflowPaper: {
      width: '350px',
      height: '450px',
      borderRadius: 4,
      padding: 0,
      margin: 0,
      overflow: 'hidden'
    },
    workflowTopBox: {
      display: 'inline-flex',
      height: '8%',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      // background: theme.themeData.palette.primary.dark,
      paddingRight: '4px',
      // color: theme.themeData.palette.primary.contrastText,
      "& .MuiSvgIcon-root": {
        // color: theme.themeData.palette.primary.contrastText,
      },
      "& .MuiBackdrop-root": {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
      }
    },
    workflowTitleBox: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '4px',
      "& .MuiSelect-select": {
        paddingLeft: '6px'
      },
      "& .MuiOutlinedInput-root": {
        background: 'transparent',
        // color: '#fff',
        minHeight: 0,
        fontSize: theme.themeData.palette.typography.fontSize
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: 'none'
      }
    },
    workflowActionListIcon: {
      minWidth: '30px',
      "& .MuiSvgIcon-root": {
        color: theme.themeData.palette.typography.color,
      },
    },
    workflowStepPaper: {
      maxHeight: 'calc(100% - 40px)',
      margin: '2px',
      boxShadow: 'none'
    },
    workflowStepper: {
      width: '100%',
      padding: '8px 16px',
      "& .MuiStepConnector-root": {
        marginLeft: '10px'
      },
      "& .MuiStepConnector-line": {
        minHeight: '15px'
      },
    },
    workflowLink: {
      color: theme.themeData.palette.typography.color
    },
    workflowEditBox: {
      "& .MuiSvgIcon-root": {
        color: theme.themeData.palette.typography.color,
      },
    },
    workflowList: {
      width: '100%',
      height: '320px',
      paddingTop: 0,
      overflow: 'auto',
    },
    workflowListItem: {
      width: '100%',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '4px 8px 4px 14px',
      borderRadius: '5px',
      backgroundColor: theme.type == 'dark' ? '#212121' : '#fff'
    },
    workflowSelectedItem: {
      width: '100%',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '4px 8px 4px 14px',
      borderRadius: '5px',
      backgroundColor: theme.type == 'dark' ? '#1c2a3e' : '#f3f3f3',
      "& .MuiSvgIcon-root": {
        color: theme.themeData.palette.typography.color,
      },
      "& .MuiInputBase-root": {
        minHeight: '36px'
      }
    },
    workflowListItemText: {
      paddingRight: '8px',
      fontWeight: 'bold'
    },
  }
))

export const useLocaleSetupStyles = makeStyles(theme => (
  {
    localeSetup: {
      position: 'absolute',
      top: 23,
      right: 0,
      zIndex: 1000,
      "& .MuiSvgIcon-root": {
        height: 24,
        width: 24,
        color: theme.themeData.palette.typography.color,
      },
    },
    localeSetupHeader: {
      display: "flex",
      height: "4%",
      // background: theme.themeData.palette.color.white,
      padding: "5px",
      "& .MuiTypography-root": {
        fontSize: theme.themeData.palette.typography.fontSize,
        color: theme.themeData.palette.typography.color,
      },
    },
  }
))

export const useTabContainerStyles = makeStyles(theme => (
  {
    tabContainer: {
      "& .MuiTabs-root": {
        height: 42,
        minHeight: 42
      },
      "& .MuiTab-root": {
        textTransform: "inherit"
      },
      "& #tabpanels": {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      },
      '& [role*="tabpanel"]': {
        width: "100%",
        height: "100%",
        padding: "5px"
      }
    },
  }
))

export const useButtonAreaStyles = makeStyles(theme => (
  {
    ButtonTitle: {
      "&:before": {
        content: "''",
        display: "inline-block",
        padding: "3px 7px 9px 0px",
        border: "1px solid #d24b4b",
        borderWidth: "0 0 0 3px",
      },
      color: theme.themeData.palette.typography.color,
      fontWeight: "bold",
      fontSize: "15px",
      marginRight: "15px"
    },
    textButton: {}
  }
))

export const useSearchMenuStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiPaper-root": {
        minWidth: 220,
      },
      "& .MuiAutocomplete-listbox": {
        border: "1px solid #dee2e6",
        fontFamily: theme.themeData.palette.typography.fontFamily,
        minHeight: 400,
        height: 10,
        "& :hover": {},
        "& li:hover": {},
      },
      "& .MuiAutocomplete-inputRoot": {
        padding: 0,
      },
      "& .MuiListSubheader-root": {
        backgroundColor:
          theme.type == "dark" ? "#313743" : "#ffffff",
      },
    },
    textfield: {
      "& .MuiInputBase-input.MuiAutocomplete-input": {
        fontFamily: theme.themeData.palette.typography.fontFamily,
        marginTop: 0,
        padding: 0,
      },
      "& .MuiOutlinedInput-marginDense": {
        padding: 0,
      },
    },
    autoComplete: {
      "& .MuiAutocomplete-inputRoot": {
        padding: "0px 4px",
        height: "30px",
      },
      '& [class*="MuiOutlinedInput-root"] .MuiAutocomplete-input': {
        padding: "0px 4px",
      },
    },
    list: {
      '& a ': {
        color: theme.type == "dark" ? "#c6cad0" : "#2f2f2f"
      }
    },
  })
);

export const useIconStyles = makeStyles((theme) => ({
  root: {},
  iconButton: {},
  FILE_SAVE: {
    color: "transparent",
    backgroundColor: "transparent",
    borderRadius: "2px",
  },
  gridIconButton: {
    margin: "2px 0",
    color: theme.themeData.palette.iconButton.color,
  },
}));

export const useSidebarStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: 0,
    height: "100%",
    background: theme.themeData.palette.base.colorA,
    borderRight: theme.themeData.palette.sidebar.borderRight,
  },
  brandLogo: {
    fontWeight: "600",
    fontSize: "1.15rem",
    padding: "1.15rem 1.5rem",
    display: "block",
    color: "#f8f9fa",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "1.5rem center",
    height: "5.5rem",
  },
  noScrollBar: {
    overflowY: "scroll",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
      width: 0,
      height: 0,
    },
    height: "90%",
    margin: 0,
    padding: 0,
    color: "#ebe9e9",
    background: theme.themeData.palette.base.colorA,
    boxShadow: "none",
  },
  list: {
    width: "100%",
    maxWidth: 260,
    color: "#ebe9e9",
    "& span": {
      fontWeight: 400,
      color: '#ffffff',
    },
  },
  item: {
    paddingTop: 4,
    paddingBottom: 4,
    background: theme.themeData.palette.sidebarItem.background,
    color: "#ebe9e9",
    fontWeight: 400,
    "& :hover": {
      color: "#ebe9e9",
    },
  },
  selectedItem: {
    paddingTop: 4,
    paddingBottom: 4,
    background: theme.themeData.palette.base.colorA,
    "& span": {
      color: theme.themeData.palette.sidebarSelectedItem.color,
      fontWeight: "bold",
    },
  },
  span: {
    marginLeft: 4,
    "& span::before": {
      display: "block",
      position: "relative",
      left: "-17px",
      transition: "all .1s ease",
      transform: "translateX(0)",
      top: "0.9em",
      width: 4,
      height: 4,
      background: theme.themeData.palette.sidebarSpanBefore.background,
    },
  },
}));

export const useAllMenuStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: 'absolute',
      top: 30,
      left: 0,
      zIndex: 9999999,
      height: 800,
      width: 1640,
      border: "1px solid #efefef",
      borderRadius: "4px",
      backgroundColor: theme.type == "dark" ? "#313743" : "#ffffff",
    },
    list: {
      listStyleType: "none",
      display: "block",
      '& > li ': {
        listStyle: "none",
        float: "left",
      },
      '&  ul > li ': {
        listStyle: "none",
        position: "relative",
      },
      '& a ': {
        color: theme.type == "dark" ? "#c6cad0" : "#2f2f2f",
      }
    },
    listItem: {
      width: 'fit-content',
      display: 'inline-flex',
      flexDirection: 'column',
      padding: '0px 10px',
      backgroundColor: theme.type === 'dark' ? '#242832' : '#f8f8f8',
      borderRadius: '5px',
      margin: '5px'
    },
    ul: {
      flexWrap: "wrap",
      listStyle: "none",
      paddingLeft: 0,
      height: "300px",
      flexDirection: "column",
      display: "flex",
      justifyContent: "start",
      flexWrap: "wrap",
      width: "100%",
    },
    li: {
      width: "fit-content",
      padding: "0.4rem",
    },
    parentMenu: {
      color: theme.type === 'dark' ? '#d3d3d3' : '#3f5268',
      height: "40px",
      lineHeight: "40px",
      textAlign: "left",
      fontWeight: 'bolder',
      fontSize: '14px',
      paddingLeft: '3px',
      borderBottom: theme.type === 'dark' ? '3px solid #999' : '3px solid #e1e1e1',
    },
    mediumMenu: {
      fontWeight: "bold",
    },
    smallMenu: {
      marginLeft: "8px",
    }
  }));

export const useFloatMenuStyles = makeStyles((theme) => createStyles({
  root: {
    width: "100%",
    color: "#ebe9e9",
    "& .MuiTypography-root": {
      color: "#ebe9e9",
    },
    "& span": {
      fontWeight: 400,
    },
  },
  container: {
    maxHeight: 800,
    width: 310,
    border: "1px solid #e9e9e9",
    borderRadius: 2,
    boxShadow:
      "rgb(0 0 0 / 20%) 0px 1px 3px 0px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 2px 1px -1px",
    position: 'absolute',
    top: 30,
    zIndex: 9999999,
  },
  item: {
    paddingTop: 2,
    paddingBottom: 2,
    background: "#284461",
    color: "#ebe9e9",
    fontWeight: 400
  },
  selectedItem: {
    paddingTop: 4,
    paddingBottom: 4,
    background: "#284461",
    "& span": {
      color: "#ffc800",
      fontWeight: "bold",
    },
  },
  span: {
    marginLeft: 4,
    color: "#ebe9e9",
    '& span::before': {
      left: "-17px",
      top: "0.9em",
      width: 4,
      height: 4,
      background: "#ebe9e9",
      display: "block",
      position: "relative",
      transition: "all .1s ease",
      transform: "translateX(0)",
    }
  },
  paper: {
    m: 0, padding: '20px', color: '#ebe9e9', background: '#222E3C'
  },
  titleStyle: {
    fontFamily: '"Noto Sans KR", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
    fontSize: '15px',
    color: '#141B43',
    paddingLeft: '10px'
  },
  innerBoxStyle: {
    margin: 0,
    padding: 0,
    maxHeight: '800px',
    background: '#222E3C',
    display: 'flex',
    flexDirection: 'column'
  },
  iconStyle: {
    color: '#fff',
    width: '18px',
    height: '18px'
  }

}));

export const useLargeMenuDropdownStyles = makeStyles((theme) => createStyles({
  root: {
    maxHeight: 800,
    position: 'absolute',
    top: 30,
    left: -176,
    zIndex: 9999999
  }
}));

export function CustomIcon(props) {
  const { type, size } = props;
  useEffect(() => {
  });

  const styles = {
    img: {
      width: `${size}`,
      height: `${size}`,
    },
  };

  switch (type) {
    case 'FILE_SAVE':
      return <Avatar><Icon.FILE_SAVE /></Avatar>;
    default:
      return <Avatar><Icon.FILE_SAVE /></Avatar>;
  }
}


export const useDashboardStyle = makeStyles((theme) => createStyles({
  //DashboardPanel
  Container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: theme.themeData.palette.dashboard.backgroundColor,
    borderRadius: "10px",
  },
  ActionBar: {
    padding: '13px 4px 6px 4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '30px',
    "& .Mui-disabled": {
      color: theme.type === 'dark' ? '#616161!important' : '#b7b8b7!important'
    }
  },
  GridLayoutBox: {
    width: '100%',
    height: '100%',
    display: 'block',
    position: 'relative'
  },
  ReactGridLayout: {
    overflow: 'hidden',
    overflowY: 'auto'
  },
  //DashboardPanel 끝
  //DashboardPanel WidgetList Popover
  viewListPopover: {
    '& .MuiBox-root': {
      width: '100%',
      height: '100%',
    },
    '& .MuiFormControl': {
      border: '1px solid #e2e2e1',
      width: 200,
      padding: 5,
      margin: 1,
      borderRadius: 2
    },
    '& .MuiFormControl > .MuiBox-root': {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    '& .MuiFormControl > .MuiBox-root > & .MuiFormLabel-root': {
      fontWeight: 'bold',
      width: 35,
      fontSize: 10
    }
  },
  span1: {
    display: 'block',
    marginLeft: 10
  },
  span2: {
    display: 'block',
    marginLeft: 2
  }
  //DashboardPanel WidgetList Popover 끝
}));



export const useWidgetStyle = makeStyles((theme) => createStyles({
  content: {
    padding: "5px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    overflow: "hidden",
    backgroundColor: theme.themeData.palette.widget.backgroundColor,
    borderRadius: "8px",
  },
  header: {
    display: "inline-flex",
    borderBottom: "1px solid #3e84ab",
    padding: "2px 10px",
    overflow: "hidden",
    height: "30px",
    background: theme.themeData.palette.widgetHeader.backgroundColor,
    borderRadius: "10px 10px 0 0",
    // title: {
    //   color: theme.palette.widgetHeader.color,
    //   fontWeight: "500",
    // },
    // icon: {
    //   color: theme.palette.widgetHeader.color,
    // },
  },
  headerTitle: {
    color: theme.themeData.palette.widgetHeader.color,
    fontWeight: "500",
  },
  headerIcon: {
    color: theme.themeData.palette.widgetHeader.color,
  },
  boardTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#98a7bd",
    textAlign: "center",
    paddingBottom: "2px"
  },
  contentBoxStyle: {
    display: 'flex',
    flexDirection: 'column',
    width: "100%",
    height: "100%",
    justifyContent: 'space-evenly',
    backgroundColor: theme.type === 'dark' ? '#2c2f36' : '#f7f7f7',
    padding: '1%',
    borderRadius: 10,
    border: theme.type === 'dark' ? '1px solid #222' : '1px solid #f3f3f3',
    position: 'relative'
  },
  tonBox: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#3a7cb9',
    display: 'block',
    textAlign: 'right',
    borderRadius: '5px',
    textAlign: 'center'
  },
  percentStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: "16px",
    fontWeight: 'bold',
    color: "#28247d"
  },
}));

CustomIcon.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.number,
};

CustomIcon.defaultProps = {
  size: 32
};
