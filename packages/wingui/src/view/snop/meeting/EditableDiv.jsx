import React,{useState,forwardRef, useEffect, useRef,useImperativeHandle} from "react";
import sanitizeHtml from "sanitize-html";
import { TextField } from "@mui/material";

const sanitizeConf = {
    allowedTags: ["b", "i", "em", "strong", "a", "p", "h1"],
    allowedAttributes: { a: ["href"] }
}

export const EditableDiv= forwardRef( ({value, onChange,disabled, style,onResize,
    onKeyDown, ...props}, ref) =>{

    const [text, setText] = useState(value)
    const [editMode, setEditMode] = useState(false)

    const editableRef = useRef(null)

    useEffect(()=>{
        if(onChange && text != value)
            onChange(text)
    },[text])

    useImperativeHandle(ref, () => ({
        getValue: ()=> text
    }));

    function setEditableRef(input) {
        if(input) {
            editableRef.current= input;

            if(typeof ref =='function')
                ref(input)
            else
                ref.current = input;
        }
    }

    useEffect(()=>{
        if(disabled != undefined)
            setEditMode(!disabled)
    },[disabled])

    useEffect(()=>{
        if(editMode) {
            editableRef.current.focus();
        }
    },[editMode])

    /** 에디팅하다보면 크기가 달라질 수 있다. */
    const resizeHandler = (entries, observer) => {
        let w = 1;
        let h = 1;
        entries.forEach(entry => {
          h = Math.max(h, entry.contentRect.height);
          w = Math.max(w, entry.contentRect.width);
        })
        if(onResize) {
            //console.log('onResize')
            onResize(w, h)
        }
      }

    useEffect(()=>{
        if(editableRef.current){
            let resizeObserver = new ResizeObserver(resizeHandler);
            resizeObserver.observe(editableRef.current)

            return () => {
                resizeObserver.disconnect();
                resizeObserver = null;
            }
        }
    },[editableRef.current])

    const handleChange = evt => {
        setText(evt.target.value);
    };
    
    if(disabled) {
        return (<div style={{height:'48px', width:'100%', display:'flex',alignItems:'center', 
                            fontSize:15, fontWeight:800}}
                            >{text}</div>)
    }
    else
        return <TextField inputRef={setEditableRef}
                sx={{'& .MuiInputBase-input' : {fontSize:15, fontWeight:800}}}
                size={'small'}
                fullWidth={true}
                value={text}
                aria-readonly={!editMode}
                onChange={handleChange}
            />
})
