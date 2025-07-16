import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { ContentInner, ViewPath, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridExcelExportButton, GridExcelImportButton,
  GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, PopupDialog, GridCnt, useViewStore, useContentStore, useStyles, zAxios, useUserStore, WorkArea
} from "@wingui/common/imports";
import HierarchyInputField from './HierarchyInputField';

function Practice11() {
  const activeViewId = getActiveViewId();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [
    state.viewData,
    state.getViewInfo,
    state.setViewInfo,
  ]);

  // SearchArea
  const hierarchyInputRef = useRef();
  const [hierarchyItems, setHierarchyItems] = useState([]);
  const [itemTreeInitialized, setItemTreeInitialized] = useState(false);

  // default
  const { control, getValues, setValue, watch, reset } = useForm({
    defaultValues: {
      plantCd: [],
      startDt: new Date(),
    },
  });

   // globalButtons
  const globalButtons = [
    { name: "help", docUrl: '/edu/chapter4/연계검색컴포넌트.html', visible: true, disable: false },
    { name: 'search', action: (e) => { loadData() }, visible: true, disable: false },
    { name: "refresh", action: (e) => { refresh() }, visible: true, disable: false },
  ];

  useEffect(() => {
    loadCombo();
    setViewInfo(activeViewId, "globalButtons", globalButtons);
  }, []);

  useEffect(() => {
    if (itemTreeInitialized && hierarchyInputRef.current) {
      hierarchyInputRef.current.setValues([
        //{ "PLNT_CD": "27", "AREA_CD": "27110", "LINE_CD": ["1101053", "1101054"] },
        //{ "PLNT_CD": "27", "AREA_CD": "27110"},
        //{ "PLNT_CD": "27", "AREA_CD": "27110", "LINE_CD": "2711051" },
        { "PLNT_CD": "27", "AREA_CD": "27110", "LINE_CD": ["2711051", "2711052"] },
      ]);
    }
  }, [itemTreeInitialized]);

  const refresh = () => {
    hierarchyInputRef.current.reset();
    reset();
  };
  
  
  const loadCombo = async () => {
    const areacodes = [
      { "PLNT_CD": "11", "PLNT_NM": "서울특별시", "AREA_CD": "11010", "AREA_NM": "종로구", "LINE_CD": "1101053", "LINE_NM": "사직동" },
      { "PLNT_CD": "11", "PLNT_NM": "서울특별시", "AREA_CD": "11010", "AREA_NM": "종로구", "LINE_CD": "1101054", "LINE_NM": "삼청동" },
      { "PLNT_CD": "11", "PLNT_NM": "서울특별시", "AREA_CD": "11010", "AREA_NM": "종로구", "LINE_CD": "1101055", "LINE_NM": "부암동" },
      { "PLNT_CD": "11", "PLNT_NM": "서울특별시", "AREA_CD": "11680", "AREA_NM": "강남구", "LINE_CD": "1168051", "LINE_NM": "역삼동" },
      { "PLNT_CD": "11", "PLNT_NM": "서울특별시", "AREA_CD": "11680", "AREA_NM": "강남구", "LINE_CD": "1168052", "LINE_NM": "삼성동" },
      { "PLNT_CD": "11", "PLNT_NM": "서울특별시", "AREA_CD": "11680", "AREA_NM": "강남구", "LINE_CD": "1168053", "LINE_NM": "청담동" },
      { "PLNT_CD": "26", "PLNT_NM": "부산광역시", "AREA_CD": "26500", "AREA_NM": "해운대구", "LINE_CD": "2650051", "LINE_NM": "우동" },
      { "PLNT_CD": "26", "PLNT_NM": "부산광역시", "AREA_CD": "26500", "AREA_NM": "해운대구", "LINE_CD": "2650052", "LINE_NM": "중동" },
      { "PLNT_CD": "26", "PLNT_NM": "부산광역시", "AREA_CD": "26500", "AREA_NM": "해운대구", "LINE_CD": "2650053", "LINE_NM": "재송동" },
      { "PLNT_CD": "26", "PLNT_NM": "부산광역시", "AREA_CD": "26010", "AREA_NM": "중구", "LINE_CD": "2601051", "LINE_NM": "광복동" },
      { "PLNT_CD": "26", "PLNT_NM": "부산광역시", "AREA_CD": "26010", "AREA_NM": "중구", "LINE_CD": "2601052", "LINE_NM": "남포동" },
      { "PLNT_CD": "27", "PLNT_NM": "대구광역시", "AREA_CD": "27260", "AREA_NM": "수성구", "LINE_CD": "2726051", "LINE_NM": "범어동" },
      { "PLNT_CD": "27", "PLNT_NM": "대구광역시", "AREA_CD": "27260", "AREA_NM": "수성구", "LINE_CD": "2726052", "LINE_NM": "만촌동" },
      { "PLNT_CD": "27", "PLNT_NM": "대구광역시", "AREA_CD": "27260", "AREA_NM": "수성구", "LINE_CD": "2726053", "LINE_NM": "수성동" },
      { "PLNT_CD": "27", "PLNT_NM": "대구광역시", "AREA_CD": "27110", "AREA_NM": "중구", "LINE_CD": "2711051", "LINE_NM": "동인동" },
      { "PLNT_CD": "27", "PLNT_NM": "대구광역시", "AREA_CD": "27110", "AREA_NM": "중구", "LINE_CD": "2711052", "LINE_NM": "삼덕동" },
      { "PLNT_CD": "27", "PLNT_NM": "대구광역시", "AREA_CD": "27110", "AREA_NM": "중구", "LINE_CD": "2711053", "LINE_NM": "계산동" },
      { "PLNT_CD": "11", "PLNT_NM": "서울특별시", "AREA_CD": "11710", "AREA_NM": "송파구", "LINE_CD": "1171051", "LINE_NM": "잠실동" },
      { "PLNT_CD": "11", "PLNT_NM": "서울특별시", "AREA_CD": "11710", "AREA_NM": "송파구", "LINE_CD": "1171052", "LINE_NM": "가락동" },
    ];

    setHierarchyItems(areacodes);
    setItemTreeInitialized(true);
  };

  // 조회
  const loadData = () => {
    console.log(hierarchyInputRef.current.getValues());
    const firstValue = hierarchyInputRef.current.getValues()?.PLNT;
    const secondValue = hierarchyInputRef.current.getValues()?.AREA;
    const thirdValue = hierarchyInputRef.current.getValues()?.LINE;
    console.log('선택된 PLNT:', firstValue);
    console.log('선택된 AREA:', secondValue);
    console.log('선택된 LINE:', thirdValue);
  }

  
  const handleSelectionChange = (value) => {
    console.log("선택된 값:", value);
  };

  return (
    <ContentInner>
      <SearchArea>
        <HierarchyInputField
          ref={hierarchyInputRef}
          data={hierarchyItems}
          onChange={handleSelectionChange}
          option={{
            items: ["PLNT", "AREA", "LINE"],
            labels: ["PLNT", "AREA", "LINE"],
            type: ["select", "select", "multiSelect"],
            allflag: [false, false, true], // 각 단계에서 '전체 선택(ALL)' 옵션을 표시할지 여부
            rtnAllYn: [true, false, true], // 'ALL'을 선택했을 때 getValues로 'ALL' 값을 반환할지 여부
          }}
        />
      </SearchArea>
      <WorkArea>
        <ButtonArea>
          <LeftButtonArea>
          </LeftButtonArea>
          <RightButtonArea>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
        </ResultArea>
      </WorkArea>
    </ContentInner>
  );
}

export default Practice11;