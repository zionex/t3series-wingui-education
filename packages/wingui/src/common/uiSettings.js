
import { getISOWeekNumber } from './common'

export const uiSettings = {
  mode: '',
  defaultMenuType: 'floatMenu',// ['sideBarMenu','topMenu','floatMenu']
  useMenuBar: true, //Menu Type setup
  titlePrefix: '', //브라우저 document.title prefix
  layout: {
    searchArea: 'top' //검색조건 창 위치['top','left']
  },
  appBar: {
    type: 'simple', //or ''
    useLargeMenuCombo: false, //대메뉴가 보이는 메뉴 드롭다운
    useSiteMapTree: false, //사이트 맵(전체메뉴) 트리 보기
    useBookMarkButton: true,
    useHistoryButton: true,
    useSearchMenu: true,
    useIssueButton: false,
    useWorkFlowButton: false
  },
  document: {
    userManualPath: 'docs/manual'
  },
  component: {
    button: 'icon',
    input: 'floating', //['label','floating']
    validationType: 'tooltip', // ['text', 'tooltip']
    datetime: {
      showWeek: true,
      weekStartsOn: 0, // 0:일, 1:월, 2:화, 3:수, 4:목, 5:금, 6:토
      getWeekNumber: (currentDate) => {
        return getISOWeekNumber(currentDate)
      }
    }
  },
  contextMenu: {
    excelExportSettings: {
      // type: "excel",
      // useTypePopup: true
    }
  },
  useUserViewHistory: false,
  axiosTimeout: 3600000
};