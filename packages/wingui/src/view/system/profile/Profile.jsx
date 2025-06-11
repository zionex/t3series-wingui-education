import React, { useRef, useState } from "react";
import { Box, List, ListItemButton, ListItem, ListItemText, Grid } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { ContentInner, WorkArea, ResultArea } from "@wingui/common/imports";
import Bookmark from './Bookmark';
import Permissions from "./Permissions";
import Info from "./Info";
import Password from "./Password";

const useProfileStyles = makeStyles((theme) => createStyles({
  listItem: {
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }
    },
    "& > .MuiListItemText-root > .MuiTypography-root": {
      color: "inherit"
    }
  }
}))

function Profile(props) {
  const classes = useProfileStyles()
  const [selectedIndex, setSelectedIndex] = useState("inform");
  const permissionsRef = useRef();
  const bookmarkRef = useRef();
  const passwordRef = useRef();
  let openTab = () => {
    let elnode;
    if (selectedIndex === 'inform') {
      elnode = <Info id="inform" ref={bookmarkRef}></Info>
    } else if (selectedIndex === 'password') {
      elnode = <Password id="password" ref={passwordRef}></Password>
    } else if (selectedIndex === 'bookmark') {
      elnode = <Bookmark id="bookmark" ref={bookmarkRef}></Bookmark>
    } else if (selectedIndex === 'permission') {
      elnode = <Permissions id="permission" ref={permissionsRef}></Permissions>
    }
    return elnode;
  }
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  return (
    <ContentInner>
      <WorkArea>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <List>
              <ListItem disablePadding>
                <ListItemButton className={classes.listItem} selected={selectedIndex === "inform"} onClick={(event) => handleListItemClick(event, "inform")}>
                  <ListItemText primary={transLangKey("COMM")} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton className={classes.listItem} selected={selectedIndex === "password"} onClick={(event) => handleListItemClick(event, "password")}>
                  <ListItemText primary={transLangKey("PASSWORD")} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton className={classes.listItem} selected={selectedIndex === "bookmark"} onClick={(event) => handleListItemClick(event, "bookmark")}>
                  <ListItemText primary={transLangKey("BOOKMARK")} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding >
                <ListItemButton className={classes.listItem} selected={selectedIndex === "permission"} onClick={(event) => handleListItemClick(event, "permission")}>
                  <ListItemText primary={transLangKey("MY_PERMISSION")} />
                </ListItemButton>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={10}>
            <Box>
              <ResultArea>{openTab()}</ResultArea>
            </Box>
          </Grid>
        </Grid>
      </WorkArea>
    </ContentInner >
  )
}

export default Profile;
