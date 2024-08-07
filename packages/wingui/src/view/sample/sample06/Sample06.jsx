import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ContentInner, InputField, SearchArea, SearchRow, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, CommonButton,
  useViewStore, useContentStore
} from '@wingui/common/imports';
import MultiColumnListPopover from "@zionex/wingui-core/component/input/MultiColumnListPopover";
import { IconButton,Chip,Avatar,Box } from "@mui/material";
import { onErrorInput } from "@zionex/wingui-core/utils/common";
import { WorkArea } from "@zionex/wingui-core";

const colDef = [
  { name: 'value', headerText: 'CODE', minWidth: 170, visible: false },
  { name: 'label', headerText: 'NAME', minWidth: 100 },
  { name: 'test1', headerText: 'TEST', minWidth: 100, visible: false },
];

const colDef2 = [
  { name: 'high', headerText: '대', minWidth: 50 },
  { name: 'medium', headerText: '중', minWidth: 50 },
  { name: 'low', headerText: '소', minWidth: 50 },
];

function createData(label, value) {
  return { label, value };
}

const rows = [
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767),
];

const rows2 = [
  { high: 'aaa', medium: 'aa', low: 'aa' },
  { high: 'bbb', medium: 'bb', low: 'b' },
  { high: 'ccc', medium: 'cc', low: 'c' },
]


function Sample06() {
  const [activeViewId] = useContentStore((state) => [state.activeViewId]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [options1, setOptions1] = useState([
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    { label: 'Option 4', value: 'option4' },
    { label: 'Option 5', value: 'option5', class: 'rg-cal-week-sun' }
  ]);

  const { control, getValues, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      pnumber: 1234,
      paction:'ACTION BUTTON',
      nolabelInput: 'NO LABEL INPUT',
      pselect: 'option1',
      pautocomplete: 'option2',
      pmultiSelect: ['option1', 'option2'],
      pdateRange: [new Date(), new Date(new Date().setMonth(new Date().getMonth() + 4))],
      select2: 'option4',
    }
  })
  const globalButtons = [
    { name: "search", action: (e) => { handleSubmit(onSubmit, onErrorInput)() }, visible: true, disable: false }
  ]

  useEffect(() => {
    //만약 value 로 'Russia'를 입력할 경우 inputKey는 label
    // setValue('popoverInput', 'Russia');

    //IT 라는 value의 매핑 key는 value 
    setValue('popoverInput', 'IT');
    //b 라는 value의 매핑 key는 low
    setValue('popoverInput2', 'b');

    setViewInfo(activeViewId, 'globalButtons', globalButtons)
  }, [])

  function onSubmit() {
    console.log(getValues())
  }


  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField name="ptext" label={transLangKey("TEXT")} control={control} type='text' value='' validationText={"TEST"}  rules={{ required: transLangKey("MSG_0006") }} />
          <InputField name="pnumber" label={transLangKey("NUMBER")} control={control} dataType='number' type='text' value={23} startAdornment={"$"} />
          <InputField name="paction" label={transLangKey("Action")} control={control} type='action'><Icon.Search /></InputField>
          <InputField name="nolabelInput" control={control} height={"35px"} ></InputField>
          <InputField name="ptext2" label={"Disabled"} control={control} disabled={true} value='Disabled' />
          <InputField name="ptext3" label={"Read Only"} control={control} readonly={true} value='Readonly' />
        </SearchRow>
        <SearchRow>
          <InputField type="select" name="pselect" label={transLangKey("SELECT")} control={control} inputStyle={{ width: '200px' }} options={options1} value={'option1'} />
          <InputField type="autocomplete" name="pautocomplete" label={transLangKey("AutoComplete")} control={control} options={options1}  />
          <InputField type="multiSelect" name="pmultiSelect" label={transLangKey("multiSelect")} control={control} options={options1} />
        </SearchRow>
        <SearchRow>
          <InputField name="pdate" label={"주차 표시"} value={new Date()} control={control} type='datetime' dateformat="yyyy-MM-dd ww"/>
          <InputField name="pdatetime" label={"DATETIME"} value={new Date()} control={control} type='datetime' showTimeSelect={true} />
          <InputField name="pdateRange" label={["FROM", "TO"]} control={control} type='dateRange' dateformat='yyyy-MM-dd'/>
          <InputField name="pselectMonth" label={transLangKey("selectMonth")} value={new Date()} control={control} type='datetime' openTo='month' />
          <InputField name="pselectYear" label={transLangKey("selectYear")} value={new Date()} control={control} type='datetime' openTo='year' />
          <InputField name="ptime" label={transLangKey("Time")} control={control} showWeekNumbers type='time' />
        </SearchRow>
        <SearchRow>
          <InputField name="pcheck" label={"check box"} value={['A', 'B']} control={control} type="check" options={[{ label: 'D', value: 'D', }, { label: 'F', value: 'F', }, { label: 'G', value: 'G', }, { label: 'E', value: 'E', }, { label: 'A', value: 'A', }]}/>
          <InputField name="pcheck2" label={"check box"} value={['C', 'D']} control={control}  width={'500px'}  type="check" options={[{ label: 'D', value: 'D', }, { label: 'F', value: 'F', }, { label: 'G', value: 'G', }, { label: 'E', value: 'E', }, { label: 'A', value: 'A', }]}/>
          <InputField name="pradio" label={"radio"} control={control} type="radio" options={[{ label: transLangKey("ACTV_YN"), value: 'Y', }, { label: transLangKey("테스트1"), value: 'test1', }, { label: transLangKey("테스트2"), value: 'test2', }, { label: transLangKey("테스트3"), value: 'test3', }]}/>
        </SearchRow>
        <SearchRow>
          <InputField name="popoverInput" label={transLangKey("Custom Input")} control={control} type="popover" displayText="[value] label" inputKey="value"
            options={rows}
            childComponent={
              <MultiColumnListPopover items={colDef} />
            }
          />
          <InputField name="popoverInput2" label={"Custom Input2"} control={control} type="popover" displayText="low" inputKey="low"
            options={rows2}
            childComponent={
              <MultiColumnListPopover items={colDef2} />
            }
          />
        </SearchRow>
        <SearchRow>
          <InputField inputType="labelText" variant="standard" name="labeltext" label={transLangKey("name")} useLabel={false} labelStyle={{ backgroundColor: "#ffffff" }} control={control} ></InputField>
          <InputField inputType="labelText" variant="standard" type="datetime" name="date2" label={transLangKey("datime")} useLabel={false} labelStyle={{ backgroundColor: "#ffffff" }} control={control} ></InputField>
          <InputField inputType="labelText" variant="standard" type="select" name="select2"  label={transLangKey("SELECT")} useLabel={false} control={control} inputStyle={{ width: '200px' }} options={options1} value={'option4'} />
          <InputField inputType="labelText" variant="standard" type="radio" name="pradio2" label={transLangKey("라디오")} useLabel={false} control={control} width='400px' labelStyle={{ backgroundColor: "#ffffff" }} options={options1}/>
        </SearchRow>
      </SearchArea>
      <WorkArea>
        <ButtonArea>
          <LeftButtonArea>
          </LeftButtonArea>
          <RightButtonArea>
          </RightButtonArea>
        </ButtonArea>
      </WorkArea>
    </ContentInner>
  );
}


export default Sample06
