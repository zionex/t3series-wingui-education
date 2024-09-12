import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter, Redirect, Route } from 'react-router-dom';
import './App.css';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Login from '@wingui/view/pages/Login';
import Password from '@wingui/view/pages/Password';
import { uiSettings } from "@wingui/common/uiSettings";
import {
  SideBar, getAppSettings,
  getContentStore, useMenuStore, useWidgetStore, useUserStore, lo, initSettings, transLangKey, validateSession,
  useContentStore
} from '@zionex/wingui-core/index'
import { useThemeStore } from '@zionex/wingui-core/store/themeStore'
import createCustomTheme,{getAppStyle} from './style/theme';
import Loading from '@wingui/view/pages/Loading';
import { initLangSettings } from '@zionex/wingui-core/common/settings';
// import ExceptionHandler from '@zionex/wingui-core/component/ExceptionHandler';
import menuData from '@wingui/data/menus'
import { AppStyleProvider } from '@zionex/wingui-core/style/AppStyleProvider';
import { AppContextProvider } from '@zionex/wingui-core/context/AppContextProvider';
import LanguageRector,{setSessionLang} from './LangageRector';
import Content from '@wingui/layout/Content'
// let initApp = false;
let initLoginPage = false;
let initUiSetting = false;

function App() {
  const [appStyle, setAppStyle] = useState(getAppStyle())
  const [route, setRoute] = useState(null);
  const [menus, initMenu] = useMenuStore(state => [state.menus, state.initMenu])
  const [logout, isLogin, passwordExpired,initApp, setInitApp] = useUserStore(state => [state.logout, state.isLogin, state.passwordExpired, state.initApp, state.setInitApp])
  const [setMenuPosition, setUiSettings] = getContentStore(state => [state.setMenuPosition, state.setUiSettings])
  const languageCode = useContentStore(s=> s.languageCode)

  const initWidget = useWidgetStore(state => state.initWidget)
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [themeMode, setTheme, theme] = useThemeStore(state => [state.themeMode, state.setTheme, state.theme]);
  const [appTheme, setAppTheme] = useState(null);
  if (!initUiSetting) {
    setUiSettings(uiSettings)
    initUiSetting = true;
  }

  if (isLogin && initApp == false) {
    initSettings(function () {
      lo.init();

      initMenu(uiSettings.mode, menuData)
      initWidget(uiSettings.mode)

      if (localStorage.getItem('menuType')) {
        setMenuPosition(localStorage.getItem('menuType'))
      } else {
        setMenuPosition(getAppSettings('defaultMenuType'))
      }

      if (localStorage.getItem('preference-group') === null) {
        localStorage.setItem('preference-group', '[]');
      }
      flatpickr.setDefaults({ locale: localStorage.getItem("languageCode") })
      flatpickr.l10ns.default.weekAbbreviation = transLangKey("FP_WEEK_ABBREVIATION");

      setSessionLang(languageCode)
    });
    setInitApp(true)
    initLoginPage = true;
  } else {
    if (initLoginPage == false) {
      initLangSettings()
    }
    initLoginPage = true;
  }

  async function focusListener(event) {
    validateSession()
  }

  useEffect(() => {
    window.addEventListener("focus", focusListener, false);

    return () => {
      //umount 시 제외
      window.removeEventListener("focus", focusListener)
    }
  }, [])

  useEffect(() => {
    async function renderApp() {
      const theme = await createCustomTheme();
      setAppTheme(theme)
    }
    renderApp()
  }, [themeMode])

  useEffect(() => {
    setTheme(appTheme)
  }, [appTheme])

  useEffect(() => {
    if (isLogin) {
      setRoute(<>
        <SideBar menus={menus} />
        <Content />
      </>)
    } else {
      if (passwordExpired) {
        setRoute(<Redirect to={{ pathname: "/password" }} />)
      } else {
        setRoute(<Redirect to={{ pathname: "/login" }} />)
      }
    }
  }, [isLogin, menus])

  const getLogin = () => {
    return (
      <>
        <Route path="/password" render={(props) => <Password {...props} />} />
        <Route path="/login" render={(props) => <Login {...props} />} />
        {
          passwordExpired ? <Redirect to={{ pathname: "/password" }} /> :
            <Redirect to={{ pathname: "/login" }} />
        }
      </>
    )
  }
  return (
    <> {appTheme ?
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <AppStyleProvider commonStyle={appStyle}>
            <Suspense fallback={<Loading />}>
              <HashRouter>
                <Route path="/password" render={(props) => <Password {...props} />} />
                <Route path="/login" render={(props) => <Login {...props} />} />
                {route ? route : null}
              </HashRouter>
            </Suspense>
          </AppStyleProvider>
        </ThemeProvider>
        <LanguageRector languageCode={languageCode} isLogin={isLogin}/>
      </StyledEngineProvider>
      : null}
    </>
  );
}

export default App;
