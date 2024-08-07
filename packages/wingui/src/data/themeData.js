export const componentPalette = [
  {
    themeCd: 'light',
    category: 'component',
    propertyType: 'Main',
    property: 'root',
    propertyValue: `{
      display: "flex",
      width: "100vw",
      minWidth: 0,
      height: "100vh",
      transition: "margin-left .35s ease-in-out, left .35s ease-in-out, margin-right .35s ease-in-out, right .35s ease-in-out",
      background: "#ffffff",
      flexDirection: "column",
      overflow: "hidden"
    }`,
    referenceName: ''
  },
  {
    themeCd: 'light',
    category: 'component',
    propertyType: 'SideBar',
    property: 'root',
    propertyValue: `
      margin: 0,
      padding: 0,
      height: '100%',
      background: '#ffffff'
    `,
    referenceName: ''
  },
  {
    themeCd: 'light',
    category: 'component',
    propertyType: 'SideBar',
    property: 'noScrollBar',
    propertyValue: `
      overflowY: 'scroll',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
        width: 0,
        height: 0
      },
      height: '90%',
      margin: 0,
      padding: 0,
      color: '#ebe9e9',
      background: '#ffffff'
    `,
    referenceName: ''
  },
  {
    themeCd: 'light',
    category: 'component',
    propertyType: 'SideBar',
    property: 'list',
    propertyValue: `{
      width: "100%",
      maxWidth: 260,
      color: '#ebe9e9',
      '& span': {
        fontSize: 12,
        fontWeight: 400,
      },
    }`,
    referenceName: ''
  },
  {
    themeCd: 'light',
    category: 'component',
    propertyType: 'BaseGrid',
    property: 'header',
    propertyValue: {
      backgroundColor: '#f4f6fb'
    },
    referenceName: ''
  },
]

export const themeLightPalette = {
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#212121',
      light: '#e0e0e0',
      dark: '#222E3C',
      contrastText: '#fafafa',
    },
    background: {
      main: '#ffffff'
    },
    text: {
      main: '#000000'
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50"
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#d32f2f",
    },
  },
  variables: {
    '--grid-fontFamily' : '"Noto Sans KR", "Helvetica", "Arial", sans-serif',
    '--grid-fontSize' : '12px', 
    '--grid-header-height' : '30px',
    '--grid-row-height' : '28px',
    '--grid-header-color' : '#4e545f',
    '--grid-header-backgroundColor' : '#f4f6fb',
    '--grid-footer-backgroundColor' : '#ffffff',
    '--grid-fix-footer-color' : '#1565c0',
    '--grid-footer-fontWeight' : 'bold',
    '--grid-footer-color' : '#0000000',
    '--grid-summary-column-color': '#4e545f',
    '--grid-summary-column-background' : '#d3e8f8',
    '--grid-fix-column-bar-background' : '#1565c0',
    '--grid-group-panel-background' : '#ffffff',
    '--grid-focused-row-background' : '#DBEBFB'
  }
}

export const themeDarkPalette = {
  palette: {
    primary: {
      main: '#212121',
      light: '#e0e0e0',
      dark: '#222E3C',
      contrastText: '#fff',
    },
    secondary: {
      main: '#2196f3',
      light: '#e3f2fd',
      dark: '#212121',
      contrastText: '#000',
    },
    background: {
      main: '#ffffff'
    },
    text: {
      main: '#000000',
      light: '#000000'
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50"
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#d32f2f",
    },
  },
  variables: {
    '--grid-fontFamily' : '"Noto Sans KR", "Helvetica", "Arial", sans-serif',
    '--grid-fontSize' : '12px', 
    '--grid-header-height' : '30px',
    '--grid-row-height' : '28px',
    '--grid-header-color' : '#ffffff',
    '--grid-header-backgroundColor' : '#222222',
    '--grid-footer-backgroundColor' : '#ffffff',
    '--grid-fix-footer-color' : '#1565c0',
    '--grid-footer-fontWeight' : 'bold',
    '--grid-footer-color' : '#0000000',
    '--grid-summary-column-color': '#000000',
    '--grid-summary-column-background' : '#bdd6ec',
    '--grid-fix-column-bar-background' : '#1565c0',
    '--grid-group-panel-background' : '#ffffff',
    '--grid-focused-row-background' : '#DBEBFB',
  }
}