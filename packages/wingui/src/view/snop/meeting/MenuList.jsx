import React, { useEffect, useState,useRef } from 'react';
import { useHistory } from "react-router-dom";
import { useMenuStore } from '@zionex/wingui-core/store/contentStore';
import { createStyles, makeStyles } from '@mui/styles';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useContentId } from '@zionex/wingui-core';
import {useSnopMeetingStore} from './meetingStore'
import {zAxios,useIconStyles,
     ButtonArea, LeftButtonArea, RightButtonArea
} from "@wingui/common/imports";

import { List, ListItem, Divider, ListItemIcon, ListItemText, Box, 
    IconButton,  ClickAwayListener, Tooltip } from "@mui/material";
import { Web, Add, Delete, Link, Monitor, OpenInNew } from '@mui/icons-material'
import PopSelectMenu from "./PopSelectMenu";

function MenuList(props) {

    const [orgMeetingData ,selAgenda,curMenuList,removeMenu,getAgendaCnt,setCurMenuList,getCurrentAgendaId] = useSnopMeetingStore(s => 
        [s.orgMeetingData ,s.selAgenda,s.curMenuList,s.removeMenu,s.getAgendaCnt,s.setCurMenuList,s.getCurrentAgendaId]
    );

    const history = useHistory();
    const [getViewPath,views] = useMenuStore(state => [state.getViewPath, state.views]);    

    const iconClasses = useIconStyles();
    const [popSelectMenu, setPopSelectMenu] = useState(false);  // menu 팝업
    const id = useContentId()
    const floatAnchorElRef = useRef(null);
      
    /* 화면 삭제 */
    function deleteMenu(item){
        let changeRowData = [];
        if(item._stat_ =='created') {
            removeMenu(item);
            return;
        }
        changeRowData.push(item)

        if (changeRowData.length > 0) {
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_DELETE"), function (answer) {
                if (answer) {
                return zAxios({
                    method: "post",
                    url: 'meeting/menu/delete',
                    headers: { "content-type": "application/json" },
                    data: changeRowData,
                })
                .then(function (response) {
                    removeMenu(item);
                    showToast(transLangKey('MSG_0002'), 2000);
                })
                .catch(function (e) {
                    console.error(e);
                });
                }
            })
        }
    }

    const menuDeleteClick = (item) => {
        deleteMenu(item);
    }

    /* 화면추가 팝업열기 */
    function openMenuPopup(){
        setPopSelectMenu(true)
    }

    /* 화면추가 팝업 후 이벤트 */
    function insertMenu(menus) {
        if(!orgMeetingData)
        return;

        const meetId = orgMeetingData.id;
        const agendaId = getCurrentAgendaId();
        const newMenuList = [...curMenuList];

        let menuInfo = {
        _stat_: 'created',
        id : generateId(),
        meetId :meetId,
        agendaId : agendaId,
        linkType : menus.linkType,
        urlTitle : menus.linkType === 'I' ? menus.viewTitle : menus.urlTitle,
        urlLink : menus.linkType === 'I' ? menus.viewId : menus.urlLink,
        }
        newMenuList.push(menuInfo);
        setCurMenuList(newMenuList);
    }

    /* 열린 팝업 외 클릭 -> 팝업 닫힘 */
    const menuPopupClickAway = () => {
        setPopSelectMenu(false);
    };

    const menuLinkClick = (item) => {
        if(item.linkType === 'I'){
            history.push({ pathname: getViewPath(item.urlLink)})
        } else {
            window.open(item.urlLink, '_blank');
        }
    }

    // 항목 순서 변경시 호출되는 함수
    const onDragEnd = (result) => {
        document.body.style.overflow = '';
        if (!result.destination) {
            return;
        }

        const items = Array.from(curMenuList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        items.forEach(function (row,i) {
            if(row['seq'] != i){
                row['seq'] = i
                row._stat_='updated'
                }
        })
        setCurMenuList(items);
    };

    const getMenuList=()=> {
        return (
            <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                <DragDropContext onDragEnd={onDragEnd} direction="vertical">
                    <div style={{ overflowY: 'auto', maxHeight: '100%' }}> {/* Droppable 컴포넌트 밖에 스크롤 추가 */}
                    <Droppable droppableId={id}>
                        {(provided) => (
                        <List
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            sx={{ width: '100%', bgcolor: 'background.paper', paddingTop: '0px', paddingBottom: '0px' }}
                        >
                            {curMenuList.map((item, index) => (
                            <Draggable key={`menu_${index}`} draggableId={`menu_${index}`} index={index}>
                                {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <React.Fragment key={`menu_${index}`}>
                                    <ListItem
                                        key={`menu_${index}`}
                                        sx={{
                                        display: selAgenda?.id !== item.agendaId ? 'none' : '',
                                        backgroundColor: item._stat_ === "created" ? '#ebfaf0' : '',
                                        }}
                                        secondaryAction={
                                        <>
                                            <IconButton aria-label="link" onClick={() => menuLinkClick(item)}>{item.linkType === 'O' ? <OpenInNew /> : <Link />}</IconButton>
                                            <IconButton edge="end" aria-label="delete" onClick={() => menuDeleteClick(item)}><Delete /></IconButton>
                                        </>
                                        }>
                                        {item._stat_ === "created" ? <ListItemIcon><Add /></ListItemIcon> : <ListItemIcon><Monitor /></ListItemIcon>}
                                        <ListItemText primary={transLangKey(item.urlTitle)} />
                                    </ListItem>
                                    <Divider style={{ display: selAgenda?.id !== item.agendaId ? 'none' : '', height: '1px' }} />
                                    </React.Fragment>
                                </div>
                                )}
                            </Draggable>
                            ))}
                            {provided.placeholder}
                        </List>
                        )}
                    </Droppable>
                    </div>
                </DragDropContext>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", height: "50%", width: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", borderBottom: '3px solid #EEEEEE' }} style={props.contentBoxStyle} >
            <ButtonArea sx={{ width: "100%", display: 'flex' }} p={1}>
                <LeftButtonArea sx={{ flexGrow: 1 }}>
                <Box style={{ display: "block", textAlign: "left",  fontWeight: "bold", }} >
                    <Web style={{height:'40px'}}/>{transLangKey("화면")}
                </Box>
                </LeftButtonArea>
                <RightButtonArea  sx={{}}>
                { getAgendaCnt() ?
                    <>
                        <ClickAwayListener
                        mouseEvent="onMouseDown"
                        touchEvent="onTouchStart"
                        onClickAway={menuPopupClickAway}
                        >
                        <Box >
                        <Tooltip title={transLangKey("ADD")} placement='bottom' arrow>
                            <IconButton className={iconClasses.gridIconButton} onClick={openMenuPopup} ref={floatAnchorElRef}><Icon.Plus size={20} /></IconButton>
                        </Tooltip>
                        <PopSelectMenu open={popSelectMenu} setOpen={setPopSelectMenu} confirm={insertMenu} views={views} anchorEl={floatAnchorElRef.current}/>
                        </Box>
                    </ClickAwayListener>
                    </>
                    : ''}
                </RightButtonArea>
            </ButtonArea>
            <Divider style={{ backgroundColor: '1px solid #EEEEEE' }}/>
            <Box style={{ height: "100%", overflow: 'auto' }}>
                {getMenuList()}
            </Box>
        </Box>
    )
}

export default MenuList;