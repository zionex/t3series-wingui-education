import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ContentInner, ViewPath, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridExcelExportButton, GridExcelImportButton,
  GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, PopupDialog, GridCnt, useViewStore, useContentStore, useStyles, zAxios, useUserStore, WorkArea,
  SplitPanel, HLayoutBox, VLayoutBox
} from "@wingui/common/imports";
import { Box, ButtonGroup } from "@mui/material";
import './Practice03.css';

let grid1Items = [
  {name: "KORNAME", dataType: "text", headerText :"KORNAME" , visible: true, editable: false, width: 100},
  {name: "GENDER", dataType: "text", headerText :"GENDER" , visible: true, editable: true, width: 100, useDropdown: true, lookupDisplay: true},
  {name: "AGE", dataType: "number", headerText :"AGE" , visible: true, editable: true, width: 100,
    styleCallback: function (grid, dataCell) {
      let ret = {};
      let age = grid.getValue(dataCell.index.itemIndex, "AGE");
      if(age > 40){
        //ret.styleName = "rg-cal-week-sun"; // 기존 default style도 함께 지정해줘야함.
        ret.styleName = "column-textAlignt-far editable-column red";
        ret.editable = true;
      }else{
        ret.editable = false;
      }
      return ret;
    }
  }, 
  {name: "PHONE", dataType: "text", headerText :"PHONE" , visible: true, editable: true, width: 100},
  {name: "PRODUCTID", dataType: "text", headerText :"PRODUCTID" , visible: false, editable: true, width: 100},
  {name: "KORCOUNTRY", dataType: "text", headerText :"KORCOUNTRY" , visible: false, editable: true, width: 100},
  {name: "ORDERDATE", dataType: "datetime", headerText :"ORDERDATE" , visible: true, editable: true, width: 100, format: "yyyy-MM-dd"},
  {name: "ACTIVE", dataType: "boolean", headerText :"ACTIVE" , visible: true, editable: true, width: 100},
];

let grid2Items = [
  {name: "DETAIL1", dataType: "text", headerText :"DETAIL1" , visible: true, editable: false, width: 100},
  {name: "DETAIL2", dataType: "text", headerText :"DETAIL2" , visible: true, editable: false, width: 100},
]

function addLog(log) {   
  console.log(log);
};  

