## Inputs
**파일명:**  `Sample07.jsx`

**위젯 file path** :  `\packages\wingui\src\view\widgets\` 아래에 위치
**위젯 설정** : 설정>레이아웃>위젯

### 1. 대시보드 위젯 개요
DashboardPanel은 대시보드를 구성하는 주요 컴포넌트로, 여러 개의 위젯을 배치하고 사용자가 이를 통해 다양한 정보를 확인할 수 있게 해줍니다. 이 컴포넌트를 통해 대시보드의 레이아웃, 위젯의 크기와 위치, 그리고 대시보드의 동작을 제어할 수 있습니다.

대시보드는 여러 위젯을 배치하여 사용자에게 필요한 정보를 시각적으로 제공하는 UI 구성 요소입니다. 이 예제에서는 위젯 리스트를 JavaScript 객체 배열로 정의하여, 대시보드에 표시할 위젯들을 설정하고 있습니다.

### 2. `DashboardPanel` 속성 설명
#### 2.1 **actionBar**  
- **설명** : 대시보드의 상단에 액션 바(버튼이나 메뉴 같은 추가 동작을 위한 UI 요소)를 표시할지 여부를 결정합니다.
 
- **타입** : `boolean`
 
#### 2.2 **fitHeight**  
- **설명** : 대시보드의 높이를 자동으로 조정할지 여부를 결정합니다. `true`로 설정하면 대시보드가 내용에 맞게 높이를 자동으로 조정합니다.
 
- **타입** : `boolean`
 
- **예시** : `fitHeight={false}`는 고정된 높이를 유지함을 의미합니다.
#### 2.3 **isResizable**  
- **설명** : 사용자가 위젯의 크기를 조정할 수 있는지 여부를 결정합니다.
 
- **타입** : `boolean`
 
- **예시** : `isResizable={false}`는 사용자가 위젯 크기를 조정할 수 없음을 의미합니다.
#### 2.4 **isDraggable**  
- **설명** : 사용자가 위젯을 드래그하여 위치를 변경할 수 있는지 여부를 결정합니다.
 
- **타입** : `boolean`
 
- **예시** : `isDraggable={false}`는 사용자가 위젯을 드래그할 수 없음을 의미합니다.
#### 2.5 **title**  
- **설명** : 대시보드의 제목을 설정합니다. 빈 문자열로 설정하면 제목이 표시되지 않습니다.
 
- **타입** : `string`
 
- **예시** : `title={""}`는 제목이 없는 대시보드를 의미합니다.
#### 2.6 **option**  
- **설명** : 대시보드의 추가 옵션을 설정합니다. 예제에서는 `store`라는 옵션이 사용되고 있으며, 대시보드의 특정 설정이나 데이터 소스를 지정하는 데 사용될 수 있습니다.
 
- **타입** : `object`
 
- **예시** : `option={{ store: "PMG" }}`는 "PMG"라는 값을 `store` 옵션으로 전달합니다.
#### 2.7 **id**  
- **설명** : 대시보드의 고유 ID를 설정합니다. 이 ID는 대시보드를 식별하거나 관련 데이터를 불러오는 데 사용됩니다.
 
- **타입** : `string`
 
- **예시** : `id={"Executive_Dashboard"}`는 "Executive_Dashboard"라는 ID를 가진 대시보드를 의미합니다.
#### 2.8 **widgets**  
- **설명** : 대시보드에 표시될 위젯의 리스트를 설정합니다. 여기서는 `makeWidgetPanel()` 함수가 위젯 리스트를 생성하여 반환합니다.
 
- **타입** : `array`
 
- **예시** : `widgets={makeWidgetPanel()}`는 `makeWidgetPanel` 함수에서 생성된 위젯 리스트를 대시보드에 전달합니다.
#### 2.9 **OnGetWidgets**  
- **설명** : 위젯을 가져오거나 초기화할 때 호출되는 함수입니다. 대시보드가 초기화될 때 이 함수가 호출되어 위젯을 로드할 수 있습니다.
 
- **타입** : `function`
 
- **예시** : `OnGetWidgets={OnGetWidgets}`는 `OnGetWidgets` 함수를 대시보드에 전달합니다.


### 3. 위젯 리스트 구조
```javascript
let widgets = [
  {
    "key": "1",
    "title": transLangKey("TITEL01"),
    "widgetId": "WI_SAMPLE_01",
    "data-grid": {"w": 2, "h": 44, "x": 0, "y": 0},
    "showTitleBar": false,
  },
  // 다른 위젯들...
];
```
 - key: 위젯의 고유 식별자입니다. 이 값은 리스트 내에서 위젯을 구분하는 데 사용됩니다.

- title: 위젯의 제목을 나타냅니다. transLangKey 함수를 사용하여 다국어 지원을 할 수 있습니다.

- widgetId: 위젯의 고유 ID를 나타냅니다. 
- data-grid: 위젯의 레이아웃 위치와 크기를 정의하는 속성입니다. 대시보드 레이아웃 시스템(예: react-grid-layout)에서 사용됩니다.
```
- 가로 9 x 세로 16
- w: 위젯의 너비를 정의합니다.
- h: 위젯의 높이를 정의합니다.
- x: 위젯의 수평 위치(열)를 정의합니다.
- y: 위젯의 수직 위치(행)를 정의합니다.
```

- showTitleBar: 위젯의 제목 표시줄을 표시할지 여부를 결정합니다. true일 경우 제목 표시줄이 보이고, false일 경우 숨겨집니다.