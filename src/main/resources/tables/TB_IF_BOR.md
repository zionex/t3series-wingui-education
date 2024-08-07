### 개요
    생산 거점의 BOR (Bill of resources) 정보를 등록합니다.
    `TB_IF_BOR` 테이블에 저장 시 품목기준 자원 우선순위, 품목기준 자원 생산능력 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다.

### 관련 화면
- 데이터 통합 > 공급계획 > [품목기준 자원 우선순위](#/dataintegration/masterplan/itemrespreference)
- 데이터 통합 > 공급계획 > [품목기준 자원 생산능력](#/dataintegration/masterplan/itemrescapacity)

### 작업 테이블 정보

- #### TB_IF_BOR

| 필수 | 물리명             | 논리명             | 형식      | 기본값        | 
|:--:|:----------------|:----------------|:--------|:-------------:|
| O  | LOCAT_CD        | 거점 코드           | STRING  |               |
| O  | ITEM_CD         | 품목 코드           | STRING  |               |
|    | ROUTE_CD        | 공정 코드           | STRING  |               |
| O  | RES_CD          | 자원 코드           | STRING  |               |
|    | ALLOC_RULE_CD   | 할당 규칙           | STRING  |               |
|    | ALLOC_VAL       | 할당 값 (우선순위, 비율) | NUMBER  |               |
| O  | TACT_TIME       | Tact Time       | NUMBER  |               |
| O  | TACT_TIME_UOM   | 시간단위            | STRING  |               |
|    | QUEUE_TIME      | 전 대기 시간         | NUMBER  |               |
|    | SETUP_TIME      | 셋업 시간           | NUMBER  |               |
|    | PROCESS_TIME    | 작업 시간           | NUMBER  |               |
|    | WAIT_TIME       | 후 대기 시간         | NUMBER  |               |
|    | MOVE_TIME       | 이동 시간           | NUMBER  |               |
|    | CYCL_TIME_UOM   | 시간 단위           | STRING  |               |
|    | MIN_LOTSIZE     | 최소 로트 크기        | NUMBER  |               |
|    | MAX_LOTSIZE     | 최대 로트 크기        | NUMBER  |               |
|    | OVR_MIN_LOTSIZE | 추가 최소 로트 크기     | NUMBER  |               |
|    | MULTP_LOTSIZE   | 로트 배수 크기        | NUMBER  |               |
|    | CREATE_BY       | 생성자             | USER_ID |               |
|    | CREATE_DTTM     | 생성일시            | NOW     |               |
|    | MODIFY_BY       | 수정자             | USER_ID |               |
|    | MODIFY_DTTM     | 수정일시            | NOW     |               |


#### LOCAT_CD
> 거점 코드  
> `거점` 화면의 `거점 코드`로 입력합니다.  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### ITEM_CD
> 품목 코드  
> `품목` 화면의 `품목 코드`로 입력합니다.  
> SELECT ITEM_CD FROM TB_CM_ITEM_MST

#### ROUTE_CD
> 공정 코드  
> `공정` 화면의 `공정 코드`로 입력합니다.  
> SELECT ROUTE_CD FROM TB_MP_ROUTE

#### RES_CD
> 자원 코드  
> `자원` 화면의 `자원 코드`로 입력합니다.  
> SELECT RES_CD FROM TB_MP_RES_MGMT_DTL

#### ALLOC_RULE_CD
> 할당 규칙 - 대체 자원 정책을 입력합니다.  
> `FAST` | `MIN_JCT` | `PRIORITY` | `PROPORTION`  
> SELECT A.COMN_CD FROM TB_AD_COMN_CODE A, TB_AD_COMN_GRP B WHERE B.ID = A.SRC_ID AND B.GRP_CD = 'BASE_ALLOC_RULE'

#### ALLOC_VAL
> 할당 값  
> ALLOC_RULE_CD이 `FAST`이면 필요 시 우선순위 값을 입력합니다.  
> ALLOC_RULE_CD이 `PRIORITY`이면 우선순위 값을 입력합니다.  
> ALLOC_RULE_CD이 `PROPORTION`이면 비율 값을 입력합니다.

#### TACT_TIME
> Tact time

#### TACT_TIME_UOM
> Tact time 시간 단위  
> `SECOND` | `MINUTE` | `HOUR` | `DAY` | `WEEK`  
> SELECT UOM_CD FROM TB_CM_UOM WHERE BASE_PLAN_UOM_YN = 'Y'

#### QUEUE_TIME
> 전 대기 시간

#### SETUP_TIME
> 셋업 시간

#### PROCESS_TIME
> 작업 시간

#### WAIT_TIME
> 후 대기 시간

#### MOVE_TIME
> 이동 시간

#### CYCL_TIME_UOM
> 시간 단위  
> `SECOND` | `MINUTE` | `HOUR` | `DAY` | `WEEK`  
> SELECT UOM_CD FROM TB_CM_UOM WHERE BASE_PLAN_UOM_YN = 'Y'

#### MIN_LOTSIZE
> 최소 로트 크기

#### MAX_LOTSIZE
> 최대 로트 크기

#### OVR_MIN_LOTSIZE
> 추가 최소 로트 크기

#### MULTP_LOTSIZE
> 로트 배수 크기

#### CREATE_BY
> 생성자

#### CREATE_DTTM
> 생성일

#### MODIFY_BY
> 수정자

#### MODIFY_DTTM
> 수정일시


### 연관 테이블

- TB_MP_ITEM_RES_PREFER_MST : 품목기준 자원 우선순위
- TB_MP_ITEM_RES_CAPA_MST : 품목기준 자원 생산능력