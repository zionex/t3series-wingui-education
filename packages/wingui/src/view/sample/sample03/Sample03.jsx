import React, { useState, useEffect } from "react";
import {
  ContentInner, SearchArea, WorkArea, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow,
  InputField, BaseGrid, GridAddRowButton, GridDeleteRowButton, GridSaveButton, useContentStore,
  useIconStyles, useViewStore, zAxios,
  SplitPanel, HLayoutBox, VLayoutBox
} from "@wingui/common/imports";

function Sample03() {
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          Search 영역
        </SearchRow>
      </SearchArea>
      <WorkArea>
        <SplitPanel>
          <HLayoutBox>
            <SplitPanel sizes={[40, 30, 30]} direction={"horizontal"}>
              <VLayoutBox>
                Top Left
              </VLayoutBox>
              <VLayoutBox>
                Top Middle
              </VLayoutBox>
              <VLayoutBox>
                Top Right
              </VLayoutBox>
            </SplitPanel>
          </HLayoutBox>
          <HLayoutBox>
            Bottom Contents
          </HLayoutBox>
        </SplitPanel>
      </WorkArea>
  </ContentInner>
  );
}


export default Sample03
