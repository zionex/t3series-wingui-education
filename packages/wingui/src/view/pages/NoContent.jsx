import React, { useEffect } from "react";
import { transLangKey } from "@zionex/wingui-core/lang/i18n-func";

function NoContent() {
  useEffect(() => {
  }, []);
  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="row justify-content-md-center">
        <div className="col-md-auto" >
          <Icon.AlertOctagon size={36} className="text-center" />
        </div>
      </div>
      <div className="row justify-content-md-center">
        <div className="col-md-auto" >
          <h3>{transLangKey('MSG_NO_CONTENT')}</h3>
        </div>
      </div>
    </div>
  )
}

export default NoContent;