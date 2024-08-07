### 개요
- FP Demand 정보를 정의합니다.

### 주의 사항
    생산 수요가 없으면 FP Server는 계획을 수립 할 주문이 없기 때문에 삭제시 계획 수립을 하지 않습니다.
    Work Order가 있다면 없어도 됩니다.

### 관련 화면
- 데이터 통합 > 생산 계획 > [주문 - 판매 주문 탭](#/dataintegration/factoryplan/order)

### 작업 테이블 정보
- #### TB_FP_DEMAND


| 필수 | 물리명            | 논리명       | 형식     |    기본값    |
|:--:|:---------------|:----------|:-------|:---------:|
| O  | PLAN_SCOPE        | 계획 범위    | STRING |  DEFAULT         |
| O  | DMND_CD        | 생산 수요 코드    | STRING |           |
|    | CUSTOMER_CD | 고객 코드     | STRING |           |
|    | INVENTORY_CD       | 인벤토리 코드 | STRING |           |
|    | GRP_PRIORITY        | 그룹 우선 순위    | NUMBER | 1          |
|    | DMND_GRP_CD        | 생산 수요 그룹 코드    | STRING |           |
|    | REQUEST_QTY        | 주문 수량    | NUMBER | 0          |
|    | DUE_DATE        | 납기 일자    | DATE |           |
|    | DUE_DATE_FENCE        | 납기 지연 허용 구간    | DATE |           |
|    | PST        | 시작 가능 일시    | DATE |           |
|    | PRIORITY        | 우선 순위    | NUMBER |  1         |
|    | EFFICIENCY        | 효율    | NUMBER |  1         |
|    | DISPLAY_COLOR        | 표시 색상    | STRING | 1          |
|    | ACTIVE_YN        | 계획 사용 여부    | STRING | Y          |
|    | DELIVERY_POLICY        | 분할 배송 타입    | STRING |           |
|    | ORDER_STRATEGY_TP_CD        | 계획 정책   | STRING |           |
|    | NECK_POLICY        | 병목 공정 결정 정책    | STRING |           |
|    | NECK_CNT        | 병목 공정 결정 개수   | NUMBER | -1          |
|    | NECK_PERIOD        | 병목 공정 결정 구간    | NUMBER |           |
|    | TIME_UOM        | 시간 측정 단위    | STRING |           |
|    | GRADE        | 등급    | STRING |           |
|    | ORDER_TP_CD        | 주문 타입 코드    | STRING |           |
|    | CANC_ON_LATE_YN        | 지연시 취소 여부    | STRING |           |
|    | CANC_ON_SHTG_YN        | 결품시 취소 여부    | STRING | Y          |
|    | ALLOW_NEW_WO_YN        | 미지원    | STRING | Y          |
|    | DESC_TXT        | 부연 설명    | STRING |           |

#### DMND_CD
> FP Demand 코드

#### CUSTOMER_CD
> 고객 코드
> `TB_FP_CUSTOMER` 테이블의 `CUSTOMER_CD`

#### INVENTORY_CD
> 인벤토리 코드
> `TB_FP_INVENTORY` 테이블의 `INVENTORY_CD`

#### GRP_PRIORITY `EBP`
> FP Demand 그룹 우선순위

#### SO_GRP_CD
> FP Demand 그룹 코드

#### REQUEST_QTY
> 주문 수량

#### DUE_DATE
> 납기일

#### DUE_DATE_FENCE
> 납기 지연 허용 구간

#### PST
> 시작 가능 일시

#### PRIORITY
> 우선 순위

#### EFFICIENCY
> 효율 (파생 되는 작업 주문의 효율로 적용 됨)

#### DISPLAY_COLOR
> UI 상에 표시할 색상

#### ACTIVE_YN
> 계획 반영 여부 (Y/N)

#### DELIVERY_POLICY `OBP`
> 분할 배송 (Partial Delivery) 적용 여부
> - M : Finite Material Partial Delivery
> - D : Due Date Partial Delivery
> - B : Both (Finite Material/Due Date) Partial Delivery

#### ORDER_STRATEGY_TP_CD `OBP`
> 전체 계획 정책과 별도로, 주문 별로 계획 정책을 가져 가고자 할 때 사용
> - FORWARD
> - BACKWARD

#### NECK_POLICY `OBP`
> 병목공정을 결정하는 방법 지정
> - BOTTLENECK_FINDER_PROCESS_TIME
> - BOTTLENECK_FINDER_DELAY_TIME
> - BOTTLENECK_FINDER_PROCESS_TIME_DELAY_TIME
> - BOTTLENECK_FINDER_PROCESS_TIME_IN_PERIOD

#### NECK_CNT `OBP`
> 결정하고자 하는 병목 공정의 개수 지정 (지정하지 않으면 찾을 수 있는 만큼 찾음)

#### NECK_PERIOD `OBP`
> NECK_POLICY를 BOTTLENECK_FINDER_PROCESS_TIME_IN_PERIOD로 지정 했을 때, 시간 구간 지정

#### TIME_UOM
> Time-Bucket 시간 단위
> - SECOND
> - MINUTE
> - HOUR
> - DAY
> - WEEK
> - MONTH

#### GRADE
> 등급

#### ORDER_TP_CD `OBP`
> 주문 타입 코드
> `TB_FP_ORDER_TYPE` 테이블의 `ORDER_TP_CD`

#### CANC_ON_LATE_YN `OBP`
> 지연(Late)시 취소 여부  (Y/N/'')

#### CANC_ON_SHTG_YN `OBP`
> 결품(Shortage)시 취소 여부 (Y/N/'')

#### ALLOW_NEW_WO_YN
> 삭제된 기능

#### DESC_TXT
> 부연 설명
