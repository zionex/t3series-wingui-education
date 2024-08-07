### 개요
    출하 실적 정보를 인터페이스 하여 IM/RP/MP 출하 실적 정보를 일괄로 등록합니다.
    `TB_IF_ACTUAL_SHIPMENT` 테이블에 저장 시 출하 실적, 재고 비용 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다. 

### 관련 화면
- 데이터 통합 > 운영 데이터 > [출하 실적](#/dataintegration/actual/shippingactual)
- 데이터 통합 > 재고 계획 > [재고 비용](#/dataintegration/inventoryplan/stockcost)

### 작업 테이블 정보

- #### TB_IF_ACTUAL_SHIPMENT

| 필수 | 물리명                                          | 논리명                   | 형식      | 기본값        | 
|:--:|:-------------------------------------------------|:------------------------|:----------|:-------------:|
| O  | PO_NO                                            | PO No                   | STRING    |               |
| O  | SUPPLY_LOCAT_CD                                  | 공급 거점 코드           | STRING    |               |
|    | CONSUME_LOCAT_CD                                 | 소요 거점 코드           | STRING    |               |
| O  | ITEM_CD                                          | 품목 코드                | STRING    |               |
|    | ACCOUNT_CD                                       | 거래처 코드              | STRING    |               |
|    | VEHICL_TP_CD                                     | 운송 수단 코드           | STRING    |               |
|    | BOD_LEADTIME                                     | BOD Leadtime            | NUMBER    |               |
|    | INV_LOCAT_CD                                     | 저장 위치 코드           | STRING    |               |
|    | ETD                                              | 예상 출발일자            | DATE      |               |
| O  | ATD                                              | 실제 출발일자            | DATE      |               |
|    | ETA                                              | 예상 도착일자            | DATE      |               |
| O  | ATA                                              | 실제 도착일자            | DATE      |               |
| O  | SHPP_QTY                                         | 출하량                  | NUMBER    |               |
| O  | SHPP_AMT                                         | 출하금액                 | NUMBER    |               |
|    | INVOICE_NO                                       | Invoice No              | STRING    |               |
|    | CONTAINER_NO                                     | Container No            | STRING    |               |
|    | CREATE_BY                                        | 생성자                   | USER_ID   |               |
|    | CREATE_DTTM                                      | 생성일시                 | NOW       |               |
|    | MODIFY_BY                                        | 수정자                   | USER_ID   |               |
|    | MODIFY_DTTM                                      | 수정일시                 | NOW       |               |


#### PO_NO
> PO No

#### SUPPLY_LOCAT_CD
> 공급 거점 코드  
> `거점` 화면의 `거점 코드`로 입력합니다.  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### CONSUME_LOCAT_CD
> 소요 거점 코드  
> `거점` 화면의 `거점 코드`로 입력합니다.
> SUPPLY_LOCAT_CD가 수요출하지 거점인 경우 이 컬럼값은 NULL로 입력합니다.
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### ITEM_CD
> 품목 코드  
> `품목` 화면의 `품목 코드`로 입력합니다.  
> SELECT ITEM_CD FROM TB_CM_ITEM_MST  

#### ACCOUNT_CD
> 거래처 코드  
> `거래처` 화면의 `거래처 코드`로 입력합니다.  
> SELECT ACCOUNT_CD FROM TB_DP_ACCOUNT_MST

#### VEHICL_TP_CD
> 운송 수단 코드  
> SELECT VEHICL_TP FROM TB_CM_VEHICLE

#### BOD_LEADTIME
> BOD Leadtime

#### INV_LOCAT_CD
> 저장 위치 코드   
> Storage Location 코드  
> SELECT INV_LOCAT_CD FROM TB_CM_STORAGE_LOCATION

#### ETD
> 예상 출발일자
> Estimated time of Departure

#### ATD
> 실제 출발일자
> Actual time of Departure

#### ETA
> 예상 도착일자
> Estimated time of Arrival

#### ATA
> 실제 도착일자
> Actual time of Arrival

#### SHPP_QTY
> 출하량

#### SHPP_AMT
> 출하금액

#### INVOICE_NO
> Invoice No
> 송장 번호

#### CONTAINER_NO
> Container No

#### CREATE_BY
> 생성자

#### CREATE_DTTM
> 생성일

#### MODIFY_BY
> 수정자

#### MODIFY_DTTM
> 수정일시

### 연관 테이블

- TB_CM_ACTUAL_SHIPMENT : 출하 실적
- TB_IM_INV_COST : 재고 비용