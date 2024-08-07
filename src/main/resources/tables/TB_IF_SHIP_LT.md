### 개요
    출하 L/T 정보를 인터페이스 하여 IM/RP/MP 거점 BOD 정보를 일괄로 등록합니다.
    다음 단계인 `거점 BOD` 진행 시 출하 L/T 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    이 데이터를 생성하기 전에 반드시 일반 설정 화면의 `BOD 리드타임 구간`을 먼저 설정하셔야 합니다. 
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다.

### 관련 화면
- 데이터 통합 > 공급망 네트워크 > 일반 설정 > [일반 설정](#/dataintegration/network/generalconfig)
- 데이터 통합 > 공급망 네트워크 > [출하 L/T](#/dataintegration/network/shipmentlt)

### 작업 테이블 정보

- #### TB_IF_SHIP_LT

| 필수 | 물리명              | 논리명      | 형식      | 기본값        | 
|:--:|:-----------------|:---------|:----------|:-------------:|
| O  | CONSUME_LOCAT_CD | 소요 거점 코드 | STRING    |               |
| O  | SUPPLY_LOCAT_CD  | 공급 거점 코드 | STRING    |               |
|    | VEHICL_TP        | 운송 수단    | STRING    |               |
|    | PRIORITY         | 우선순위     | NUMBER    |               |
|    | LEADTIME         | Leadtime | NUMBER    |               |
|    | UOM_CD           | 시간 단위    | STRING    |               |
|    | CREATE_BY        | 생성자      | USER_ID   |               |
|    | CREATE_DTTM      | 생성일시     | NOW       |               |
|    | MODIFY_BY        | 수정자      | USER_ID   |               |
|    | MODIFY_DTTM      | 수정일시     | NOW       |               |


#### CONSUME_LOCAT_CD
> 소요 거점 코드   
> `거점` 화면의 `거점 코드`로 입력합니다.  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### SUPPLY_LOCAT_CD
> 공급 거점 코드   
> `거점` 화면의 `거점 코드`로 입력합니다.  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### VEHICL_TP
> 운송 수단  
> 데이터 예시 입니다. (ex : `MOVE` | `TRUCK` | `SEA` | `AIR`)  
> SELECT VEHICL_TP FROM TB_CM_VEHICLE

#### PRIORITY
> 우선순위

#### LEADTIME
> 운송 Leadtime

#### UOM_CD
> 시간 단위  
> `DAY` | `WEEK` | `MONTH`  
> `SELECT UOM_CD FROM TB_CM_UOM WHERE BASE_PLAN_UOM_YN = 'Y'`

#### CREATE_BY
> 생성자

#### CREATE_DTTM
> 생성일

#### MODIFY_BY
> 수정자

#### MODIFY_DTTM
> 수정일시

### 연관 테이블

- TB_CM_SHIP_LT_MST : 출하 Lead Time Master
- TB_CM_SHIP_LT_DTL : 출하 Lead Time Detail
