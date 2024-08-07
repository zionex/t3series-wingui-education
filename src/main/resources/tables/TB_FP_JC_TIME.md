### 개요
    자원에서 공정그룹 전환시 발생하는 작업변경 시간을 정의합니다.

### 주의 사항
    `PREV_JC_TIME`, `NEXT_JC_TIME`는 필요에 따라 둘 중 하나에 넣어도되고 둘 다 넣어도되고 됩니다. 

### 관련 화면
- 데이터 통합 > 생산 계획 > [공정간 작업 교체](#/dataintegration/factoryplan/jobchangetime)

### 작업 테이블 정보
- #### TB_FP_JC_TIME


| 필수 | 물리명            | 논리명       | 형식     |    기본값    |
|:--:|:---------------|:----------|:-------|:---------:|
| O  | PLAN_SCOPE        | 계획 범위    | STRING | DEFAULT    |
| O  | RESOURCE_CD        | 자원 코드   | STRING |           |
| O  | PREV_ROUTE_CD | 작업 공정 코드  | STRING |           |
| O  | NEXT_ROUTE_CD       | 후 공정 코드 | STRING |           |
|    | PREV_JC_TIME        | 전 작업의 교체 시간  | NUMBER | 0          |
|    | NEXT_JC_TIME        | 후 작업의 교체 시간  | NUMBER | 0      |
|    | TIME_UOM        | 시간 측정 단위 | STRING |           |
| O  | JC_DIVIDE_TP_CD        | 작업교체 분할 타입  | STRING | Y        |

#### RESOURCE_CD
> 자원 코드  
> `TB_FP_RESOURCE` 테이블의 `RESOURCE_CD`

#### PREV_ROUTE_CD
> 작업 공정 코드  
> `TB_FP_ROUTE` 테이블의 `ROUTE_CD`

#### NEXT_ROUTE_CD
> 후 공정 코드  
> `TB_FP_ROUTE` 테이블의 `ROUTE_CD`

#### PREV_JC_TIME
> 전 작업(Activity)의 뒷쪽에 붙는 작업교체 시간 

#### NEXT_JC_TIME
> 후 작업(Activity)의 앞쪽에 붙는 작업교체 시간

#### TIME_UOM
> Time-Bucket 시간 단위
> - SECOND
> - MINUTE
> - HOUR
> - DAY
> - WEEK
> - MONTH

#### JC_DIVIDE_TP_CD
> 작업교체(Job Change)를 휴일 구간에 Overlapping 할 것인지 여부 결정
> - Y : 휴일 구간 전후로 연속 작업 (휴일 구간을 점유는 하지만 작업 상태는 아님)
> - N :  휴일 구간 작업 불가
> - I : 휴일 구간에서 종료만 가능
> > I Type은 휴일 시작 시간과 동시에 작업을 시작할 수 있음
