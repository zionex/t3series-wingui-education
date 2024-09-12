import React, { useEffect, Suspense, useState, useRef } from "react";
import { useHistory, useLocation } from 'react-router-dom';
import { CacheSwitch, CacheRoute } from "react-router-cache-route";
import { Box, Typography } from "@mui/material";
import {
  Dialog, Toast, LoadingBar,
  useContentStore, useHistoryModel, useMenuStore,
  useViewStore, transLangKey, getAppSettings, zAxios, isNewWindowMode
} from "@zionex/wingui-core/index";
import { TabContent } from "@zionex/wingui-core/layout/TabContent";
import baseURI from "@zionex/wingui-core/utils/baseURI";

import { ViewPath } from "./ViewPath";

import NavBar from "@zionex/wingui-core/layout/NavBar";
import Drawer from '@mui/material/Drawer';
import IssueReadBox from "@zionex/wingui-core/utils/issue/IssueReadBox";
import { captureStoreApi } from '@zionex/wingui-core/store/captureStore'
import MessageBox from "@zionex/wingui-core/component/MessageBox";

import { UserViewHistory } from "@zionex/wingui-core/utils/UserViewHistory";
import Loading from '@wingui/view/pages/Loading';
import CustomTooltip from "@zionex/wingui-core/component/CustomTooltip";


function ActiveViewRouter(props) {
  const [activeViewId,
    setActiveViewId,
    tabContentData,
    addContentData,
    updateContentData] = useContentStore((state) =>
      [state.activeViewId,
      state.setActiveViewId,
      state.contentData,
      state.addContentData,
      state.updateContentData
      ]);

  const [menus, views, settings, getContentDataFromViewId, getContentDataFromPath] =
    useMenuStore(state => [state.menus, state.views, state.settings,
    state.getContentDataFromViewId, state.getContentDataFromPath]);

  const addHistory = useHistoryModel(state => state.addHistory)
  const [getViewInfo, setViewInfo] = useViewStore(state => [state.getViewInfo, state.setViewInfo]);
  let location = useLocation();
  let history = useHistory();

  useEffect(() => {
    if (getViewInfo(activeViewId, 'permissions') === null) {
      if (activeViewId) {
        zAxios.get('/system/users/permissions/' + activeViewId, { waitOn: false, headers: getHeaders(), }).then(
          res => {
            setViewInfo(activeViewId, 'permissions', res.data)
          })
      }
    }
  }, [activeViewId])

  useEffect(() => {
    if (document.querySelector('.k-animation-container .k-slide-down-enter-active') !== null) {
      window.kendo.jQuery('.k-animation-container').hide()
    }
    let home = '';
    if (settings.authentication != undefined) {
      let defaultUrl = settings.authentication.defaultUrl;
      if (defaultUrl.includes('home')) {
        home = 'home'
      } else {
        home = defaultUrl.replace(baseURI(), '')
      }
    }
    if (location.pathname === '/') {
      if (activeViewId) {
        let activeCont = getContentDataFromViewId(activeViewId);
        if (activeCont && activeCont.pathname) {
          home = activeCont.pathname
        }
      }
      history.push('/' + home)
    } else {
      if (location.pathname !== '/login') {
        addTabContentData(location.pathname);
        addHistory(location.pathname)
      }
    }
  }, [settings, location, menus]);

  useEffect(() => {
    let contentData = getContentDataFromPath(location.pathname)
    if (contentData) {
      if (activeViewId !== contentData.viewId) {
        setActiveViewId(contentData.viewId)
      }
    }
  }, [location])

  useEffect(() => {
    const el = document.querySelector(".MuiTabs-scroller");
    if (el) {
      const wheelHandler = (event, delta) => {
        let _scrollX = event.deltaY > 0 ? $('#tabTemplate').scrollLeft() + 100 : $('#tabTemplate').scrollLeft() - 100;
        $('.MuiTabs-scroller').scrollLeft(_scrollX);
        // event.preventDefault();
      };
      el.addEventListener('wheel', wheelHandler, { passive: true });
      return () => { el.removeEventListener("wheel", wheelHandler) }
    }
  }, []);

  function addTabContentData(location) {
    views.map((route, idx) => {
      if (route.path === location) {
        let insertContent = { viewId: route.viewId, path: route.path, name: route.name, filePath: route.filePath, type: route.type };
        if (tabContentData.findIndex(i => i.viewId == route.viewId) === -1 && tabContentData.findIndex(i => i.filePath == route.filePath) === -1) {
          addContentData(insertContent);
          //setTabIndex(tabContentData.length);
        } else {
          updateContentData(tabContentData.findIndex(i => i.filePath == route.filePath), insertContent);
          //setTabIndex(tabContentData.findIndex(i => i.viewId == route.viewId));
        }
        setActiveViewId(route.viewId)
        let titlePrefix = getAppSettings('titlePrefix')
        titlePrefix = titlePrefix ?? titlePrefix;
        document.title = route.viewId ? titlePrefix + transLangKey(route.viewId) : "T³SmartSCM";
      }
    });
  }
  return (<CacheSwitch>
    {
      views.map((route, idx) => {
        if (tabContentData.findIndex(i => i.path == route.path) !== -1) {
          return route.component && (
            <CacheRoute
              key={route.viewId}
              when='always'
              cacheKey={route.viewId}
              path={route.path}
              name={route.name}
              exact={route.exact}
              render={props => (
                <Suspense fallback={<Loading />}><route.component viewId={route.viewId} {...props} /></Suspense>
              )}
              behavior={cached => cached ? { style: { display: "none" } } : { style: { height: "100%", width: '100%' } }}
            />
          )
        }
      })
    }
    <CacheRoute path='*' component={(React.lazy(() => import('@wingui/' + VIEW_PATH + '/pages/NoContent')))} />
  </CacheSwitch>
  )
}

function Content({ ...props }) {
  const [issueDrawerOpen, issueDrawerClose] = useViewStore(state => [state.issueDrawerOpen, state.issueDrawerClose]);
  const classes = useContentStyles(props);
  const contentRef = useRef(null);

  const setRef = captureStoreApi.getState().setRef;//(s=>s.setRef);
  useEffect(() => {
    setRef(contentRef.current);
  }, []);

  let useUserViewHistory = getAppSettings('useUserViewHistory')

  return (
    <Box id='ContentMain' className={classes.main}>
      <NavBar id='NavBar' />
      {!isNewWindowMode() ? <TabContent id='TabContent'></TabContent> : null}
      <Box id='PageMain' role="main" className="content" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 100 }} ref={contentRef}>
        <ViewPath id='ViewPath' position='globalbutton' ></ViewPath>
        <Box id='ContentInnerContainer' style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} >
          <ActiveViewRouter />
          {/* Issue Drawer */}
          <Drawer anchor={'right'} sx={{ "& .MuiDrawer-paper": { top: '35px', height: 'calc(100% - 35px)', overflow: 'hidden' } }}
            open={issueDrawerOpen.open}
            onClose={issueDrawerClose} >
            <IssueReadBox issueId={issueDrawerOpen.selectedIssueId} onClose={issueDrawerClose} ></IssueReadBox>
          </Drawer>
        </Box>
        <MessageBox></MessageBox>
        <Toast />
        <CustomTooltip />
        {useUserViewHistory ? <UserViewHistory /> : null}
      </Box>
    </Box>
  )
}

export default Content