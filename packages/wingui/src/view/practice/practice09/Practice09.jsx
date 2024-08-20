import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { ContentInner, ViewPath, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridExcelExportButton, GridExcelImportButton,
  GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, PopupDialog, GridCnt, useViewStore, useContentStore, useStyles, zAxios, useUserStore, WorkArea
} from "@wingui/common/imports";
import { areacodes } from './areacodes'


let grid1Items = [
  {name: "area1code", dataType: "text", headerText :"시 도" , visible: true, editable: true, width: 100, textAlignment: "center",
    useDropdown: true, lookupDisplay: true 
  },
  {name: "area2code", dataType: "text", headerText :"군 구" , visible: true, editable: true, width: 100, textAlignment: "center",
    useDropdown: true, lookupDisplay: true, lookupSourceId:"AREA2_CD", lookupKeyFields:["area1code","area2code"]
  },
  {name: "area3code", dataType: "text", headerText :"읍 면 동" , visible: true, editable: true, width: 100, textAlignment: "center",
    useDropdown: true, lookupDisplay: true, lookupSourceId:"AREA3_CD", lookupKeyFields:["area1code", "area2code","area3code"]
  },
];

function Practice09() {
  const activeViewId = getActiveViewId();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [
    state.viewData,
    state.getViewInfo,
    state.setViewInfo,
  ]);

  // SearchArea

  // grid
  const [grid1, setGrid1] = useState(null);

  // default
  const { control, getValues, setValue, watch, reset } = useForm({
    defaultValues: {
    },
  });

   // globalButtons
  const globalButtons = [
    { name: 'search', action: (e) => { loadData() }, visible: true, disable: false },
    { name: "refresh", action: (e) => { refresh() }, visible: true, disable: false },
  ];

  useEffect(() => {
    loadCombo();
  }, []);

  useEffect(() => {
    setViewInfo(activeViewId, "globalButtons", globalButtons);
    
    if(grid1){
      loadGridCombo(); 
      setLookups();
      loadData();
    }
  }, [grid1]);

  const refresh = () => {
    grid1.gridView.refresh();
    grid1.dataProvider.clearRows();
    reset();
    loadCombo();
  };
  
  const loadCombo = async () => {
  };


  const loadGridCombo = async () => {
    setLookups();
  };

  const afterGrid1Create = (gridObj, gridView, dataProvider) => {
    gridView.setDisplayOptions({ fitStyle: 'even' });
    setVisibleProps(gridObj, true, true, true);
    setGrid1(gridObj);

    gridView.onEditCommit = function (grid, index, oldValue, newValue) {
      if (index.fieldName === "area1code") {
          if (oldValue !== newValue) {
              grid.setValue(index.itemIndex, "area2code", "");
              grid.setValue(index.itemIndex, "area3code", "");
          }
      } else if (index.fieldName === "area2code") {
          if (oldValue !== newValue) {
              grid.setValue(index.itemIndex, "area3code", "");
          }
      };
    };
  };


  //lookup설정
  function setLookups() {
    let area1codes = {id:"AREA1_CD", levels:1, tags: [], keys: [], values: []};
    let area2codes = {id:"AREA2_CD", levels:2, tags: [], keys: [], values: []};
    var area3codes = {id:"AREA3_CD", levels:3, tags: [], keys: [], values: []};

    for (var i = 0, cnt = areacodes.length; i < cnt ; i++) {
      var codes = areacodes[i];

      if (area1codes.keys.indexOf(codes.area1code) < 0) {
        area1codes.keys.push(codes.area1code);
        area1codes.values.push(codes.area1name);
      }

      if (area2codes.tags.indexOf(codes.AREA2_CD) < 0) {
        area2codes.tags.push(codes.area2code);
        area2codes.keys.push([codes.area1code, codes.area2code]);
        area2codes.values.push(codes.area2name);
      }

      if (area3codes.tags.indexOf(codes.area3code) < 0) {
        area3codes.tags.push(codes.area3code);
        area3codes.keys.push([codes.area1code, codes.area2code, codes.area3code]);
        area3codes.values.push(codes.area3name);
      }
    }

    grid1.gridView.setColumnProperty(
      "area1code",
      "values",
      area1codes.keys
    );

    grid1.gridView.setColumnProperty(
      "area1code",
      "labels",
      area1codes.values
    );

    grid1.gridView.addLookupSource(area2codes);
    grid1.gridView.addLookupSource(area3codes);
  }

  // grid1 조회
  const loadData = () => {
    grid1.dataProvider.fillJsonData(areacodes,{count:20});
  };

  // 저장
  function saveData() {
    console.log("saveData")
  }  

  // 삭제
  function deleteData(targetGrid, deleteRows) {
    if (deleteRows.length > 0) {
      console.log("deleteData")
    }
  }

  return (
    <ContentInner>
      <SearchArea>
      </SearchArea>
      <WorkArea>
        <ButtonArea>
          <LeftButtonArea>
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton grid="grid1"></GridAddRowButton>
            <GridDeleteRowButton grid="grid1" onDelete={deleteData}></GridDeleteRowButton>
            <GridSaveButton
              grid="grid1"
              onClick={() => {
                saveData();
              }}
            />
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <Box style={{ height: "100%" }}>
            <BaseGrid id="grid1" items={grid1Items} afterGridCreate={afterGrid1Create} />
          </Box>
        </ResultArea>
      </WorkArea>
    </ContentInner>
  );
}

export default Practice09;