function Practice03() {
  const activeViewId = getActiveViewId();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [
    state.viewData,
    state.getViewInfo,
    state.setViewInfo,
  ]);

  // SearchArea
  const [genderOption, setGenderOption] = useState([]);

  // grid
  const [grid1, setGrid1] = useState(null);
  const [grid2, setGrid2] = useState(null);

  // default
  const { control, getValues, setValue, watch, reset } = useForm({
    defaultValues: {
      plantCd: [],
      startDt: new Date(),
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
      registerCallback(); 
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
    const genderArr = [
      {label: "전체", value: "ALL"},
      {label: "남자", value: "남"},
      {label: "여자", value: "여"},
    ]

    setGenderOption(genderArr);
    setValue("gender", genderArr.length > 0 ? genderArr[0].value : "");
  };


  const loadGridCombo = async () => {
    grid1.gridView.setColumnProperty(
      "GENDER",
      "lookupData",
      {
        value: "CODE",
        label: "NAME",
        list: [
          {NAME: "전체", CODE: "ALL"},
          {NAME: "남자", CODE: "남"},
          {NAME: "여자", CODE: "여"},
        ]
      }
    );
  };

  const afterGrid1Create = (gridObj, gridView, dataProvider) => {
    gridView.setDisplayOptions({ fitStyle: 'even' });
    setVisibleProps(gridObj, true, true, true);
    setGrid1(gridObj);
  };
  
  const afterGrid2Create = (gridObj, gridView, dataProvider) => {
    gridView.setDisplayOptions({ fitStyle: 'even' });
    setVisibleProps(gridObj, true, true, true);
    setGrid2(gridObj);
  };

  // grid1 조회
  const loadData = () => {
    let data = [
      {
        KORNAME: "박OO",
        GENDER: "남",
        AGE: "71",
        PHONE: "(025)6563-2802",
        PRODUCTID: "198160731-00008",
        KORCOUNTRY: "모잠비크",
        ORDERDATE: "2021-01-16",
        ACTIVE: "Y",
      },
      {
        KORNAME: "조OO",
        GENDER: "남",
        AGE: "62",
        PHONE: "(093)8809-8696",
        PRODUCTID: "571215854-00001",
        KORCOUNTRY: "캐나다",
        ORDERDATE: "2019-07-29",
        ACTIVE: true,
      },
      {
        KORNAME: "김OO",
        GENDER: "남",
        AGE: "45",
        PHONE: "(010)1234-5678",
        PRODUCTID: "123456789-00003",
        KORCOUNTRY: "한국",
        ORDERDATE: "2020-05-23",
        ACTIVE: false,
      },
      {
        KORNAME: "이OO",
        GENDER: "여",
        AGE: "32",
        PHONE: "(010)8765-4321",
        PRODUCTID: "987654321-00004",
        KORCOUNTRY: "미국",
        ORDERDATE: "2020-11-11",
        ACTIVE: "Y",
      },
      {
        KORNAME: "한OO",
        GENDER: "여",
        AGE: "29",
        PHONE: "(010)5555-6666",
        PRODUCTID: "55556666-00005",
        KORCOUNTRY: "호주",
        ORDERDATE: "2021-03-14",
        ACTIVE: "Y",
      },
      {
        KORNAME: "장OO",
        GENDER: "남",
        AGE: "39",
        PHONE: "(010)7777-8888",
        PRODUCTID: "77778888-00006",
        KORCOUNTRY: "영국",
        ORDERDATE: "2018-09-17",
        ACTIVE: "N",
      },
      {
        KORNAME: "송OO",
        GENDER: "여",
        AGE: "35",
        PHONE: "(010)9999-0000",
        PRODUCTID: "99990000-00007",
        KORCOUNTRY: "프랑스",
        ORDERDATE: "2021-06-21",
        ACTIVE: "N",
      }
    ]
    ;
     
    grid1.dataProvider.fillJsonData(data);
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

  
function registerCallback() {
    let gridView = grid1.gridView;
    let dataProvider = grid1.dataProvider;

    gridView.onDataLoadComplated = function(grid){
      addLog("onDataLoadComplated 이벤트 발생. 행 수: " + dataProvider.getRowCount())
    }

    gridView.onCopy = function(grid, selection, event) {
        addLog("grid.onCopy");
    };

    gridView.onCurrentChanging = function (grid, oldIndex, newIndex) {
        addLog("grid.onCurrentChanging: " + "(" + oldIndex.itemIndex + ", " + oldIndex.column + ") => (" + newIndex.itemIndex + ", " + newIndex.column + ")");

        // return false; 를 하는 경우 위치 변경이 되지 않는다.
    };

    gridView.onCurrentChanged = function (grid, newIndex) {
        addLog("grid.onCurrentChanged: " + "(" + newIndex.itemIndex + ", " + newIndex.column + ")");
    };

    gridView.onCurrentRowChanged = function (grid, oldRow, newRow) {
        addLog("grid.onCurrentRowChanged: " + "(" + oldRow + " => " + newRow + ")");
    };

    gridView.onEditCanceled = function (grid, index) {
        addLog("grid.onEditCanceled driven, edit index=" + JSON.stringify(index));
    };

    gridView.onEditChange = function (grid, index, value) {
        addLog("grid.onEditChange driven, " + index.column + ' at ' + index.dataRow + ' was replaced by value: ' + value);
    };

    gridView.onEditCommit = function (grid, index, oldValue, newValue) {
        addLog("grid.onEditCommit driven, " + oldValue + " => " + newValue);
    };

    gridView.onEditRowChanged = function (grid, itemIndex, dataRow, field, oldValue, newValue) {
        var v = grid.getValue(itemIndex, field);
        addLog("grid.onEditRowChanged: " + oldValue + " => " + newValue);
    };

    gridView.onGetEditValue = function (grid, index, editResult) {
        addLog("grid.onGetEditValue: " + JSON.stringify(editResult));
    };

    gridView.onCellEdited = function (grid, itemIndex, row, field) {
        addLog("grid.onCellEdited: " + itemIndex + ', ' + field);
    }

    gridView.onHideEditor = function (grid, index) {
        addLog("grid.onHideEditor: " + index.itemIndex + "," + index.column);
    };

    gridView.onItemEditCancel = function (grid, itemIndex, state) {
        addLog("grid.onItemEditCancel: " + state);
        
        //return false; 를 하는 경우 취소 되지 않는다.
    };
    
    gridView.onItemEditCanceled = function (grid, itemIndex, state) {
        addLog("grid.onItemEditCanceled: " + state);
    };

    gridView.onPaste = function (grid, index, event){
        addLog("grid.Paste");
    };

    gridView.onPasted = function (grid){
        addLog("grid.Pasted");
    }

    gridView.onEditRowPasted = function (grid, itemIndex, row, fields, oldValues, newValues) {
        addLog('grid.onEditRowPasted: {' + newValues.join() + '}');
    };

    gridView.onRowInserting = function (grid, itemIndex, dataRow) {
        addLog("grid.onRowInserting: " + itemIndex);

        //추가하지 못하게 하려면 string 메시지나 boolean false를 리턴한다.
        return null;
    };

    gridView.onRowsDeleting = function (grid, rows) {
        addLog("grid.onRowsDeleting: " + rows);

        //null이 아닌 값을 반환하면 지정 텍스트를 표시하고 삭제를 취소한다.
        return null;
    };

    gridView.onRowsPasted =  function (grid, items) {
        addLog("grid.onRowsPasted" + items);
    };

    gridView.onShowEditor = function (grid, index, props, attrs) {
        addLog("grid.onShowEditor: " + index.itemIndex + "," + index.column);
    };

    dataProvider.onDataChanged = function (provider) {
        addLog("provider.onDataChanged");
    };

    dataProvider.onRestoreRows = function (provider, rows) {
        addLog('provider.onRestoreRows: ' + rows.join(', '));
    };

    dataProvider.onRowCountChanged = function (provider, newCount) {
        addLog("provider.onRowCountChanged: " + newCount);   
    };

    dataProvider.onRowDeleted = function (provider, row) {
        addLog('provider.onRowDeleted: ' + row);
    };

    dataProvider.onRowDeleting = function (provider, row) {
        addLog('provider.onRowDeleting: ' + row);
        return true;
    };

    dataProvider.onRowInserted = function (provider, row) {
        addLog("provider.onRowInserted");
    };

    dataProvider.onRowInserting = function (provider, row, values) {
        addLog('provider.onRowInserting: ' + row);
        return true;
    };

    dataProvider.onRowListUpdated = function (provider, rows) {
        addLog("provider.onRowListUpdated: " + rows.join(', '));
    };

    dataProvider.onRowMoved = function (provider, row) {
        addLog("provider.onRowMoved: " + row + ' to ' + newRow);
    };

    dataProvider.onRowMoving = function (provider, row, newRow) {
        addLog("provider.onRowMoving: " + row + ' to ' + newRow);

        return true;
    };

    dataProvider.onRowsDeleted = function (provider, rows) {
        addLog("provider.onRowsDeleted: " + rows.join(', '));
    };

    dataProvider.onRowsInserted = function (provider, row, count) {
        addLog("provider.onRowsInserted: " + count + " rows inserted!");
    };

    dataProvider.onRowsMoved = function (provider, row, count, newRow) {
        addLog('provider.onRowsMoved: ' + count + ' rows moved');
    };

    dataProvider.onRowStateChanged = function (provider, row) {
        addLog('provider.onRowStateChanged: ' + row);
    };

    dataProvider.onRowStatesChanged = function (provider, rows) {
        addLog('provider.onRowStatesChanged: ' + rows.join(','));
    };

    dataProvider.onRowStatesCleared = function (provider) {
        addLog('provider.onRowStatesCleared');
    };

    dataProvider.onRowsUpdated = function (provider, row, count) {
        addLog('provider.onRowsUpdated');
    };

    dataProvider.onRowUpdated = function (provider, row) {
        addLog("provider.onRowUpdated: " + row);
    };

    dataProvider.onRowUpdating = function (provider, row) {
        addLog("provider.onRowUpdating: " + row);
        return true;
    };

    dataProvider.onValueChanged = function (provider, row, field) {
        addLog('provider.onValueChanged: ' + row + ' row, ' + field + ' fieldIndex');
    };


    gridView.onCellClicked = function (grid, clickData) {
      console.log(gridView.getValue(clickData.itemIndex,'KORNAME'))
      console.log(dataProvider.getValue(clickData.dataRow, 'KORNAME'))
      addLog("onCellClicked: " + JSON.stringify(clickData));
      let name = gridView.getValue(clickData.itemIndex,'KORNAME');
      let data = [
        {
          DETAIL1: name,
          DETAIL2: "DETAIL2-1",
        },
        {
          DETAIL1: name,
          DETAIL2: "DETAIL2-2",
        },
      ];
      grid2.dataProvider.fillJsonData(data);
    }

    gridView.onCellDblClicked = function (grid, clickData) {
        addLog("onCellDblClicked: " + JSON.stringify(clickData));
    }

    gridView.onCellItemClicked = function (grid, index, clickData) {
        addLog("onCellItemClicked: " + JSON.stringify(clickData));
        return true;
    }

    gridView.onItemAllChecked = function (grid, checked) {
        addLog("onItemAllChecked: " + checked);
    }

    gridView.onItemChecked = function (grid, itemIndex, checked) {
        addLog("onItemChecked: " + checked + " at " + itemIndex);
    }

    gridView.onItemsChecked = function (grid, items, checked){
        addLog("onItemChecked: " + items.join() + " are checked as " + checked);
    }

    gridView.onSearchCellButtonClick = function (grid, index, text) {
        addLog("onSearchCellButtonClick: " + ' button was clicked!');
    }
  }

  return (
    <ContentInner>
      <SearchArea>
        <InputField type="select" name="gender" control={control} label={transLangKey('GENDER')} options={genderOption} />
        <InputField type="datetime" name="startDt" control={control} label={transLangKey('START_DT')} dateformat="yyyy-MM-dd"/>
      </SearchArea>
      <WorkArea>
      <SplitPanel>
          <VLayoutBox>
            <ButtonArea>
              <LeftButtonArea></LeftButtonArea>
              <RightButtonArea>
                <ButtonGroup variant="outlined">
                  <GridAddRowButton grid="grid1"></GridAddRowButton>
                  <GridDeleteRowButton grid="grid1" onDelete={deleteData}></GridDeleteRowButton>
                  <GridSaveButton
                    grid="grid1"
                    onClick={() => {
                      saveData();
                    }}
                  />
                </ButtonGroup>
              </RightButtonArea>
            </ButtonArea>
            <ResultArea>
              <BaseGrid id="grid1" items={grid1Items} afterGridCreate={afterGrid1Create} />
            </ResultArea>
          </VLayoutBox>
          <VLayoutBox>
            <ButtonArea>
              <LeftButtonArea>
              </LeftButtonArea>
              <RightButtonArea>
              </RightButtonArea>
            </ButtonArea>
            <ResultArea>
              <BaseGrid id="grid2" items={grid2Items} afterGridCreate={afterGrid2Create}></BaseGrid>
            </ResultArea>
          </VLayoutBox>
        </SplitPanel>
      </WorkArea>
    </ContentInner>
  );
}

export default Practice03;