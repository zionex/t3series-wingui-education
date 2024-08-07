import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import { ContentInner, SearchArea, SearchRow, WorkArea, InputField, ResultArea, ButtonArea, 
  LeftButtonArea, RightButtonArea, BaseGrid, useViewStore, useContentStore, zAxios } from "@wingui/common/imports";

let jobSceduleGridItem = [
  { name: "JOB_GROUP", headerText: "JOB_GROUP", dataType: "string", width: "100", editable: false },
  { name: "JOB_KEY", headerText: "JOB_KEY", dataType: "string", width: "100", editable: false },
  { name: "JOB_PATTERN", headerText: "JOB_PATTERN", dataType: "string", width: "120", editable: false, fix: true },
  { name: "JOB_STARTTIME", headerText: "JOB_STARTTIME", dataType: "datetime", width: "120", editable: false },
  { name: "JOB_ENDTIME", headerText: "JOB_ENDTIME", dataType: "datetime", width: "120", visible: false, editable: false },
  { name: "JOB_DESC", headerText: "JOB_DESC", dataType: "string", width: "100", visible: false, editable: false },
  { name: "JOB_AFTER_FIRE_TIME", headerText: "JOB_AFTER_FIRE_TIME", dataType: "datetime", width: "120", editable: false },
  { name: "JOB_FINAL_FIRE_TIME", headerText: "JOB_FINAL_FIRE_TIME", dataType: "datetime", width: "120", visible: false, editable: false, datepicker: true },
  { name: "JOB_PRIOTY", headerText: "JOB_PRIOTY", dataType: "string", width: "120", editable: false },
  { name: "JOB_EXIST_STATUS", headerText: "JOB_EXIST_STATUS", dataType: "string", width: "100", editable: false },
  { name: "JOB_SERVER_ID", headerText: "JOB_SERVER_ID", dataType: "string", width: "100", editable: false },
  { name: "JOB_SERVICE_ID", headerText: "JOB_SERVICE_ID", dataType: "string", width: "100", editable: false },
]

