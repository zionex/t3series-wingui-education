import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

/**
 * BlockNote Widget(Notion Like)
 */

function NoteWidget() {

  const editor = useBlockNote({
    onUpdate: ({ editor }) => {
      // Log the document to console on every update
      console.log(editor.getJSON());
    },
  });
  
  return (
    <Box style={{width:'100%', height:'100%', overflow:'auto'}}>
        <BlockNoteView editor={editor} />
    </Box>
  );
}


export default NoteWidget
