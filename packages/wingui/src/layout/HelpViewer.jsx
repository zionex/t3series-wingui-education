import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { useContentStore, useMenuStore } from "@zionex/wingui-core/store/contentStore";
import { Typography } from '@mui/material';
import { ClickAwayListener } from '@mui/material';
import { Paper } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import parse from 'html-react-parser';
import axios from 'axios';
import HomeIcon from '@mui/icons-material/Home';
import UndoIcon from '@mui/icons-material/Undo';
import PopupDocViewer from '@zionex/wingui-core/component/PopupDocViewer';
import MarkDownViewer from '@zionex/wingui-core/component/MarkDownViewer';

const styles = {
  position: 'absolute',
  top: 28,
  zIndex: 1200,
  border: '1px solid #ffffff',
  borderRadius: '1',
  p: 1,
  bgcolor: 'background.paper',
  right: 0,
};

export default function HelpViewer(props) {
  const userManualPath = getAppSettings('document').userManualPath
  const searchPosition = getAppSettings('layout').searchArea
  let topHeight = searchPosition === 'top' ? 20 : 60
  const [activeViewId] = useContentStore(state => [state.activeViewId])
  const [height, setHeight] = useState(0)
  const [getContentDataFromViewId, getMenualPath] = useMenuStore(state => [state.getContentDataFromViewId, state.getMenualPath])
  let contentData = getContentDataFromViewId(activeViewId);
  const classes = usePopupDialogStyles(props);

  let moduleValue = 'default';
  if (contentData && contentData.filePath)
    moduleValue = contentData.filePath.split('/')[1]

  const [docFile, setDocFile] = useState(null)
  const [docOptions, setDocOptions] = useState({})
  useEffect(() => {
    window.onresize = function () {
      setHeight(document.getElementById('contentInner-' + activeViewId).clientHeight - topHeight)
    }
  }, [])
  useEffect(() => {
    if(getMenualPath(activeViewId).indexOf('html') > -1) {
      getDocFile(activeViewId)

      if (document.getElementById('contentInner-' + activeViewId)) {
        setHeight(document.getElementById('contentInner-' + activeViewId).clientHeight - topHeight)
      }
    }
  }, [activeViewId])
  function getDocFile(fileName, fullPath = false) {
    let docPath = ''
    let moduleDir = ''
    if (fullPath) {
      docPath = fileName
    } else {
      if (fileName.indexOf(activeViewId) > -1) {
        docPath = baseURI() + userManualPath + "/" + getMenualPath(activeViewId)
      } else {
        moduleDir = fileName.split('/')[0] //moduleName

        //moduleDir 가 없을 경우 (== fileName 이 viewId만 오는 경우)
        if (moduleDir === fileName) {
          moduleDir = getMenualPath(fileName.replace('.html', '')).split('/')[0];
          fileName = getMenualPath(fileName.replace('.html', '')) + '.html'
        }
        docPath = baseURI() + userManualPath + "/" + fileName
      }
    }

    axios.get(docPath).then(res => {
      document.querySelector('[data-role="documentViewer"]').scrollTop = 0;

      setDocFile(res.data)
      setDocOptions({
        replace: domNode => {
          let menualPath = getMenualPath(activeViewId)
          let lastIndex = menualPath.lastIndexOf("/");
          let linkPath = menualPath.slice(0, lastIndex)
          if (domNode.type === 'tag') {
            if (domNode.name === 'nav') {
              return <></>;
            }
            if (domNode.name === 'div' && domNode.attribs.id === 'menu-bar') {
              return <></>;
            }
            if (domNode.name === 'h3') {
              domNode.attribs.tabindex = '0'
            }
            if (domNode.name === 'a') {
              let link = domNode.attribs.href.replace("../../", "")
              domNode.attribs.href = "javascript:;"
              if (link.indexOf('#') > -1) {
                domNode.attribs.onClick = () => {
                  window.setTimeout(() => {
                    document.getElementById(link.replace('#', '')).focus();
                  }, 0)
                }
              } else {
                domNode.attribs.onClick = () => { getDocFile(link) }
              }
              return domNode
            }
            if (domNode.name === 'link') {
              let fileName = domNode.attribs.href.replace("../../", "")
              domNode.attribs.href = baseURI() + userManualPath + "/" + fileName
              return domNode

            }
            if (domNode.name === 'img') {
              let src = '';
              if (moduleDir !== '' && moduleDir !== activeViewId) {
                src = baseURI() + userManualPath + "/" + moduleDir + "/ui/" + domNode.attribs.src
              } else {
                src = baseURI() + userManualPath + "/" + linkPath + "/" + domNode.attribs.src
              }
              domNode.attribs.src = src
              return domNode
            }
          }
        }
      })
    }).catch(err => {
      setDocFile(null)
      setDocOptions(null)
    })
  }

  const handleClickAway = () => {
  };
  return (
    <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        {props.open ? (
          getMenualPath(activeViewId).indexOf('html') > -1 ?
            <Box sx={{ ...styles, height: height, boxShadow: 2, right: searchPosition === 'top' ? 0 : 'none' }} >
              <Box className={classes.popupDialogTitle} sx={{ display: 'flex', height: '4%', width: '100%', p: '5px' }}>
                <InfoIcon></InfoIcon>
                <Typography style={{ fontSize: '15px', margin: "0 8px" }}>{transLangKey('USER_MANUAL')}</Typography>
              </Box>
              <Box sx={{}} >
                <Tooltip title={transLangKey("HOME")} placement='bottom' arrow><IconButton onClick={() => getDocFile(baseURI() + userManualPath + "/" + moduleValue + "/ui/index.html", true)}><HomeIcon></HomeIcon></IconButton></Tooltip>
                <Tooltip title={transLangKey("UNDO")} placement='bottom' arrow><IconButton onClick={() => getDocFile(activeViewId)}><UndoIcon></UndoIcon></IconButton></Tooltip>
              </Box>
              <Paper sx={{ height: '92%', borderRadius: 0, boxShadow: 'none', padding: '10px', backgroundColor: '#fff' }}>
                <Box data-role='documentViewer' sx={{ height: '95%', width: '800px', overflowY: 'auto' }} >
                  {docFile === null ?
                    <Typography variant="h4" style={{ color: '#4682b4' }}>{transLangKey('MSG_CONFIRM_USER_MANUAL')}</Typography>
                    : parse(docFile, docOptions)
                  }
                </Box>
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  pt: '5px'
                }}>
                  <Button onClick={() => props.onClose()} variant={'contained'} >{transLangKey("CLOSE")}</Button>
                </Box>
              </Paper>
            </Box>
            :
            <PopupDocViewer onClose={props.onClose} />
        ) : null}
      </Box>
    </ClickAwayListener>
  );
}