function JobScheduleMgmt() {
  const [jobSceduleGrid, setJobSceduleGrid] = useState(null);
  const activeViewId = getActiveViewId()
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const {
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  const globalButtons = [
    {
      name: "search",
      action: (e) => {
        loadData();
      },
      visible: true,
      disable: false,
    },
  ];

  useEffect(() => {
    setJobSceduleGrid(getViewInfo(activeViewId, "jobSceduleGrid"));
  }, [viewData]);

  useEffect(() => {
    if (jobSceduleGrid) {
      setViewInfo(activeViewId, "globalButtons", globalButtons);
      setOption();

      loadData();
    }
  }, [jobSceduleGrid]);

  function setOption() {
    jobSceduleGrid.gridView.setCheckBar({ visible: true });
    jobSceduleGrid.gridView.onCellEdited = function (grid) {
      grid.commit(true);
    };
  }
  function loadData() {
    jobSceduleGrid.gridView.commit(true);

    jobSceduleGrid.gridView.showToast(progressSpinner + "Load Data...", true);

    zAxios
      .get("engine/T3SeriesDataServer/GetJob")
      .then(function (res) {
        jobSceduleGrid.dataProvider.fillJsonData(res.data[RESULT_DATA]);
      }).catch(function (err) {
        console.log(err);
      }).then(function () {
        jobSceduleGrid.gridView.hideToast();
      });
  }

  const initialize = () => {
    zAxios({
      method: "post",
      url: "engine/T3SeriesDataServer/InitializeJobSchedule",
      headers: { "content-type": "application/json" },
      params: {
        timeout: 0,
      },
    }).then(function (res) {
      if (res.data.RESULT_SUCCESS) {
        showMessage(transLangKey("MSG_CONFIRM"), "Initialize job schedule Success", { close: false });
      } else {
        showMessage(transLangKey("WARNING"), "Initialize job schedule Fail", { close: false });
      }
    }).catch(function (err) {
      console.log(err);
    }).then(function () { });
  };

  const terminate = () => {
    zAxios({
      method: "post",
      url: "engine/T3SeriesDataServer/TerminateJobSchedule",
      headers: { "content-type": "application/json" },
      params: {
        timeout: 0,
      }
    }).then(function (res) {
      if (res.data.RESULT_SUCCESS) {
        showMessage(transLangKey("MSG_CONFIRM"), "Terminate job schedule Success", { close: false });
      } else {
        showMessage(transLangKey("WARNING"), "Terminate job schedule Fail", { close: false });
      }
    }).catch(function (err) {
      console.log(err);
    }).then(function () { });
  };

  const pause = () => {
    let checkedRows = jobSceduleGrid.gridView.getCheckedRows();
    if (checkedRows.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_ROW'), { close: false });
    } else {
      showMessage(transLangKey('PAUSE'), transLangKey('MSG_PAUSE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let checked = [];

          checkedRows.forEach(function (row) {
            checked.push(jobSceduleGrid.dataProvider.getJsonRow(row));
          })
          formData.append('checked', JSON.stringify(checked));
          formData.append('timeout', 0);
          zAxios({
            method: "post",
            url: "engine/T3SeriesDataServer/PauseJob",
            headers: { "content-type": "multipart/form-data" },
            data: formData
          }).then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey("MSG_CONFIRM"), "job pause Success", { close: false });
            } else {
              showMessage(transLangKey("WARNING"), "job pause Fail", { close: false });
            }
          }).catch(function (err) {
            console.log(err);
          }).then(function () { });
        }
      })
    }
  };

  const resume = () => {
    let checkedRows = jobSceduleGrid.gridView.getCheckedRows();
    if (checkedRows.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_ROW'), { close: false });
    } else {
      showMessage(transLangKey('RESUME'), transLangKey('MSG_RESUME'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let checked = [];

          checkedRows.forEach(function (row) {
            checked.push(jobSceduleGrid.dataProvider.getJsonRow(row));
          })
          formData.append('checked', JSON.stringify(checked));
          formData.append('timeout', 0);
          zAxios({
            method: "post",
            url: "engine/T3SeriesDataServer/ResumeJob",
            headers: { "content-type": "multipart/form-data" },
            data: formData
          }).then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey("MSG_CONFIRM"), "job resume Success", { close: false });
            } else {
              showMessage(transLangKey("WARNING"), "job resume Fail", { close: false });
            }
          }).catch(function (err) {
            console.log(err);
          }).then(function () { });
        }
      })
    }
  };

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField control={control} label={transLangKey("JOB_KEY")} name="jobKey" rules={{}} onKeyDown={(e) => { if (e.key === 'Enter') { onSubmit() } }}></InputField>
        </SearchRow>
      </SearchArea>
      <WorkArea>
        <ButtonArea>
          <LeftButtonArea>
            <ButtonGroup>
              <Tooltip title={transLangKey("Initialize")} placement="bottom" arrow>
                <Button variant="soft" color="success" onClick={() => { initialize() }}> {"Initialize"} </Button>
              </Tooltip>
              <Tooltip title={transLangKey("Terminate")} placement="bottom" arrow>
                <Button variant="soft" color="success" onClick={() => { terminate() }}>  {"Terminate"} </Button>
              </Tooltip>
            </ButtonGroup>
          </LeftButtonArea>
          <RightButtonArea>
            <Tooltip title={transLangKey("Pause")} placement="bottom" arrow>
              <Button variant="soft" color="success" onClick={() => { pause() }}> {"Pause"} </Button>
            </Tooltip>
            <Tooltip title={transLangKey("Resume")} placement="bottom" arrow>
              <Button variant="soft" color="success" onClick={() => { resume() }}> {"Resume"} </Button>
            </Tooltip>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea sizes={[100]} direction={"vertical"}>
          <BaseGrid id="jobSceduleGrid" items={jobSceduleGridItem}></BaseGrid>
        </ResultArea>
      </WorkArea>
    </ContentInner>
  );
}

export default JobScheduleMgmt;
