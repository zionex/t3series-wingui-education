import React, { useState, useEffect } from "react";
import {
  ContentInner, SearchArea, WorkArea, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow,
  InputField, BaseGrid, GridAddRowButton, GridDeleteRowButton, GridSaveButton, useContentStore,
  useIconStyles, useViewStore, zAxios,
  SplitPanel, HLayoutBox, VLayoutBox
} from "@wingui/common/imports";

function Sample01() {
  const activeViewId = getActiveViewId();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [
    state.viewData,
    state.getViewInfo,
    state.setViewInfo,
  ]);

  // globalButtons
  const globalButtons = [
    { name: "help", docUrl: '/edu/chapter3/레이아웃.html', visible: true, disable: false }
  ];

  useEffect(() => {
    setViewInfo(activeViewId, "globalButtons", globalButtons);
  }, []);
  
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          Search 영역
        </SearchRow>
      </SearchArea>
      <WorkArea>
        <SplitPanel sizes={[60, 40]}  direction={"horizontal"}>
          <HLayoutBox>
            Left Contents
          </HLayoutBox>
          <HLayoutBox>
            Right Contents
          </HLayoutBox>
        </SplitPanel>
      </WorkArea>
  </ContentInner>
  );
}


export default Sample01
