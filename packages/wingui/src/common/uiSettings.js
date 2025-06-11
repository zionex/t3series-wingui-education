
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
    useLargeMenuDropdown: false, //대메뉴가 보이는 메뉴 드롭다운
    useSiteMapTree: true, //사이트 맵(전체메뉴) 트리 보기
    useBookMarkButton: true,
    useHistoryButton: true,
    useSearchMenu: true,
    useIssueButton: true,
    useWorkFlowButton: true
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
    }
  },
  excelExportSettings: {
    lookupDisplay: true,
    // count: 10000
  },
  useUserViewHistory: false,
  axiosTimeout: 3600000
};