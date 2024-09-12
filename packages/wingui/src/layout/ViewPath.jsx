import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import { Checkbox, Link, Grid, Breadcrumbs, Stack, Divider, IconButton, Avatar, Box, Typography } from '@mui/material';
import { grey, indigo } from "@mui/material/colors";
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import {
  useContentStore, useMenuStore, useViewStore, transLangKey
} from "@zionex/wingui-core/index";

import { SearchButton, SaveButton, HelpButton, PersonalButton, RefreshButton } from "@zionex/wingui-core/component/CommonButton";
import HelpViewer from "./HelpViewer";
import { useSearchPositionStore } from "@zionex/wingui-core/store/contentStore";
import { getThemeStore } from "@zionex/wingui-core/store/themeStore";

const publicButtons = ['search', 'save', 'refresh', 'help', 'personalization']
export function ViewPath(props) {
  const themeStore = getThemeStore('themeData');
  const { position, ...otherProps } = props
  let history = useHistory();
  let location = useLocation();

  const [searchPositions, getSearchPosition, searchAreaExpanded, setSearchAreaExpanded,]
    = useSearchPositionStore(s => [s.searchPosition, s.getSearchPosition, s.searchAreaExpanded, s.setSearchAreaExpanded,])

  const [viewHelp, setViewHelp] = useState(false)
  const [globalButton, setGlobalButton] = useState(false)
  const [activeViewId] = useContentStore(state => [state.activeViewId]);
  const [getViewIsUpdated, getGlobalButtons, getViewInfo, viewData] = useViewStore(state => [state.getViewIsUpdated, state.getGlobalButtons, state.getViewInfo, state.viewData])

  const [buttons, setButtons] = useState(getGlobalButtons(activeViewId))
  const [addBookMark, deleteBookMark, isBookMarked, navigateObject] = useMenuStore(state => [state.addBookMark, state.deleteBookMark, state.isBookMarked, state.navigateObject])

  const [expandButton, setExpandButton] = useState(true);
  const [breadCrumbs, setBreadCrumbs] = useState([]);

  useEffect(() => {
    let breadCrumbsArray = [];
    if (Object.keys(navigateObject).indexOf(activeViewId) !== -1) {
      navigateObject[activeViewId].map((m, inx) => {
        breadCrumbsArray.push(<Typography key={m}>{transLangKey(m)}</Typography>);
      });
      if (JSON.stringify(breadCrumbsArray) !== JSON.stringify(breadCrumbs)) {
        setBreadCrumbs(breadCrumbsArray);
      }
    } else {
      if (JSON.stringify(breadCrumbsArray) !== JSON.stringify(breadCrumbs)) {
        setBreadCrumbs(breadCrumbsArray);
      }
    }
  }, [activeViewId, navigateObject]);

  //새롭게 여는 페이지는 activeViewId 가 바뀌더라도 viewData가 바뀌기전일 수 있다. 
  //viewData를 등록할 때 한번더 getGlobalButtons 을 호출해줘야 한다.
  useEffect(() => {
    setButtons(getGlobalButtons(activeViewId))
  }, [activeViewId, viewData]);

  useEffect(() => {
    setGlobalButton(null)
    const globalButtons = []
    if (buttons.length > 0) {
      buttons.filter(button => !publicButtons.includes(button.name)).forEach(button => {
        const icon = createIcon(button.disable, button.iconName)
        globalButtons.push(<Avatar key={button.name} onClick={button.action} className={classes.viewPathIconButton} sx={{ bgcolor: button.disable ? grey[200] : indigo[500] }} variant="square" >
          <IconButton title={transLangKey(button.title)}>
            {icon}
          </IconButton>
        </Avatar>)
      })
      setGlobalButton(globalButtons)
    }
  }, [buttons])


  const classes = useViewPathStyles(props)
  useEffect(() => {
    if (searchAreaExpanded == false) {
      setSearchAreaExpanded(true);
    };

    if (props.expandButton != undefined) {
      setExpandButton(props.expandButton)
    } else if (expandButton == false) {
      setExpandButton(true);
    }
  }, [])

  useEffect(() => {
    const noSearchArea = getViewInfo(activeViewId, "NO_SEARCHAREA");

    let exceptExpandButtonUIs = ['/profile', '/home']
    if (noSearchArea) {
      exceptExpandButtonUIs.push(location.pathname)
    }
    if (exceptExpandButtonUIs.includes(location.pathname)) {
      setExpandButton(false);
    } else {
      setExpandButton(true);
    }
  }, [location, viewData])

  function getButtonProp(name, type) {
    let returnValue;
    buttons.forEach(p => {
      if (p.name === name) {
        if (type === "action") {
          returnValue = p.action()
        } else {
          returnValue = p[type]
        }
      }
    })
    return returnValue
  }
  function existButtons() {
    return buttons.length > 0
  }

  const changeFavorite = (evt) => {
    if (evt.target.checked) {
      addBookMark(activeViewId);
    } else {
      deleteBookMark(activeViewId)
    }
  };
  const onSubmit = () => {
    if (getButtonProp('search', 'disable')) {
      return
    }
    if (getViewIsUpdated(activeViewId)) {
      showMessage(transLangKey('WARNING'), transLangKey('MSG_5142'), function (answer) {
        if (answer) {
          getButtonProp('search', 'action')
        }
      });
    } else {
      getButtonProp('search', 'action')
    }
  }
  const openHelp = () => {
    if(getButtonProp('help', 'docUrl')){
      window.open(getButtonProp('help', 'docUrl'), '_blank');
    }else{
      setViewHelp((previousOpen) => !previousOpen)
    }
  }
  function createIcon(isDisabled, iconName) {
    let iconNode = <></>
    if (Icon[iconName] !== undefined) {
      let stroke = isDisabled ? "#e2e2e1" : "#fff"
      iconNode = React.createElement(Icon[iconName], { size: "16", stroke: stroke })
    }
    return iconNode
  }

  if (activeViewId == 'HOME')
    return null;

  const searchPos = getSearchPosition(activeViewId);

  if (props.position == 'searcharea') {
    return (
      <Box>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={6}>
            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
              <SearchButton onClick={onSubmit} style={{ 'display': (getButtonProp('search', 'visible') ? "" : "none") }} disabled={getButtonProp('search', 'disable')} />
              <SaveButton type="icon" onClick={() => getButtonProp('save', 'action')} style={{ 'display': (getButtonProp('save', 'visible') ? "" : "none") }} disabled={getButtonProp('save', 'disable')}></SaveButton>
              {/* <Divider orientation="vertical" style={{ height: "20px", width: "1px", backgroundColor: 'black', display: existButtons() ? "" : "none" }} /> */}
              <RefreshButton onClick={() => getButtonProp('refresh', 'action')} style={{ 'display': (getButtonProp('refresh', 'visible') ? "" : "none") }} disabled={getButtonProp('refresh', 'disable')} />
              <PersonalButton onClick={() => getButtonProp('personalization', 'action')} style={{ 'display': (getButtonProp('personalization', 'visible') ? "" : "none") }} disabled={getButtonProp('personalization', 'disable')} />
            </Stack>
          </Grid>
          {
            viewHelp && <HelpViewer open={viewHelp} onClose={() => setViewHelp(false)}></HelpViewer>
          }
        </Grid>
      </Box>
    )
  } else if (position == 'globalbutton') {
    return (
      <Box className={classes.viewPath} >
        <Grid container direction="row" alignItems="center">
          <Grid item xs={6} >
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ '& .MuiBreadcrumbs-separator': { mx: '10px' } }}>
              <Checkbox sx={{padding: '9px 0px'}} icon={<Icon.Star size={18} stroke={themeStore.palette.typography.color} />} checkedIcon={<Icon.Star size={18} fill={themeStore.palette.base.colorA} stroke={themeStore.palette.base.colorA} />} checked={isBookMarked(activeViewId)} onChange={changeFavorite} />
              <Link underline="hover" sx={{ display: 'flex', alignItems: 'center' }} color="inherit" onClick={() => { history.push('/home') }}>
                <Icon.Home size={18} stroke={themeStore.palette.typography.color} />
              </Link>
              {breadCrumbs}
            </Breadcrumbs>
          </Grid>
          <Grid item xs={6}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1.5}>
              {
                searchPos != 'left' && (
                  <>
                    <SearchButton onClick={onSubmit} style={{ 'display': (getButtonProp('search', 'visible') ? "" : "none") }} disabled={getButtonProp('search', 'disable')} />
                    <SaveButton type="icon" onClick={() => getButtonProp('save', 'action')} style={{ 'display': (getButtonProp('save', 'visible') ? "" : "none") }} disabled={getButtonProp('save', 'disable')}></SaveButton>
                    {/* <Divider orientation="vertical" style={{ height: "20px", width: "1px", backgroundColor: 'black', display: existButtons() ? "" : "none" }} /> */}
                    <RefreshButton onClick={() => getButtonProp('refresh', 'action')} style={{ 'display': (getButtonProp('refresh', 'visible') ? "" : "none") }} disabled={getButtonProp('refresh', 'disable')} />
                    <PersonalButton onClick={() => getButtonProp('personalization', 'action')} style={{ 'display': (getButtonProp('personalization', 'visible') ? "" : "none") }} disabled={getButtonProp('personalization', 'disable')} />
                    {<HelpButton onClick={openHelp} style={{ 'display': '' }} disabled={getButtonProp('help', 'disable')} />}
                  </>)}
              {expandButton && (
                <Avatar onClick={() => setSearchAreaExpanded(!searchAreaExpanded)} {...otherProps} className={classes.viewPathCollapseIcon} sx={{ bgcolor: props.disabled ? grey[200] : themeStore.palette.color.white }} variant="square" >
                  {searchAreaExpanded ?
                    <IconButton style={{ color: '#747474' }} title={transLangKey("CLOSE_SEARCH_CONDITION")}><FilterListOffIcon /></IconButton> :
                    <IconButton style={{ color: '#747474' }} title={transLangKey("OPEN_SEARCH_CONDITION")}><FilterListIcon /></IconButton>
                  }
                </Avatar>
              )}
            </Stack>
          </Grid>
          {
            viewHelp && <HelpViewer open={viewHelp} onClose={() => setViewHelp(false)}></HelpViewer>
          }
        </Grid>
      </Box>
    )
  }
}

ViewPath.propTypes = {
  newhandler: PropTypes.func,
  savehandler: PropTypes.func,
  deletehandler: PropTypes.func,
  printhandler: PropTypes.func,
  exceldownhandler: PropTypes.func,
  refreshhandler: PropTypes.func,
  settingBtn: PropTypes.object,
  grids: PropTypes.array,  //엑셀로 다운로드할 grid 목록, 이값이 설정되면 printhandler 무시
  exceloptions: PropTypes.object,
  searchPosition: PropTypes.string,
  position: PropTypes.oneOf(['searcharea', 'globalbutton'])
};

ViewPath.displayName = 'ViewPath'