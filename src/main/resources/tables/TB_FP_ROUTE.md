### 개요
- 공정(Route)의 정보를 정의합니다.

### 주의 사항
    삭제시 Bom과 Bor 정보에 영향을 미치게 됩니다.

### 관련 화면
- 데이터 통합 > 생산 계획 > [공정](#/dataintegration/factoryplan/route)

### 작업 테이블 정보
- #### TB_FP_ROUTE


| 필수 | 물리명            | 논리명       | 형식     |    기본값    |
|:--:|:---------------|:----------|:-------|:---------:|
| O  | PLAN_SCOPE        | 계획 범위    | STRING | DEFAULT   |
| O  | ROUTE_CD        | 공정 코드    | STRING |           |
|    | ROUTE_NM | 공정 명칭     | STRING |           |
|    | ROUTE_GRP_CD       | 공정 그룹 코드 | STRING |           |
|    | STAGE_CD        | 스테이지 코드    | STRING |           |
|    | CANDIDATE_PERIOD_CNT        | 후보 기간 개수    | NUMBER | 1   |
|    | DIVIDE_TP_CD        | 작업 분할 타입    | STRING | Y         |
|    | BATCH_ROUTE_YN        | 배치 공정 여부    | STRING | N       |
|    | LAZY_JC_TIME_YN        | 이전 공정 작업 종료 시점 JC Time 적용 여부    | STRING | N        |
|    | LOT_SIZE_MIN        | 최소 로트 크기    | NUMBER |           |
|    | LOT_SIZE_MAX        | 최대 로트 크기    | NUMBER |           |
|    | LOT_SIZE_MULTIPLR        | 배수 로트 크기    | NUMBER |           |
|    | DESC_TXT        | 부연 설명    | STRING |           |

#### ROUTE_CD
> 공정 코드

#### ROUTE_NM
> 공정 명칭

#### ROUTE_GRP_CD
> 공정 그룹 코드  
> `TB_FP_ROUTE_GRP` 테이블의 `ROUTE_GRP_CD`

#### STAGE_CD
> 스테이지 코드  
> `TB_FP_STAGE` 테이블의 `STAGE_CD`

#### CANDIDATE_PERIOD_CNT `OBP`
> 작업(Activity)이 위치할 수 있는 후보지의 개수
> - Time-phased BOR, Produce Preference, Activity Selection 등에 사용

#### DIVIDE_TP_CD
> 작업(Activity)를 휴일 구간에 Overlapping 할 것인지 여부 결정
> - Y : 휴일 구간 전후로 연속 작업 (휴일 구간을 점유는 하지만 작업 상태는 아님)
> - N :  휴일 구간 작업 불가
> - I : 휴일 구간에서 종료만 가능
> > I Type은 휴일 시작 시간과 동시에 작업을 시작할 수 있음

#### BATCH_ROUTE_YN
> 배치 공정 여부  
> 배치 자원 적용 시 사용

#### LAZY_JC_TIME_YN
> 이전 공정 작업 종료 시점부터 Job Change Time 적영 여부
> 
> #### LOT_SIZE_MIN
> 최소 로트 크기
> 
> #### LOT_SIZE_MAX
> 최대 로트 크기
> 
> #### LOT_SIZE_MULTIPLR
> 배수 로트 크기

#### DISPLAY_COLOR
> UI 상에 표시할 Calendar 색상

#### DESC_TXT
> 부연 설명
