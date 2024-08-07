import React, { useEffect } from "react";
import { useContentStore, zAxios } from "@zionex/wingui-core";

export function setSessionLang(languageCode) {
  let langCd = localStorage.getItem('languageCode');
  if (languageCode)
    langCd = languageCode

  if (langCd) {
    zAxios.get(baseURI() + 'util/setlang',
      {
        params: {
          'languageCode': langCd
        },
        waitOn: false
      }
    ).then(function (response) {
      if (response.status === HTTP_STATUS.SUCCESS) {
      }
    }).catch(function (error) {
      console.log(error);
    })
  }
}
export default function LanguageRector({ languageCode, isLogin }) {
  // const languageCode = useContentStore(s=> s.languageCode)
  useEffect(() => {
    //언어 변경할 때마다 세션에 저장해둔다.
    if (isLogin)
      setSessionLang(languageCode)
  }, [languageCode])

  return <></>
}