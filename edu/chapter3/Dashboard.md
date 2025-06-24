## Dashboard

**파일명:**  `Sample07.jsx`

**위젯 file path** :  `\packages\wingui\src\view\widgets\` 아래에 위치
**위젯 설정** : 설정 > 레이아웃 > 위젯

### 1. 대시보드 위젯 개요

DashboardPanel은 대시보드를 구성하는 주요 컴포넌트로, 여러 개의 위젯을 배치하고 사용자가 이를 통해 다양한 정보를 확인할 수 있게 해줍니다. 이 컴포넌트를 통해 대시보드의 레이아웃, 위젯의 크기와 위치, 그리고 대시보드의 동작을 제어할 수 있습니다.

대시보드는 여러 위젯을 배치하여 사용자에게 필요한 정보를 시각적으로 제공하는 UI 구성 요소입니다. 이 예제에서는 위젯 리스트를 JavaScript 객체 배열로 정의하여, 대시보드에 표시할 위젯들을 설정하고 있습니다. 설정 > 레이아웃 > 위젯 메뉴에서 등록된 위젯을 사용하고 widgetId 로 호출합니다. 위젯은 여러 컴포넌트에서 재사용 가능합니다. 위젯은 옵션에 따라서 Drag, Resize 가 가능합니다.

### 2. `DashboardPanel` 속성 설명

```javascript
<DashboardPanel
  actionBar={true}
  fitHeight={true}
  isResizable={true}
  isDraggable={true}
  title={""}
  widgets={makeWidgetPanel()}
  OnGetWidgets={OnGetWidgets}
/>
```

#### 2.1 **actionBar**

* **설명**: 대시보드 상단에 액션 바(버튼, 메뉴 등)를 표시할지 여부
* **타입**: `boolean`

#### 2.2 **fitHeight**

* **설명**: 대시보드 높이를 내용에 맞게 자동 조정할지 여부
* **타입**: `boolean`

#### 2.3 **isResizable**

* **설명**: 사용자가 위젯 크기를 조정할 수 있는지 여부
* **타입**: `boolean`

#### 2.4 **isDraggable**

* **설명**: 사용자가 위젯을 드래그해 위치를 변경할 수 있는지 여부
* **타입**: `boolean`

#### 2.5 **title**

* **설명**: 대시보드 제목 설정. 빈 문자열이면 제목 비표시
* **타입**: `string`

#### 2.6 **widgets**

* **설명**: 대시보드에 표시할 위젯 리스트를 설정. 함수 또는 배열 전달 가능
* **타입**: `array`

#### 2.7 **OnGetWidgets**

* **설명**: 초기 위젯 데이터를 불러올 때 호출되는 함수
* **타입**: `function`

### 3. 위젯 리스트 구조

위젯 리스트는 대시보드에 표시할 위젯들의 정보를 담은 JavaScript 객체 배열로 정의됩니다.

```javascript
let widgets = [
  {
    key: "1",
    title: "TITEL01",
    widgetId: "WI_SAMPLE_01",
    "data-grid": { w: 2, h: 44, x: 0, y: 0 },
    showTitleBar: false,
    useMaximize: true,
    useFullscreen: false,
    linkUrl: getViewPath("MENU_SAMPLE"),
    info: "이 위젯은 샘플 데이터를 표시합니다.",
  },
  // 다른 위젯들...
];
```

#### 항목별 설명

* **key**: 위젯의 고유 식별자입니다. 리스트 내 위젯 구분에 사용됩니다.
* **title**: 다국어 지원되는 위젯 제목입니다.
* **widgetId**: 렌더링할 위젯 컴포넌트의 고유 ID입니다.
* **data-grid**: react-grid-layout에서 사용하는 레이아웃 속성입니다.

  ```
  - w: 위젯의 너비 (단위: 칸 수)
  - h: 위젯의 높이 (단위: 칸 수)
  - x: 수평 위치 (좌측 기준)
  - y: 수직 위치 (상단 기준)
  ```
* **showTitleBar** (default: `true`): 제목 표시 여부입니다.
* **useMaximize** (default: `true`): 최대화 버튼 표시 여부입니다.
* **useFullscreen** (default: `true`): 전체화면 버튼 표시 여부입니다.
* **linkUrl**: 해당 위젯 클릭 시 연결할 내부 메뉴 경로입니다.
* **info**: 위젯 설명 툴팁입니다. `<br/>` 등의 HTML 태그 사용 가능
