import React, { useState, useEffect, useRef } from "react";

import { Box, Slider, Typography } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { zAxios } from "@zionex/wingui-core";
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
//import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import PopNoticeDetail from "../../util/noticeboard/PopNoticeDetail";
import { isDeepEqual, useContentId } from "@zionex/wingui-core/utils/common";

const useWidgetStyles = makeStyles((theme) => ({
  contentStyle: {
    //boxShadow: '3px 3px 3px rgb(192, 185, 185), 0em 0em 0.4em rgb(192, 185, 185)',
    padding: '4px',
    margin: '0px',
    //borderRadius:'8px',
    // background: 'linear-gradient(to right, blue, pink)',
    flex: 1
  },
  titleIcon: {
    color: theme.typography.subtitle.color
  },
}));

function NoticeWidget(props) {
  const classes = useWidgetStyles(props);
  const contentId = useContentId();

  const [certainList, setCertainList] = useState(false);
  const [visible, setVisible] = useState(false);
  const [max, setMax] = useState(5);

  const [currentNotice, setCurrentNotice] = useState(null)

  useEffect(() => {
    loadData();
  }, []);
  function loadData() {
    zAxios.get(baseURI() + 'noticeboard-home',
      {
        headers: getHeaders(),
        selector: contentId
      }
    )
      .then(function (res) {
        if (!certainList) {
          setCertainList(res.data);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  function loadDetails(id) {
    certainList.forEach(function (certain) {
      if (certain.id === id) {
        zAxios.get(baseURI() + 'noticeboard-file', {
          params: {
            BOARD_ID: id
          }
        })
          .then(function (response) {
            certain.files = response.data;
            setCurrentNotice(certain)
            setVisible(true);
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    });
  }

  return (
    <WidgetContent isDraggable={true} >
      <Box id={contentId} sx={{ display: 'flex', flexDirection: 'column', width: "100%", height: "100%", overflow:'auto'  }}>
        <Box className={["NotDraggable", classes.contentStyle].join(" ")}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%", height: '100%', flex: 1, justifyContent: 'center' }}>
            <TableContainer sx={{ width: '100%', height: '100%',  fontSize: '16px', ...props.style }}>
              <Table stickyHeader aria-label="sticky table" size="small" sx={{ width: '100%', overflow: 'auto' }}>
                <TableBody>
                  {certainList && certainList.map((row, idx) => {
                    if (idx < max) {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={idx} onClick={() => { loadDetails(row.id) }} style={{ height: '20px' }}>
                          <TableCell key={`title_${idx}`} align={'left'} sx={{ textOverflow: 'ellipsis', maxWidth: '200px', overflow: 'hidden', whiteSpace: 'nowrap', border: 0, cursor: 'pointer', p: '3px 5px' }}>
                            {`· ${row.title}`}
                          </TableCell>
                          <TableCell key={`createDttm_${idx}`} align={'right'} sx={{ border: 0, p: '3px 5px' }} style={{ color: "#b9b5b5" }}>
                            {new Date(row.createDttm).format("yyyy.MM.dd")}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  })}
                </TableBody>
              </Table>
            </TableContainer>

          </Box>
        </Box>
      </Box>
      {visible ? <PopNoticeDetail open={visible} notice={currentNotice} confirm={() => setVisible(false)} popupMode={'READ'} onClose={() => setVisible(false)} ></PopNoticeDetail> : null}
    </WidgetContent >
  )
}

export default NoticeWidget