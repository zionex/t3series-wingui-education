import React, { useState, useEffect, useRef,useContext } from "react";
import PropTypes from 'prop-types';
import { Box, Button, Collapse } from "@mui/material";
import { CommonButton, getActiveViewId, useSearchPositionStore,  useViewStore } from "@zionex/wingui-core/index";
import { ViewPath } from './ViewPath'
import { SearchAreaContext } from "@zionex/wingui-core/layout/SearchAreaContext";

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        fontSize: '13px',
        fontFamily: 'Noto Sans KR',
        fontWeight: '400',
        padding: '2px',
        ...sx,
      }}
      {...other}
    />
  );
}

Item.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

export function SearchArea({children, ...props}) {

  const searchCtx = useContext(SearchAreaContext);
  const searchPosition = searchCtx ? (searchCtx.from =='ContentInner' ? searchCtx.searchPosition : 'top') : 'top';

  const [searchAreaExpanded] = useSearchPositionStore(state => [state.searchAreaExpanded]);
  const activeViewId = getActiveViewId();
  const [searchButton, setSearchButton] = useState(false);

  const classes = useSearchAreaStyles({...props, searchPosition: searchPosition,searchAreaExpanded:searchAreaExpanded});
  const [getGlobalButtons] = useViewStore(state => [state.getGlobalButtons]);
  
  useEffect(() => {
    if (props.searchButton != undefined) {
      setSearchButton(props.searchButton)
    } else {
      setSearchButton(false);
    }
  }, [])

  return (
    <div zlayout={"searchArea"} 
         className={searchPosition == 'left' ? classes.searchAreaLeftContainer : ""}>
      {searchPosition == 'left' &&
        (<Box data-role='searchTitle'
              sx={{ display: searchAreaExpanded ? 'center' : 'none', alignItems: 'center', width: '100%', height: '44px', paddingTop: '2px', paddingBottom: '2px' }}>
          <ViewPath position='searcharea' 
                    searchPosition={searchPosition} 
                    buttons={getGlobalButtons(activeViewId)}>
          </ViewPath>
        </Box>
        )
      }
      <Collapse in={searchAreaExpanded} timeout={{ appear: 8, enter: 2, exit: 2 }} className={searchAreaExpanded ? classes.searchCollapse: ''}>
        <Box id={`searchArea[${activeViewId}]`} className={searchPosition == 'left' ?  classes.leftSearchArea : classes.searchArea}>
          <Item id={`searchAreaItem[${activeViewId}]`} className={classes.searchAreaItem}>
            <Box id={`searchAreaItemBox[${activeViewId}]`} className={classes.searchAreaItemBox}>
              {children}
            </Box>
          </Item>
          {searchButton && searchPosition !== 'left' && (
            <Item sx={{ gridRow: '1', gridColumn: '4 / 5', display: 'flex', flexGrow: 0, flexShrink: 0 }}>
              <Box sx={{ flexGrow: 0, flexShrink: 0, alignSelf: 'flex-end', display:'flex', alignItems:'center', height:'100%' }}>
                <CommonButton onClick={props.submit} title={transLangKey('SEARCH')} className={classes.searchAreaButton}>
                  <Icon.Search />
                </CommonButton>
              </Box>
            </Item>
          )
          }
        </Box>
      </Collapse>
    </div>
  )
}

SearchArea.propTypes = {
  submit: PropTypes.func,
  searchButton: PropTypes.bool
};

SearchArea.displayName = 'SearchArea'