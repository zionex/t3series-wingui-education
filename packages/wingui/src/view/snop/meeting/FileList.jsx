import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';

import { Grid, List, ListItem, Divider, ListItemIcon, ListItemText,Box, IconButton, } from "@mui/material";
import { FilePresent, PsychologyAlt, Add, Visibility, Delete, Save,
    ChevronRight, AccountCircleOutlined, RemoveFromQueueSharp, AttachFile, Download, VisibilityOff } from '@mui/icons-material'

import {downloadFile} from '@zionex/wingui-core/utils/common'

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {useSnopMeetingStore} from './meetingStore'
import {zAxios,useIconStyles,
     ButtonArea, LeftButtonArea, RightButtonArea,useUserStore
} from "@wingui/common/imports";
import FileUploader from '@zionex/wingui-core/component/input/FileUploader';

const FileList= forwardRef((props,ref) =>{

    const [orgMeetingData ,selAgenda,curFileList,getAgendaCnt,setCurFileList,getCurrentAgendaId] = useSnopMeetingStore(s => 
        [s.orgMeetingData ,s.selAgenda,s.curFileList,s.getAgendaCnt,s.setCurFileList,s.getCurrentAgendaId]
    );

    const username = useUserStore(state => state.username);

    const dragDropRef = useRef(null);
    const [dragdropElem, setDradDropElem] = useState(null);

    const setFileDropDownRef = (elem) => {
        if(elem && dragDropRef.current != elem) {
            dragDropRef.current = elem;
            setDradDropElem(dragDropRef.current)
        }
    }
    const fileUploaderRef = useRef({});

    const onClearFile = () => {
        fileUploaderRef.current.clearFiles();
    }

    /* Agenda 파일 정보 db 저장 */
    const saveAgendaFileInfo = (changeData) => {
        if (changeData.length > 0) {
            return zAxios({
                method: 'post',
                headers: { 'content-type': 'application/json' },
                url: 'meeting/files',
                data: changeData
            })
        } else {
            return Promise.resolve(1)
        }
    }
    /** 파일을 서버에 저장하고 저장된 fileStorageId를 가져온다. */
    const SaveAgendaFile = (meetId, agendaId, files, seq) => {
        return fileUploaderRef.current.uploadFile(files,'noticeboard',username)
            .then( function (fileData) {
                const changeData = [];
                for (let i = 0; i < fileData.length; i++) {
                    const fileStorageData = fileData[i]
                    let saMeetFile = {
                        meetId: meetId,
                        agendaId:agendaId,
                        fileStorageId: fileStorageData.id,
                        seq: seq[0],
                    };
                    changeData.push(saMeetFile);
                }
                return saveAgendaFileInfo(changeData);
            }
        )
    }

    //Agenda 파일 저장
    const saveAgendAtchFile = (files) => {
        const meetId = orgMeetingData.id;

        const agendaids = _.uniqBy(files,"agendaId").map( o => o.agendaId)
        const changeData = [];
        /** agenda 별로 파일 저장 */
        const promised=[];
        agendaids.forEach(agendaId=> {
            const filesFilter = files.filter(f=> f.agendaId == agendaId && f.file)
            const afiles = filesFilter.map( fInfo => fInfo.file);
            let seq = filesFilter.map( fInfo => fInfo.seq);
            if(agendaId && afiles && afiles.length > 0)
                promised.push(SaveAgendaFile(meetId, agendaId, afiles, seq))
        })

        return Promise.all(promised).then(()=> {
                files.forEach(row=> {
                    if(row._stat_ === 'updated'){
                        let saMeetFile = {
                            id: row.id,
                            meetId: row.meetId,
                            agendaId:row.agendaId,
                            fileStorageId: row.fileStorageId,
                            seq: row.seq
                        };
                        changeData.push(saMeetFile);
                    }
                })
                
                return saveAgendaFileInfo(changeData);
            }
        )        
    }

    
    useImperativeHandle(ref, () => ({
        clearFiles: onClearFile,
        saveAgendAtchFile:saveAgendAtchFile
    }));
    
    
    /* 업로드 대기 파일 삭제 */
    const deleteAttchingFile=(item) => {
        fileUploaderRef.current.deleteFile(item)
    }

    //파일 확장자를 가져옴
    function getFileExt(filename) {
        const idx=filename.lastIndexOf(".")
        if(idx >= 0) {
            return filename.substring(idx +1)
        }
        else
            return ""
    }

    /* FileUploder에서 파일이 첨부되었을 때 호출됨 */
    const handleFileUploaderChange = (choosenFiles) => {
        if(!orgMeetingData)
            return;

        const meetId = orgMeetingData.id;
        const agendaId = getCurrentAgendaId();
        //이전 싱크된 파일정보에서 없는 것만 등록
        const newExistFiles = [...curFileList];

        const createdFileList = choosenFiles.filter(file=> !newExistFiles.find(ef=> ef.file == file ))

        createdFileList.forEach(file => {
            let fileInfo = {
            _stat_: 'created',
            id: undefined,
            meetId: meetId,
            agendaId: agendaId,
            fileStorageId: undefined, // 아직 저장이 되지 않음
            fileName: file.name,
            fileSize: file.size,
            fileType: getFileExt(file.name),
            file: file,
            seq: newExistFiles.length,
            };
            newExistFiles.push(fileInfo);
        });

        setCurFileList(newExistFiles)
    }    

    /** 저장되지 않고 목록만 있는 파일 삭제는 그냥 목록에서 제외 */
    const handleDeleteFile=(file)=> {
        if(!orgMeetingData)
            return;

        const fileInfos=[...curFileList];
        const newfileInfos=fileInfos.filter(fInfo=> {
            if(fInfo.file == file)
                return false;
            return true;
        })
        setCurFileList(newfileInfos);
    }

    //agenda에 첨부된 파일을 DB에서 삭제
    const agendaFileDelete = (changeData) => {
        return zAxios({
            method: 'post',
            headers: { 'content-type': 'application/json' },
            url: 'meeting/files/delete',
            data: changeData
        }).then(function (res) {
            const response = res.data;
            return response.status;
        }).catch(function (e) {
            console.error(e);
            return false;
        });
    }

    // 파일삭제
    function deleteFile(fileStorageId){
        if(!orgMeetingData)
            return;

        const fileList = [...curFileList]

        //삭제할 파일정보 찾는다.
        const fileInfo = fileList.find(f => f.fileStorageId == fileStorageId)
        if (!fileInfo)
            return;

        let changeData = [];
        let saMeetFile = {
            id: fileInfo.id,
            meetId: fileInfo.meetId,
            agendaId: fileInfo.agendaId,
            fileStorageId: fileInfo.fileStorageId
        };

        changeData.push(saMeetFile);
        showMessage(transLangKey('WARNING'), transLangKey('파일을 삭제하시겠습니까?'), function (answer) {
            if (!answer)
                return;

            /** 파일정보 및 파일 삭제 */
            return zAxios({
                fromPopup: true,
                method: "POST",
                url: `file-storage/files/delete?ID=${fileStorageId}&USER_ID=${username}`,
            }).then(function (response) {
                if (response.status === HTTP_STATUS.SUCCESS) {
                agendaFileDelete(changeData).then((res)=>{
                    if(res === HTTP_STATUS.SUCCESS) {
                    //제대로 삭제되었다면 파일 목록 삭제
                    const files = fileList.filter(f=> f.fileStorageId != fileInfo.fileStorageId);

                    setCurFileList(files)
                    showToast(transLangKey('MSG_0002'), 2000);
                    }
                });
                }
            }).catch(function (err) {
                console.log(err);
            });
        })
    }

    function canUploadFile() {
        if(getCurrentAgendaId()) //선택된 agenda가 있으면
            return true;
        else {
            showMessage("Alert", "Agenda를 선택하세요", { close: false });
            return false;
        }
    }


    const fileDeleteClick = (item) => {
        const fileInfo = item.file;
        if(item._stat_ === "created"){
            deleteAttchingFile(fileInfo) //파일 업로더에서만 삭제
        }
        else {
            deleteFile(item.fileStorageId) //db삭제까지 진행
        }
    }

    const fileDownLoadClick = (item) => {
        if(item.fileStorageId){
            downloadFile(item.fileStorageId)
        }
    }

    const onDragEnd = (result) => {
        document.body.style.overflow = '';
        if (!result.destination) {
            return;
        }

        const items = Array.from(curFileList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        items.forEach(function (row,i) {
            if(row['seq'] != i){
                row['seq'] = i
                row._stat_='updated'
                }
        })
        
        setCurFileList(items);
    };

    const getFileList=()=> {
        return (
            <Box sx={{width: '100%', height:'100%', overflow:'auto'}}>
                <DragDropContext onDragEnd={onDragEnd} direction="vertical">
                    <div style={{ overflowY: 'auto', maxHeight: '100%' }}> {/* Droppable 컴포넌트 밖에 스크롤 추가 */}
                    <Droppable droppableId="menuList">
                        {(provided) => (
                        <List
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            sx={{ width: '100%', bgcolor: 'background.paper', paddingTop: '0px', paddingBottom: '0px' }}
                        >
                            {curFileList.map((item, index) => (
                            <Draggable key={`file_${index}`} draggableId={`file_${index}`} index={index}>
                                {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <React.Fragment key={`file_${index}`}>
                                    <ListItem
                                        key={`file_`+index}
                                        sx={{
                                            display: selAgenda?.id != item.agendaId ? 'none' : '' ,
                                            backgroundColor : item._stat_ === "created" ? '#ebfaf0' : ''
                                        }}
                                        secondaryAction={
                                        <>
                                            {item._stat_ === "created" ? '' : <IconButton aria-label="download" onClick={()=>fileDownLoadClick(item)}><Download /></IconButton>}
                                            <IconButton edge="end" aria-label="delete" onClick={()=>fileDeleteClick(item)} ><Delete /></IconButton>
                                        </>
                                    }>
                                        {item._stat_ === "created" ? <ListItemIcon><Add /></ListItemIcon> : <ListItemIcon><AttachFile /></ListItemIcon>}
                                        <ListItemText primary={item.fileName} />
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

    return (<Box ref={setFileDropDownRef} sx={{ display: "flex", height: "50%", width: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", borderBottom: '1px solid #EEEEEE', borderWidth: "thin" }} style={props.contentBoxStyle} >
                <ButtonArea sx={{ width: "100%", display: 'flex' }} p={1}>
                <LeftButtonArea sx={{flexGrow:1}}>
                    <Box style={{ display: "block", textAlign: "left", fontWeight: "bold", }} >
                    <FilePresent style={{height:'40px'}}/>{transLangKey("첨부")}
                    </Box>
                </LeftButtonArea>
                <RightButtonArea sx={{}}>
                    <FileUploader id="agendaFileUploader" ref={fileUploaderRef} sx={{ height: '45px' }}
                                dragdropElem={dragdropElem}
                                canUploadFile={canUploadFile}
                                onChange={handleFileUploaderChange}
                                onDeleteFile={handleDeleteFile}
                                hideFileList={true}
                                hidden={!orgMeetingData}
                                hiddenButton={getAgendaCnt() == 0 ? true : false}
                                />
                </RightButtonArea>
                </ButtonArea>
                <Divider style={{ backgroundColor: '1px solid #EEEEEE' }}/>
                <Box style={{ height: "100%", overflow: 'auto' }}>
                    {getFileList()}
                </Box>
            </Box>)
});

export default FileList;