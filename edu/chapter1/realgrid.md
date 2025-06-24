
## RealGrid

### 개요
국산 고성능 그리드 라이브러리인 **RealGrid**는 현재 우리 솔루션의 화면 내 핵심 기능을 담당하고 있으며, 대량 데이터 처리와 복잡한 사용자 요구 사항을 만족시키기 위해 사용되고 있다.

### 공식 지원

- 대부분의 기능은 공식 문서에 상세하게 설명되어 있어, 개발자들이 자주 참고하며 실무에 적용하고 있습니다.
  👉 [공식 문서 바로가기](https://docs.realgrid.com/)

- 기능 관련 문의나 이슈 발생 시, 고객지원 사이트를 통해 문의 시 평균적으로 **2시간 이내에 빠른 응답**을 받을 수 있어 업무 지연이 거의 없습니다.
  👉 [고객지원 티켓 시스템](https://support.realgrid.com/tickets)

### 예시

```javascript
import RealGrid from "realgrid";

const ds = new RealGrid.LocalDataProvider();
const gridView = new RealGrid.GridView("realgrid-container");
gridView.setDataSource(ds);

ds.setFields([
    { fieldName: "id", dataType: "number" },
    { fieldName: "name", dataType: "text" },
    { fieldName: "age", dataType: "number" }
]);

ds.setRows([
    { id: 1, name: "John Doe", age: 30 },
    { id: 2, name: "Jane Smith", age: 25 }
]);

gridView.setColumns([
    { name: "id", fieldName: "id", type: "data" },
    { name: "name", fieldName: "name", type: "data" },
    { name: "age", fieldName: "age", type: "data" }
]);
```