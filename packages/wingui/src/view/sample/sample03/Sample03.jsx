import React, { useState, useEffect } from "react";
import {
  ContentInner, SearchArea, WorkArea, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow,
  InputField, BaseGrid, GridAddRowButton, GridDeleteRowButton, GridSaveButton, useContentStore,
  useIconStyles, useViewStore, zAxios,
  SplitPanel, HLayoutBox, VLayoutBox
} from "@wingui/common/imports";

function Sample03() {
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
        <SplitPanel>
          <VLayoutBox>
            <SplitPanel sizes={[40, 30, 30]} direction={"horizontal"}>
              <HLayoutBox>
                Top Left
              </HLayoutBox>
              <HLayoutBox>
                Top Middle
              </HLayoutBox>
              <HLayoutBox>
                Top Right
              </HLayoutBox>
            </SplitPanel>
          </VLayoutBox>
          <VLayoutBox>
            Bottom Contents
          </VLayoutBox>
        </SplitPanel>
      </WorkArea>
  </ContentInner>
  );
}


export default Sample03
