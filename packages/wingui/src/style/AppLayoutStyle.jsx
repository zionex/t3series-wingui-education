import React from "react";
import { makeStyles } from '@mui/styles';

export const useAppLayoutStyles = makeStyles(theme => ({    
  primaryButton: {
    border: "none",
    borderRadius: "4px",
    margin: 0,
    "&:hover": {
      color: "#fff",
    },
  },

}));