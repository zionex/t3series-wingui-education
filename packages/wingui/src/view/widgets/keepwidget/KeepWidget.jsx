import React, { useState, useEffect } from "react";
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent'
import { ZEditor } from '@zionex/wingui-core/component/input/ZEditor'
import { useAutoSave } from "@zionex/wingui-core";

function KeepWidget(props) {

  const [value, setValue] = useState('');

  const saveToDB = (data) => {
    console.log("Save to DB", data)
  }

  useAutoSave({ data: value, onSave: saveToDB });

  const onChange = (val) => {
    setValue(val)
  }

  return (
    <WidgetContent >
      <div style={{ width: '100%', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', padding: '4px' }}>
        <ZEditor value={value} onChange={onChange} />
      </div>
    </WidgetContent>
  )
}

export default KeepWidget