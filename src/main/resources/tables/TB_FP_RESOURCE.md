### 개요
- 설비, 인력 등을 묘사하는 자원의 기초 정보를 정의합니다.

### 주의 사항
    자원을 삭제할 경우, Bor정보에 영향을 줍니다.

### 관련 화면
- 데이터 통합 > 생산 계획 > [자원](#/dataintegration/factoryplan/resource)

### 작업 테이블 정보
- #### TB_FP_RESOURCE


| 필수 | 물리명            | 논리명       | 형식     |    기본값    |
|:--:|:---------------|:----------|:-------|:---------:|
| O  | PLAN_SCOPE        | 계획 범위    | STRING | DEFAULT         |
| O  | RESOURCE_CD        | 자원 코드    | STRING |           |
|    | RESOURCE_NM | 자원 명칭     | STRING |           |
|    | STAGE_CD       | 스테이지 코드 | STRING |           |
|    | CALENDAR_CD        | 캘린더 코드    | STRING |           |
|    | DISPLAY_COLOR        | 표시 색상    | NUMBER | 1          |
|    | DISPLAY_SEQ        | 표시 순번    | STRING | 1         |
|    | LOAD_YN        | 자원 사용 여부    | STRING | Y          |
|    | TOOL_RESOURCE_YN        | 툴 자원 여부    | STRING | N          |
|    | TOOL_CNT        | 툴 개수    | NUMBER | 1          |
|    | FIFO_TP_CD        | FIFO 타입    | NUMBER |           |
|    | JC_TIME        | 기본 작업교체 시간    | NUMBER | 0          |
|    | ROUTE_JC_TIME        | 공정 작업교체 시간    | STRING | 0       |
|    | ROUTE_GRP_JC_TIME        | 공정 그룹 작업교체 시간    | STRING | 0        |
|    | JC_DIVIDE_TP_CD        | 작업교체 분할 타입    | STRING | Y          |
|    | TIME_UOM        | 시간 측정 단위    | STRING |           |
|    | VIRTUAL_RESOURCE_CNT        | 가상 자원 개수    | STRING | 1         |
|    | BATCH_RESOURCE_YN        | 배치 자원 여부    | STRING | N         |
|    | PLAN_LVL_TP_CD        | 계획 반영 수준    | STRING | A     |
|    | DESC_TXT        | 부연 설명    | STRING |           |

#### RESOURCE_CD
> 자원 코드

#### RESOURCE_NM
> 자원 명칭

#### STAGE_CD
> 스테이지 코드  
> `TB_FP_STAGE` 테이블의 `STAGE_CD`

#### CALENDAR_CD
> 캘린더 코드  
> `TB_FP_CALENDAR_MST` 테이블의 `CALENDAR_CD`

#### DISPLAY_COLOR
> UI상에 표시할 Calendar 색상

#### DISPLAY_SEQ
> UI상에 표시할 자원의 순서

#### LOAD_YN
> 계획에 반영 하여 사용할 자원 여부

#### TOOL_RESOURCE_YN
> 툴 자원 여부

#### TOOL_CNT
> 툴 자원인 경우 툴의 개수

#### FIFO_TP_CD `OBP`
> FIFO (First In First Out : 앞선 작업 보다 먼저 작업 할 수 없다.) 타입 코드
> - FIFO_NONE : 적용 하지 않음
> - FIFO_ALL : 앞선 모든 작업에 대해 적용
> - FIFO_ITEM :  앞선 작업 중 품목이 동일한 작업에 대해 적용
> - FIFO_ITEMGROUP : 앞선 작업 중 품목 그룹이 동일한 작업에 대해 적용
> - FIFO_ITEM_ROUTE : 앞선 작업 중 품목 공정이 동일한 작업에 대해 적용
> - FIFO_WORKORDER_ITEM : 앞선 작업 중 작업 주문의 품목이 같은 작업에 대해 적용

#### JC_TIME
> 기본 작업교체 시간

#### ROUTE_JC_TIME
> 공정이 다른 경우 전체적으로 적용 하는 작업교체 시간

#### ROUTE_GRP_JC_TIME
> 공정 그룹이 다른 경우 전체적으로 적용 하는 작업교체 시간

#### JC_DIVIDE_TP_CD
> 작업교체(Job Change)를 휴일 구간에 Overlapping 할 것인지 여부 결정
> - Y : 휴일 구간 전후로 연속 작업 (휴일 구간을 점유는 하지만 작업 상태는 아님)
> - N :  휴일 구간 작업 불가
> - I : 휴일 구간에서 종료만 가능
> > I Type은 휴일 시작 시간과 동시에 작업을 시작할 수 있음

#### TIME_UOM
> Time-Bucket 시간 단위
> - SECOND
> - MINUTE
> - HOUR
> - DAY
> - WEEK
> - MONTH

#### VIRTUAL_RESOURCE_CNT `OBP`

#### BATCH_RESOURCE_YN `EBP`

#### PLAN_LVL_TP_CD `EBP`
> - A : 모든 제약 반영
> - B : Capacity와 Calednar 반영
> - C : Capacity는 사용하지 않고 Lead Time만 고려

#### DESC_TXT
> 부연 설명
