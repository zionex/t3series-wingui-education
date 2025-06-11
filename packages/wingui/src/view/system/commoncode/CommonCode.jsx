import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup, Box } from "@mui/material";
import {
  ContentInner, SearchArea, WorkArea, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow,
  InputField, BaseGrid, GridAddRowButton, GridDeleteRowButton, GridSaveButton, useContentStore,
  useIconStyles, useViewStore, zAxios
} from "@wingui/common/imports";
import { SplitPanel, VLayoutBox } from "@zionex/wingui-core";
import { setGridEventHandler } from "@zionex/wingui-core/component/grid/grid"

let codeGrpGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "srcId", dataType: "text", headerText: "SRC_ID", visible: false, editable: false, width: 100 },
  {
    name: "grpCd", dataType: "text", headerText: "GRP_CD", visible: true, editable: false, width: 200, validRules: [{ criteria: "required" }],
    styleCallback: function (grid, dataCell) {
      let ret = {}
      if (dataCell.item.rowState == 'created' || dataCell.item.itemState == 'appending' || dataCell.item.itemState == 'inserting') {
        ret.editable = true;
        ret.styleName = 'editable-text-column';
      } else {
        ret.editable = false;
        ret.styleName = 'text-column';
      }
      return ret;
    },
  },
  { name: "grpNm", dataType: "text", headerText: "GRP_NM", visible: true, editable: true, width: 250, validRules: [{ criteria: "required" }] },
  { name: "descrip", dataType: "text", headerText: "DESCRIP", visible: false, editable: false, width: 250 },
  {
    name: "descripLangValue", dataType: "text", headerText: "DESCRIP", visible: true, editable: true, width: 250, lang: true
  },
  { name: "seq", dataType: "text", headerText: "SEQ", visible: false, editable: false, width: 50 },
  { name: "useYn", dataType: "boolean", headerText: "USE_YN", visible: true, editable: true, width: 50, defaultValue: true },
  { name: "attr01Val", dataType: "text", headerText: "ATTR01_VAL", visible: true, editable: true, width: 100 },
  { name: "attr02Val", dataType: "text", headerText: "ATTR02_VAL", visible: true, editable: true, width: 100 },
  { name: "attr03Val", dataType: "text", headerText: "ATTR03_VAL", visible: true, editable: true, width: 100 },
  { name: "attr04Val", dataType: "text", headerText: "ATTR04_VAL", visible: true, editable: true, width: 100 },
  { name: "attr05Val", dataType: "text", headerText: "ATTR05_VAL", visible: true, editable: true, width: 100 },
  { name: "createBy", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80 },
  { name: "createDttm", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 100 },
  { name: "modifyBy", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80 },
  { name: "modifyDttm", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 100 },
];

let codeGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "srcId", dataType: "text", headerText: "SRC_ID", visible: false, editable: false, width: 100, validRules: [{ criteria: "required" }] },
  { name: "grpCd", dataType: "text", headerText: "GRP_CD", visible: false, editable: false, width: 200, validRules: [{ criteria: "required" }] },
  { name: "comnCd", dataType: "text", headerText: "COMN_CD", visible: true, editable: true, width: 200 },
  { name: "comnCdNm", dataType: "text", headerText: "COMN_CD_NM", visible: true, editable: true, width: 250 },
  { name: "descrip", dataType: "text", headerText: "DESCRIP", visible: false, editable: false, width: 250 },
  { name: "descripLangValue", dataType: "text", headerText: "DESCRIP", visible: true, editable: true, width: 250 },
  { name: "seq", dataType: "text", headerText: "SEQ", visible: true, editable: true, width: 50 },
  { name: "useYn", dataType: "boolean", headerText: "USE_YN", visible: true, editable: true, width: 50, defaultValue: true },
  { name: "attr01Val", dataType: "text", headerText: "ATTR01_VAL", visible: true, editable: true, width: 100 },
  { name: "attr02Val", dataType: "text", headerText: "ATTR02_VAL", visible: true, editable: true, width: 100 },
  { name: "attr03Val", dataType: "text", headerText: "ATTR03_VAL", visible: true, editable: true, width: 100 },
  { name: "attr04Val", dataType: "text", headerText: "ATTR04_VAL", visible: true, editable: true, width: 100 },
  { name: "attr05Val", dataType: "text", headerText: "ATTR05_VAL", visible: true, editable: true, width: 100 },
  { name: "createBy", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80 },
  { name: "createDttm", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 100 },
  { name: "modifyBy", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80 },
  { name: "modifyDttm", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 100 },
];

