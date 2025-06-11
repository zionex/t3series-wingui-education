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
  blockType: { display: 'block', flexDirection: 'row', flexWrap: 'wrap', padding: 0, margin: 0, width: '100%' },
  flexType: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: 0, margin: 0, width: '100%', alignItems: 'center' },
  noWrapFlex: { display: 'flex', flexDirection: 'row', padding: 0, margin: 0, width: '100%', flexWrap: 'nowrap', alignItems: 'center' },
  gridType: { display: 'grid', gridTemplateColumns: 'repeat(4, 364px)', columnGap: '20px', padding: 0, margin: 0, width: '100%' }
}));