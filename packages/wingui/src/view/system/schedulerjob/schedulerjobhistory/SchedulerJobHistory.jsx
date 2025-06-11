import React, { useState, useEffect, useRef } from "react";
import Pagination from "@wingui/view/demandplan/common/Pagination";
import { Box, ButtonGroup } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  ContentInner,
  WorkArea,
  SearchArea,
  ButtonArea,
  LeftButtonArea,
  RightButtonArea,
  InputField,
  BaseGrid,
  useViewStore,
  useUserStore,
  zAxios,
  useSearchPositionStore
} from "@wingui/common/imports";
import { transLangKey } from "@wingui";


const grid1Items = [
  { name: "id", dataType: "text", headerText: "id", visible: false, editable: false, width: 50 },
  { name: "groupName", dataType: "text", headerText: "UI_SCHEDULER_JOB_GROUP", visible: true, editable: false, width: 100 },
  { name: "name", dataType: "text", headerText: "UI_SCHEDULER_JOB_NAME", visible: true, editable: false, width: 200 },
  { name: "jobLangValue", dataType: "text", headerText: "UI_SCHEDULER_JOB_CLASS", lang: true, visible: true, editable: false, width: 200 },
  { name: "status", dataType: "text", headerText: "UI_SCHEDULER_JOB_STATUS", lang: true, visible: true, editable: false, width: 80 },
  { name: "localStartDttm", dataType: "datetime", headerText: "UI_SCHEDULER_JOB_START_AT", visible: true, editable: false, width: 140 },
  { name: "localEndDttm", dataType: "datetime", headerText: "UI_SCHEDULER_JOB_END_AT", visible: true, editable: false, width: 140 },
  { name: "runTimeFormat", dataType: "text", textAlignment: "center", headerText: "UI_SCHEDULER_JOB_EXECUTION_TIME", visible: true, editable: false, width: 140 },
  { name: "msg", dataType: "text", headerText: "MSG", lang: true, visible: true, editable: false, width: 400 },
  { name: "startDttm", dataType: "datetime", headerText: "UI_SCHEDULER_JOB_START_AT", visible: false, editable: false, width: 140 },
  { name: "endDttm", dataType: "datetime", headerText: "UI_SCHEDULER_JOB_END_AT", visible: false, editable: false, width: 140 },
];

const statusArr = [
  {label:"All", value:"All"}, {label:"SUCCESS", value:"SUCCESS"}, {label:"RUNNING", value:"RUNNING"}, {label:"FAIL", value:"FAIL"}
]