function CommonCode() {
  const [groupCodeLabel, setGroupCodeLabel] = useState('');
  const activeViewId = getActiveViewId()
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [codeGrpGrid, setcodeGrpGrid] = useState(null);
  const [codeGrid, setCodeGrid] = useState(null);
  const prevRowRef = useRef({});

  const { control, getValues } = useForm({
    defaultValues: {
    }
  });
  const globalButtons = [
    {
      name: "search",
      action: (e) => { loadData(codeGrpGrid) },
      visible: true,
      disable: false
    }
  ]

  useEffect(() => {
    if (codeGrpGrid) {
      setViewInfo(activeViewId, 'globalButtons', globalButtons)
      setOptions()
    }
  }, [codeGrpGrid]);

  useEffect(() => {
    if (codeGrid) {
      setCodeGridOptions()
    }
  }, [codeGrid])

  useEffect(() => {
    setGroupCodeLabel('');
  }, []);
  const afterCodeGrpGridCreate = (gridObj, gridView, dataProvider) => {
    setcodeGrpGrid(gridObj)
  };
  const afterCodeGridCreate = (gridObj, gridView, dataProvider) => {
    setCodeGrid(gridObj)
  };

  function setOptions() {
    codeGrpGrid.gridView.setCheckBar({ visible: true });
    codeGrpGrid.gridView.setStateBar({ visible: true });

    setGridEventHandler(codeGrpGrid.gridView, 'onCellClicked', function (grid, clickData) {
      if (codeGrid.isUpdated()) {
        showMessage(transLangKey('WARNING'), transLangKey('MSG_WARNING_SAVE_STATUS'), function (answer) {
          if (answer) {
            loadDetail(grid, clickData);
          } else {
            codeGrpGrid.gridView.setCurrent({ itemIndex: prevRowRef.current['itemIndex'], column: prevRowRef.current['column'] });
          }
        });
      } else {
        loadDetail(grid, clickData);
      };
    }
    )
  }

  function loadDetail(grid, clickData) {
    let id = grid.getValue(clickData.itemIndex, 'id');
    if (id !== undefined && id !== null) {
      setGroupCodeLabel(transLangKey("COMMON_CODE_GROUP") + " : " + grid.getValue(clickData.itemIndex, 'grpCd') + " (" + grid.getValue(clickData.itemIndex, 'grpNm') + ")");
      loadData(codeGrid, id);
    }
    prevRowRef.current['itemIndex'] = clickData.itemIndex;
    prevRowRef.current['column'] = clickData.column;
  }

  function setCodeGridOptions() {
    codeGrid.gridView.setCheckBar({ visible: true });
    codeGrid.gridView.setStateBar({ visible: true })
  }

  function deleteRow(targetGrid, deleteRows) {
    let seperator = (targetGrid.gridView.id === 'codeGrpGrid') ? 'groups' : 'codes'
    targetGrid.gridView.commit(true);

    let selectedSrcId =  codeGrpGrid.dataProvider.getValue(codeGrpGrid.gridView.getCurrent().dataRow, 'id');

    if (deleteRows.length > 0) {
      if (targetGrid.gridView.id === 'codeGrid' && targetGrid.gridView.getCheckedRows().length === targetGrid.dataProvider.getRowCount()) {
        //적어도 하나 이상의 공통코드는 존재해야 합니다.
        showMessage(transLangKey('DELETE'), transLangKey('MSG_WARNING_DELETE_COMMON_CODE'), { close: false })
        loadData(targetGrid, selectedSrcId, targetGrid.gridView.getCurrent())

      } else {
        targetGrid.gridView.showToast(progressSpinner + 'Deleting data...', true);

        let formData = new FormData();
        formData.append("changes", JSON.stringify(deleteRows));

        zAxios({
          method: 'post',
          url: 'system/common/' + seperator + '/delete',
          headers: { 'content-type': 'multipart/form-data' },
          data: formData
        }).then(function (response) {
          if (response.status === HTTP_STATUS.SUCCESS) {
            let deleteRows = [];
            targetGrid.gridView.getCheckedRows().forEach(function (row) {
              let dataRow = targetGrid.gridView.getDataRow(row);
              deleteRows.push(dataRow);
            });
            targetGrid.dataProvider.removeRows(deleteRows);
          }
        })
          .catch(function (err) {
            console.log(err);
          })
          .then(function () {
            targetGrid.gridView.hideToast();
            if (targetGrid.gridView.id === 'codeGrpGrid') {
              loadData(targetGrid, undefined, targetGrid.gridView.getCurrent())
            } else {
              loadData(targetGrid, selectedSrcId, targetGrid.gridView.getCurrent())
            }
          });
      }
    }
  }
  function saveData(targetGrid) {
    targetGrid.gridView.commit(true);

    let seperator = (targetGrid.gridView.id === 'codeGrpGrid') ? 'groups' : 'codes'

    let changeRowData = [];
    let changes = [];

    changes = changes.concat(
      targetGrid.dataProvider.getAllStateRows().created,
      targetGrid.dataProvider.getAllStateRows().updated,
      targetGrid.dataProvider.getAllStateRows().deleted,
      targetGrid.dataProvider.getAllStateRows().createAndDeleted
    );

    let msg = '';
    let checkCd = '';

    let useYn = true;
    let selectedGroupCd = codeGrpGrid.dataProvider.getValue(codeGrpGrid.gridView.getCurrent().dataRow, 'grpCd')
    let selectedSrcId = codeGrpGrid.dataProvider.getValue(codeGrpGrid.gridView.getCurrent().dataRow, 'id')
    let selectedUseYn = codeGrpGrid.dataProvider.getValue(codeGrpGrid.gridView.getCurrent().dataRow, 'useYn')
    let checkCharactor = 0;
    changes.forEach(function (row) {
      useYn = targetGrid.dataProvider.getJsonRow(row).useYn;
      checkCd = (targetGrid.gridView.id === 'codeGrpGrid') ? targetGrid.dataProvider.getJsonRow(row).grpCd : targetGrid.dataProvider.getJsonRow(row).comnCd;
      if (targetGrid.gridView.id === 'codeGrid') {
        targetGrid.dataProvider.setValue(row, 'grpCd', selectedGroupCd)
        targetGrid.dataProvider.setValue(row, 'srcId', selectedSrcId)
      }
      if (checkCd !== undefined) {
        if (checkCd.replaceAll("_", "").replaceAll(/[0-9]/g, '').match(/[^A-Z]/g) !== null || checkCd.match(new RegExp(/[\s]/g)) !== null) {
          // 코드는 대문자와 숫자만 입력 가능하며 공백 대신 '_' 문자를 사용해야 합니다.
          msg = 'MSG_CHECK_GROUP_CODE_01'
          checkCharactor++;
        }
      } else {
        //코드를 입력해주세요.
        msg = 'MSG_CHECK_GROUP_CODE_03'
        checkCharactor++;
      }
      changeRowData.push(targetGrid.dataProvider.getJsonRow(row));
    });

    if (changeRowData.length === 0) {
      //저장 할 내용이 없습니다.
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else if (checkCharactor > 0 || checkCd === undefined) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey(msg), { close: false });
    } else {
      let msg = "MSG_SAVE";
      let useYnCount = 0;

      if (targetGrid.gridView.id === 'codeGrpGrid') {
        //모든 공통코드도 사용 해제됩니다. 저장하시겠습니까?
        msg = (!useYn) ? "MSG_SAVE_GROUP_CODE" : "MSG_SAVE"
        useYnCount = 1;
      } else {
        targetGrid.dataProvider.getJsonRows().forEach(function (row) {
          if (row.useYn) {
            useYnCount++
          }
        })
      }
      if (selectedUseYn && !useYnCount) {
        //공통코드 그룹이 사용중입니다. 최소 하나 이상의 공통코드는 사용해야 합니다.
        msg = 'MSG_WARNING_COMMON_CODE';
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey(msg), { close: false })
      } else {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey(msg), function (answer) {
          if (answer) {
            targetGrid.gridView.showToast(progressSpinner + 'Saving data...', true);

            changeRowData.forEach(function (value) {
              if (value.expiredDttm && value.expiredDttm instanceof Date) {
                value.expiredDttm = value.expiredDttm.format("yyyy-MM-ddTHH:mm:ss");
              }
            })

            let formData = new FormData();
            formData.append("changes", JSON.stringify(changeRowData));

            zAxios({
              method: 'post',
              headers: { 'content-type': 'multipart/form-data' },
              url: 'system/common/' + seperator,
              data: formData
            })
              .then(function (response) {
              })
              .catch(function (err) {
                console.log(err);
              })
              .then(function () {
                targetGrid.gridView.hideToast();
                if (targetGrid.gridView.id === 'codeGrpGrid') {
                  loadData(targetGrid, undefined, targetGrid.gridView.getCurrent())
                } else {
                  loadData(targetGrid, selectedSrcId, targetGrid.gridView.getCurrent())
                }
              });
          }
        });
      }
    }
  }
  function loadData(targetGrid, srcId, current) {
    if (targetGrid.gridView.id === 'codeGrpGrid') {
      resetAll(current)
    }

    targetGrid.gridView.commit(true);

    let seperator = {};
    if (srcId === undefined) {
      seperator.url = 'groups'
      seperator.params = {
        'group-cd': getValues('grpCd'),
        'group-nm': getValues('grpNm')
      }
    } else {
      seperator.url = 'codes/' + srcId
      seperator.params = { 'srcId': srcId }
    }

    zAxios.get('system/common/' + seperator.url, {
      params: seperator.params,
      waitOn: false
    }).then(function (res) {
      if (res.data.length === 0) {
        targetGrid.dataProvider.fillJsonData([]);
        setGroupCodeLabel('')
      } else {
        targetGrid.dataProvider.fillJsonData(res.data);
      }
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
    });
  }

  function resetAll(current) {
    if (current == undefined) {
      codeGrpGrid.dataProvider.clearRows();
      codeGrid.dataProvider.clearRows();
      setGroupCodeLabel('')
    }
  }
  function insertRow(gridObject) {
    if (gridObject.dataProvider.getRowCount() > 0) {
      gridObject.gridView.beginInsertRow(gridObject.gridView.getCurrent().itemIndex + 1);
    } else {
      gridObject.gridView.beginAppendRow(0);
    }
    gridObject.gridView.commit(true);
  }
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField name="grpCd" label={transLangKey("GRP_CD")} readonly={false} disabled={false} onKeyDown={(e) => { if (e.key === 'Enter') { loadData(codeGrpGrid) } }} control={control} />
          <InputField name="grpNm" label={transLangKey("GRP_NM")} onKeyDown={(e) => { if (e.key === 'Enter') { loadData(codeGrpGrid) } }} control={control} readonly={false} disabled={false} />
        </SearchRow>
      </SearchArea>
      <WorkArea>
        <SplitPanel>
          <VLayoutBox>
            <ButtonArea>
              <LeftButtonArea></LeftButtonArea>
              <RightButtonArea>
                <ButtonGroup variant="outlined">
                  <GridAddRowButton grid="codeGrpGrid" onClick={() => { insertRow(codeGrpGrid) }}></GridAddRowButton>
                  <GridDeleteRowButton grid="codeGrpGrid" onDelete={deleteRow} ></GridDeleteRowButton>
                  <GridSaveButton onClick={() => { saveData(codeGrpGrid) }}>{transLangKey("SAVE")}</GridSaveButton>
                </ButtonGroup>
              </RightButtonArea>
            </ButtonArea>
            <ResultArea>
              <BaseGrid id="codeGrpGrid" items={codeGrpGridItems} afterGridCreate={afterCodeGrpGridCreate}></BaseGrid>
            </ResultArea>
          </VLayoutBox>
          <VLayoutBox>
            <ButtonArea>
              <LeftButtonArea>
                <label className="mt-2" style={{ height: "28px", lineHeight: "28px" }}>{groupCodeLabel}</label>
              </LeftButtonArea>
              <RightButtonArea>
                <ButtonGroup variant="outlined">
                  <GridAddRowButton grid="codeGrid" onClick={() => { insertRow(codeGrid) }}></GridAddRowButton>
                  <GridDeleteRowButton grid="codeGrid" onDelete={deleteRow}></GridDeleteRowButton>
                  <GridSaveButton onClick={() => { saveData(codeGrid) }}>{transLangKey("SAVE")}</GridSaveButton>
                </ButtonGroup>
              </RightButtonArea>
            </ButtonArea>
            <ResultArea>
              <BaseGrid id="codeGrid" items={codeGridItems} afterGridCreate={afterCodeGridCreate}></BaseGrid>
            </ResultArea>
          </VLayoutBox>
        </SplitPanel>
      </WorkArea>
    </ContentInner>
  );
}

export default CommonCode