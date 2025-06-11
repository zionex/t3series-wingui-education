import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import PropTypes from "prop-types";
import MuiPagination from '@mui/material/Pagination';
import { makeStyles } from "@mui/styles";
import { FormControl, Select, InputLabel, MenuItem } from "@mui/material";
import { getActiveViewId } from "@wingui/common/imports";
import { useViewStore } from "@wingui/common/imports";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(2),
      justifyContent: "center",
      display: 'flex'
    }
  },
  pagination: {
    alignItems: 'center',
    justify: 'center',
  }
}));

const Pagination = forwardRef(function Pagination(props, ref) {
  const classes = useStyles();
  //const [activeViewId] =   useContentStore((state) => [state.activeViewId]);
  const activeViewId = getActiveViewId();
  const [getViewIsUpdated] = useViewStore(state => [state.getViewIsUpdated])
  const [page, setPage] = useState(props.page);
  const [pageSize, setPageSize] = useState(props.pageSize ?? 1000);
  const pageSizeArr = [20, 100, 500, 1000];

  let id = props.id ?? `${activeViewId}_Pagination`;
  let count = props.count ?? 1;
  let disable = props.diabled ?? false;
  let usePageSizeDropdown = props.usePageSizeDropdown ?? false;
  let onChangeFunc = props.onChange;
  let onPageSizeChangeFunc = props.onPageSizeChange;

  useEffect(() => {
    setPage(props.page);
  }, [props.page]);

  const handlePageChange = (event, value) => {
    if (getViewIsUpdated(activeViewId)) {
      showMessage(transLangKey('WARNING'), transLangKey('MSG_5142'), function (answer) {
        if (answer) {
          setPage(value);
          onChangeFunc(value);
        }
      });
    } else {
      setPage(value);
      onChangeFunc(value);
    }
  };

  const handlePageSizeChange = (event) => {
    if (getViewIsUpdated(activeViewId)) {
      showMessage(transLangKey('WARNING'), transLangKey('MSG_5142'), function (answer) {
        if (answer) {
          let value = event.target.value;
          setPageSize(value);
          setPage(1);
          onPageSizeChangeFunc(value);
        }
      });
    } else {
      let value = event.target.value;
      setPageSize(value);
      setPage(1);
      onPageSizeChangeFunc(value);
    }
  };

  const goToPage1 = () => {
    let pageElement = document.getElementById(id);

    if (pageElement) {
      let pageBtnLi = pageElement.children[0].children;
      let firstPageBtn = {}

      pageBtnLi.forEach((el) => {
        if (["page 1", "Go to page 1"].includes(el.firstElementChild.getAttribute("aria-label"))) {
          firstPageBtn = el.firstElementChild;
        }
      });

      firstPageBtn ? firstPageBtn.click() : null;
    }
  };

  useImperativeHandle(ref, () => ({
    goToPage1() {
      goToPage1();
    }
  }));

  return (
    <div className={classes.root} style={{ height: "20px" }}>
      <Select sx={{ m: 1, width: "100px", position: "absolute", margin: "0", height: "inherit" }}
        value={pageSize}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        onChange={handlePageSizeChange}
        style={{ display: usePageSizeDropdown ? "" : "none" }}
      >
        {
          pageSizeArr.map((size, inx) => {
            return (
              <MenuItem key={inx} value={size}>{size}</MenuItem>
            )
          })
        }
      </Select>
      <MuiPagination ref={ref} id={id} className={classes.pagination} size="small" color="primary" defaultPage={1}
        count={!count && count === 0 ? 1 : count} page={page} onChange={handlePageChange}
        disabled={disable}
        showFirstButton showLastButton />
    </div>
  )
});

Pagination.propTypes = {
  page: PropTypes.number,
  pageSize: PropTypes.number,
  count: PropTypes.number,
  diabled: PropTypes.bool,
  usePageSizeDropdown: PropTypes.bool,
  onChange: PropTypes.func,
  onPageSizeChange: PropTypes.func
};

export default Pagination;