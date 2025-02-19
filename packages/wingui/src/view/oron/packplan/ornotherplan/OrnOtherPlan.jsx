import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import {
  ContentInner, WorkArea, SearchArea, ButtonArea, LeftButtonArea, RightButtonArea, ResultArea, GridExcelExportButton,
  GridSaveButton, BaseGrid, InputField, useUserStore, useViewStore, zAxios, CommonButton
} from '@wingui/common/imports';
import './OrnOtherPlan.css';

let ornOtherPlanGridColumns = [
  { name: 'PLANT_CD', dataType: 'text', headerText: 'MP_PLANT_CD', visible: true, editable: false, width: 60, textAlignment: "center" },
  { name: 'PLANT_NM', dataType: 'text', headerText: 'MP_PLANT_NM', visible: true, editable: false, width: 120 },
  { name: 'PLANT_ORD_SEQ', dataType: 'text', headerText: 'PK_ORD_SEQ', visible: true, editable: false, width: 40, textAlignment: "center" },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'PK_ITEM_CD', visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'PK_ITEM_NM', visible: true, editable: false, width: 200 },
  { name: 'ORD_WK', dataType: 'text', headerText: 'CAL_WEEK', visible: false, editable: false },
];

let plantCdSize = 0;

function OrnOtherPlan() {
  const activeViewId = getActiveViewId();
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [ornOtherPlanGrid, setOrnOtherPlanGrid] = useState(null);
  const [isCombosLoaded, setIsCombosLoaded] = useState(false);

  const [plantCdList, setPlantCdList] = useState([]);
  const [planStDtList, setPlanStDtList] = useState([]);
  const [loadedStDt, setLoadedStdt] = useState(null);

  const { control, getValues, setValue, watch, reset } = useForm({
    defaultValues: {
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ];

  const exportOptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    loadCombos();
  }, [])

  useEffect(() => {
    if (ornOtherPlanGrid) {
      setViewInfo(activeViewId, 'globalButtons', globalButtons);
      setGridOption(ornOtherPlanGrid);
    }
  }, [ornOtherPlanGrid]);

  useEffect(() => {
    if (isCombosLoaded) {
      onSubmit(); // 콤보 데이터가 모두 로드되면 데이터 로드
      setIsCombosLoaded(!isCombosLoaded);
    }
  }, [isCombosLoaded]);

  const loadCombos = async () => {
    try {
      const planStDtOptions = await loadComboList({
        PROCEDURE_NAME: "SP_UI_PK_ORN_COMM_SRH_Q",
        URL: "common/data",
        CODE_KEY: "DISP_CD",
        CODE_VALUE: "DISP_NM",
        PARAM: {
          P_SRH_CD: "PACK_ORD_DT",
        },
        ALLFLAG: false
      });
      if (planStDtOptions.length > 0) {
        setPlanStDtList(planStDtOptions);
        let values = planStDtOptions.map(option => option.value);
        setValue('planStDt', values[0]);
      }

      const plantCdOptions = await loadComboList({
        PROCEDURE_NAME: "SP_UI_PK_ORN_COMM_SRH_Q",
        URL: "common/data",
        CODE_KEY: "DISP_CD",
        CODE_VALUE: "DISP_NM",
        PARAM: {
          P_SRH_CD: "DELIVY_CD",
        },
        ALLFLAG: false
      });
      if (plantCdOptions.length > 0) {
        setPlantCdList(plantCdOptions);
        plantCdSize = plantCdOptions.length;
        let values = plantCdOptions.map(option => option.value);
        setValue('plantCd', values);
      }
      setIsCombosLoaded(true);

    } catch (error) {
      console.error("Error loading combo data:", error);
      setIsCombosLoaded(false); // 실패 시 false로 설정
    }
  }

  const onSubmit = () => {
    loadData();
  };

  const refresh = () => {
    reset();
    ornOtherPlanGrid.dataProvider.clearRows();
    loadCombos();
  }

  function afterGridCreate(gridObj) {
    setOrnOtherPlanGrid(gridObj);
  }

  const setGridOption = (grid) => {
    setVisibleProps(grid, false, false, true);

    grid.gridView.displayOptions.fitStyle = 'fill';
  }

  function loadData() {
    let planStDt = getValues('planStDt');
    let plantCdArr = getValues('plantCd');
    let params = {
      // P_PLAN_ST_DT: planStDt,
      P_PLAN_ST_DT: '20241014', //테스트데이터
      P_PLANT_CD: plantCdArr.length == plantCdSize ? "" : plantCdArr.join(","),
      P_USER_ID: username
    }

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'pk/simulation/otherplan/q1',
      data: params
    })
      .then(function (res) {
        if (res.status === HTTP_STATUS.SUCCESS) {
          setLoadedStdt(planStDt);

          let dataArr = res.data;
          setCrossTabHeader(ornOtherPlanGrid, dataArr.header, dataArr.data);
          setCrossTabGridData(ornOtherPlanGrid, dataArr);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const setCrossTabHeader = (grid, header, data) => {
    let columns = [];

    header.forEach((headerName) => {
      columns.push({
        name: headerName,
        dataType: 'number',
        headerText: headerName.slice(0, 4) + "-" + headerName.slice(4, 6) + "-" + headerName.slice(6, 8),
        visible: true,
        editable: false,
        width: 70,
        numberFormat: "#,###",
      });
    });
    columns.push(
      { name: 'DESCRIP', dataType: 'text', headerText: 'REMARK', visible: true, editable: false, width: 200 },
      {
        name: 'MOD_DIV', dataType: 'text', headerText: 'CTG_NM', visible: true, editable: false, width: 60, displayCallback: (grid, index, value) => transLangKey(value),
        textAlignment: "center", styleCallback: (grid, dataCell) => {
          let ret = {};
          if (grid.getValue(dataCell.index.itemIndex, "MOD_DIV") === "PK_MOD") {
            ret.styleName = "modify-column";
          } else if (grid.getValue(dataCell.index.itemIndex, "MOD_DIV") === "PK_NEW") {
            ret.styleName = "new-column";
          }
          return ret;
        },
      }
    )
    grid.addGridItems(ornOtherPlanGridColumns.concat(columns), true);
    setGridOption(grid)
  }

  const setCrossTabGridData = (grid, dataArr) => {
    let jsonData = [];
    let header = dataArr.header;
    let data = dataArr.data;
    data.map(function (dataRow) {
      let obj = {};
      obj = Object.assign(obj, dataRow);
      header.map(function (val, idx) {
        obj[val] = dataRow["ORD_QTY"][idx];
      });
      jsonData.push(obj);
    });

    grid.dataProvider.fillJsonData(jsonData);
  }

  const planReflect = () => {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_PLAN_REFLECT'), async function (answer) {
      if (answer) {
        let checkedRows = [];
        ornOtherPlanGrid.gridView.getCheckedRows().forEach(function (indx) {
          checkedRows.push(indx);
        });

        if (checkedRows.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('FP_MSG_NO_ROW_CHECKED'), { close: false });
        } else {
          let reflectData = [];
          checkedRows.forEach((row) => {
            let data = ornOtherPlanGrid.dataProvider.getJsonRow(row);
            // 날짜 데이터 필터링
            Object.keys(data).forEach(key => {
              // 날짜 형식으로 된 키인지 확인하고 undefined가 아닌 경우 필터링
              if (key.startsWith("20") && data[key] !== undefined) {
                reflectData.push({
                  P_PLANT_CD: data.PLANT_CD,
                  P_ITEM_CD: data.ITEM_CD,
                  P_ORD_WK: data.ORD_WK,
                  P_REQ_DT: key, // 날짜 컬럼명을 REQ_DT로 매핑
                  P_ORD_QTY: data[key], // 날짜 값 자체를 ORD_QTY로 매핑
                  P_DESCRIP: data.DESCRIP || "", // 설명 값이 없으면 빈 문자열
                  P_ORD_SEQ: data.PLANT_ORD_SEQ,
                  P_USER_ID: username
                });
              }
            });
          });

          if (reflectData.length > 0) {
            zAxios({
              method: 'post',
              headers: { 'content-type': 'application/json' },
              url: baseURI() + 'pk/simulation/otherplan/r1',
              data: reflectData
            })
              .then(function (res) {
                showMessage(transLangKey("MSG_CONFIRM"), transLangKey(res.data.message), { close: false });
                if (res.status === HTTP_STATUS.SUCCESS) {
                  loadData();
                }
              })
              .catch(function (e) {
                console.error(e);
              });
          }
        }
      }
    })
  }

  const getWeekMon = (today) => {
    const dayOfWeek = today.getDay(); // 일요일: 0, 월요일: 1, ..., 토요일: 6
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // 월요일 계산
    return monday.format('yyyyMMdd'); // 월요일 날짜를 'yyyyMMdd' 형식으로 반환
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <InputField style={{ width: 220 }} type="select" name="planStDt" control={control} label={transLangKey("PK_PLAN_ST_DT")} options={planStDtList} />
          <InputField type="multiSelect" name="plantCd" control={control} label={transLangKey('FP_PLANT')} options={plantCdList} />
        </SearchArea>
        <WorkArea>
          <ButtonArea>
            <LeftButtonArea>
              <GridExcelExportButton type='icon' grid='ornOtherPlanGrid' options={exportOptions} />
            </LeftButtonArea>
            <RightButtonArea>
              <CommonButton type="text" title={transLangKey("PK_PLAN_REFLECT")} onClick={() => { planReflect() }} disabled={loadedStDt && loadedStDt < getWeekMon(new Date)} />
            </RightButtonArea>
          </ButtonArea>
          <ResultArea>
            <BaseGrid id='ornOtherPlanGrid' items={ornOtherPlanGridColumns} afterGridCreate={afterGridCreate}></BaseGrid>
          </ResultArea>
        </WorkArea>
      </ContentInner>
    </>
  )
}

export default OrnOtherPlan;
