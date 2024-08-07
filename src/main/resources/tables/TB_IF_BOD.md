### 개요
    거점 BOD 정보를 인터페이스 하여 IM/RP/MP 거점 BOD 정보를 일괄로 등록합니다.
    `TB_IF_BOD` 테이블에 저장 시 거점 BOD, 출하 L/T, 거점 수송, 글로벌 계획 BOM 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다. 

### 관련 화면
- 데이터 통합 > 공급망 네트워크 > [거점 BOD](#/dataintegration/network/sitebod)
- 데이터 통합 > 공급망 네트워크 > [출하 L/T](#/dataintegration/network/shipmentlt)
- 데이터 통합 > 공급망 네트워크 > [거점 수송](#/dataintegration/network/transportation)
- 데이터 통합 > 공급망 네트워크 > [글로벌 계획 BOM](#/dataintegration/network/planningbom)

### 작업 테이블 정보

- #### TB_IF_BOD

| 필수 | 물리명                                          | 논리명                   | 형식      | 기본값        | 
|:--:|:-------------------------------------------------|:------------------------|:----------|:-------------:|
| O  | CONSUME_LOCAT_CD                                 | 소요 거점 코드           | STRING    |               |
| O  | SUPPLY_LOCAT_CD                                  | 공급 거점 코드           | STRING    |               |
|    | SRCING_POLICY_CD                                 | 소싱 정책                | STRING    |               |
|    | SRCING_RULE                                      | 공급거점 우선순위 / 비율  | NUMBER    |               |
|    | CREATE_BY                                        | 생성자                   | USER_ID   |               |
|    | CREATE_DTTM                                      | 생성일시                 | NOW       |               |
|    | MODIFY_BY                                        | 수정자                   | USER_ID   |               |
|    | MODIFY_DTTM                                      | 수정일시                 | NOW       |               |


#### CONSUME_LOCAT_CD
> 소요 거점 코드   
> `거점` 화면의 `거점 코드`로 입력합니다.  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### SUPPLY_LOCAT_CD
> 공급 거점 코드   
> `거점` 화면의 `거점 코드`로 입력합니다.  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### SRCING_POLICY_CD
> 소싱 정책  
> 데이터 예시 입니다. (ex : PRIORITY | PROPORTION)

#### SRCING_RULE
> 공급거점 우선순위 / 비율

#### CREATE_BY
> 생성자

#### CREATE_DTTM
> 생성일

#### MODIFY_BY
> 수정자

#### MODIFY_DTTM
> 수정일시

### 연관 테이블

- TB_CM_LOC_BOD_MAP : 거점 BOD Mapping
- TB_CM_SHIP_LT_MST : 출하 Lead Time Master
- TB_CM_SHIP_LT_DTL : 출하 Lead Time Detail
- TB_CM_TRANSFER_MGMT_MST : 거점 수송 Master
- TB_CM_TRANSFER_MGMT_DTL : 거점 수송 Detail
- TB_CM_GLOBAL_PLAN_BOM : 글로벌 계획 BOM 