function SchedulerJobHistory(props) {
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);
  const [setSearchPosition] = useSearchPositionStore(state => [state.setSearchPosition])
  const activeViewId = getActiveViewId()
  const { reset, control, getValues, setValue, watch } = useForm({
    defaultValues: {
      jobName: "",
      jobCode: "All",
      jobHistoryStatus: "All"
    },
  });
  const globalButtons = [
    {
      name: "search",
      action: () => {
        paginationRef.current.goToPage1();
      },
      visible: true,
      disable: false,
    },
  ];
  const [jobClassArr, setJobClassArr] = useState([]);

  //PAGINEG
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [count, setCount] = useState(1);

  //GRID
  const [grid1, setGrid1] = useState(null);

  // REF
  const paginationRef = useRef();
  const [currentPaginationRef, setCurrentPaginationRef] = useState();


  const clearPaging = () => {
    if (grid1) {
      setPage(1);
      setCount(1);
      grid1.dataProvider.clearRows();
      grid1.gridView.rowIndicator.indexOffset = 0;
    }
  };

  // PAGING
  const onHandlePage = (page) => {
    setPage(page);
    loadGridData(page);
  };

  const onHandlePageSize = (pageSize) => {
    setPageSize(pageSize);
    setPage(1);
    loadGridData(1, pageSize);
  };

  const loadGridData = (pageVal, pageSizeVal) => {
    pageVal = pageVal ?? 1;
    pageSizeVal = pageSizeVal ?? pageSize;

    setPage(pageVal);
    setPageSize(pageSizeVal);

    zAxios({
      method: "get",
      url: "/scheduler-history/histories",
      params:{
        page:pageVal,
        pageSize:pageSizeVal,
        jobName: getValues("jobName"),
        jobCode: getValues("jobCode") === "All" ? "" : getValues("jobCode"),
        jobHistoryStatus: getValues("jobHistoryStatus") === "All" ? "" : getValues("jobHistoryStatus"),
      }
    })
      .then((res) => {
        if (res.status === HTTP_STATUS.SUCCESS) {
          let dataArr = res.data.content;

          if (dataArr?.length > 0) {
            let totalPage = res.data.totalPages;
            // TOTAL PAGE NUMBER
            setCount(totalPage);
            grid1.setData(dataArr);
            // OFFSET VAL
            grid1.gridView.rowIndicator.indexOffset = (pageVal === 1 ? 0 : ((pageVal - 1) * pageSize));

            //gird 조회시 첫번째 row  select  후 첫 row기준으로 chart
            var index = {
              itemIndex: 0,
              column: 0,
              dataRow: 0,
              fieldName: 0,
            };
            grid1.gridView.setCurrent(index);
          } else {
            clearPaging();

          }
        }
      })
      .catch((err) => {
        clearPaging();
        console.log(err);
      }).then(() => {
      });
  };

  const getJobClassArr = () => {

    zAxios({
      method: "get",
      url: "system/common/codes",
      params: {
        "group-cd": "JOB_CLASS"
      }
    })
      .then((res) => {
        if (res.status === HTTP_STATUS.SUCCESS) {
          let dataArr = [];

          if (res.data?.length > 0) {
            dataArr = res.data.map((d) => {
              let obj = {
                label: transLangKey(d.descrip),
                value: d.comnCd,
                data:d
              };

              return obj;
            });

            dataArr.unshift({label:"All",value:"All"})
          } 

          setJobClassArr([...dataArr]);
        }
      })
      .catch((err) => {
        console.log(err);
      }).then(() => {
      });
  }

  function afterGridCreate1(gridObj, gridView, dataProvider) {
    setGrid1(gridObj);
    gridObj.gridView.displayOptions.fitStyle = "fill";
    gridObj.gridView.setStateBar({ visible: true });

    gridObj.gridView.setCellStyleCallback(function (grid, dataCell) {
      let ret = {};

      if (dataCell.index.column.name === 'status') {
        let status = gridObj.gridView.getValues(dataCell.index.itemIndex).status;

        if(status === "SUCCESS") {
          return { style: { color: '#4374D9', bold: true } };
        } else if(status === "FAIL") {
          return { style: { color: '#FF5E00', bold: true } }; 
        } else if(status === "RUNNING") {
          return { style: { color: '#4374D9', bold: true } };
        }
      }

      return ret;
    });

    gridObj.gridView.setColumnProperty("msg", "renderer", { showTooltip: true });
    gridObj.gridView.onShowTooltip = function (grid, index, value) {
      var column = index.column;
      var itemIndex = index.itemIndex;
      var tooltip = column === "msg" ? "<div style='width:700px; white-space: normal;'>" + value  + "</div>" : "";

      return tooltip;
    };
  }

  useEffect(() => {
    if (paginationRef?.current) {
      setCurrentPaginationRef(paginationRef.current);
    }
    getJobClassArr();
  }, []);

  useEffect(() => {
    if (grid1) {
      setViewInfo(activeViewId, "globalButtons", globalButtons);
      loadGridData();
    }
  }, [grid1]);


  useEffect(() => {
    if (grid1) {
      setViewInfo(activeViewId, "globalButtons", globalButtons);
    }
  }, [grid1]);

  return (
    <>
      <ContentInner>
        <SearchArea>
          <InputField type={"text"} name={"jobName"} label={transLangKey("UI_SCHEDULER_JOB_NAME")} control={control} enterSelect/>
          <InputField type="select" name={"jobCode"} label={transLangKey("UI_SCHEDULER_JOB_CLASS")}control={control} options={jobClassArr} />
          <InputField type="select" name={"jobHistoryStatus"} label={transLangKey("UI_SCHEDULER_JOB_STATUS")}control={control} options={statusArr} />
        </SearchArea>
        <WorkArea>
          <Box style={{ height: '100%' }}>
            <ButtonArea>
              <LeftButtonArea>
                <ButtonGroup>
                </ButtonGroup>
              </LeftButtonArea>
              <RightButtonArea>
                <ButtonGroup>
                </ButtonGroup>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 80px)" }}>
              <BaseGrid id="grid1" items={grid1Items} afterGridCreate={afterGridCreate1} />
            </Box>
            <Pagination ref={paginationRef} page={page} pageSize={pageSize} count={count}
              onChange={(page) => onHandlePage(page)}
              onPageSizeChange={(pageSize) => onHandlePageSize(pageSize)}
            />
          </Box>
        </WorkArea>
      </ContentInner>
    </>
  )
}


export default SchedulerJobHistory;



