import React, { useState, useEffect, useRef,useImperativeHandle,useContext} from "react";
import {getContentStore  } from "@wingui/common/imports";
import { ZEditor } from "@zionex/wingui-core";
import { Box} from "@mui/material";
import {useSnopMeetingStore} from './meetingStore'

const AgendaContentEditor= React.forwardRef((props,ref)=> {

      //조회된 현재 미팅정보
    const [setAgendaDetail,selAgenda] = useSnopMeetingStore(s => [s.setAgendaDetail,s.selAgenda]);

    const [content, setContent] = useState('')
    const languageCode = getContentStore(state => state.languageCode);
    
    useEffect(()=>{
      if(selAgenda) {
        const cont = selAgenda['agendaContents'];
        setContent(cont || '')
      }
      else {
        setContent('')
      }
    },[selAgenda])

    const onChange=(value)=>{
      if(content != value) {
        setContent(value || '');
        setAgendaDetail(value)
      }
    }
    
    return (<Box style={{ width: '100%', padding: 0,height: '100%', maxWidth: 'unset', flex: 1 }}>
              <ZEditor value={content} 
                       onChange={onChange} 
                       locale={languageCode}
                       readonly={selAgenda ? false : true}
                       placeholder={transLangKey('Agenda 상세를 입력해주세요.')}
                       width="99%"
                       initialEditType="wysiwyg"
                       useCommandShortcut={true}
                       type='editor'                       
              />
            </Box>)
  })

  export default AgendaContentEditor;