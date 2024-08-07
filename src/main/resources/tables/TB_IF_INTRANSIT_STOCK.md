### 개요
    이동중 재고 정보를 인터페이스 하여 IM/RP/MP 이동중 재고 정보를 일괄로 등록합니다.  
    `TB_IF_INTRANSIT_STOCK` 테이블에 저장 시 이동중 재고 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다. 

### 관련 화면
- 데이터 통합 > 공급계획 > [이동중 재고](#/dataintegration/actual/intransitstock)

### 작업 테이블 정보

- #### TB_IF_INTRANSIT_STOCK

| 필수 | 물리명                                          | 논리명                   | 형식      | 기본값        | 
|:--:|:-------------------------------------------------|:------------------------|:----------|:-------------:|
| O  | CUTOFF_DATE                                      | CutOff 일자             | DATE      |               |
| O  | INV_ID                                           | 재고 ID                 | STRING    |               |
| O  | FROM_LOCAT_CD                                    | From 거점 코드           | STRING    |               |
| O  | TO_LOCAT_CD                                      | To 거점 코드             | STRING    |               |
| O  | ITEM_CD                                          | 품목 코드                | STRING    |               |
| O  | INV_LOCAT_CD                                     | 저장 위치 코드           | STRING    |               |
|    | VEHICL_VAL                                       | 운송 수단                | STRING    |               |
|    | BOD_LEADTIME                                     | BOD Leadtime            | NUMBER    |               |
|    | SHPP_DATE                                        | 출하일자                 | DATE      |               |
|    | ETD                                              | 예상 출발일자            | DATE      |               |
| O  | ESTIMT_USABLE_DATE                               | 사용일자                 | DATE      |               |
|    | EXPIRE_DATE                                      | 만료일자                 | DATE      |               |
| O  | INV_LOCAT_CATAGY_NM                              | 저장 위치 명             | STRING    |               |
| O  | INV_QTY_TP_NM                                    | 재고 수량 타입           | STRING    |               |
| O  | QTY                                              | 수량                    | NUMBER    |               |
|    | PO_NO                                            | PO No                   | STRING    |               |
|    | INVOICE_NO                                       | Invoice No              | STRING    |               |
|    | CONTAINER_NO                                     | Container No            | STRING    |               |
|    | LOT_NO                                           | Lot No                  | STRING    |               |
|    | ACCOUNT_CD                                       | 거래처 코드              | STRING    |               |
| O  | PLAN_YN                                          | 계획 여부                | STRING    |               |
|    | CREATE_BY                                        | 생성자                   | USER_ID   |               |
|    | CREATE_DTTM                                      | 생성일시                 | NOW       |               |
|    | MODIFY_BY                                        | 수정자                   | USER_ID   |               |
|    | MODIFY_DTTM                                      | 수정일시                 | NOW       |               |


#### CUTOFF_DATE
> 재고 데이터 형성한 CutOff 일자    

#### INV_ID
> 재고 ID  
> Unique한 값으로 설정해야 합니다.  

#### FROM_LOCAT_CD
> From 거점 코드  
> `거점` 화면의 `거점 코드`로 입력합니다.  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### TO_LOCAT_CD
> To 거점 코드  
> `거점` 화면의 `거점 코드`로 입력합니다.  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### ITEM_CD
> 품목 코드  
> `품목` 화면의 `품목 코드`로 입력합니다.  
> SELECT ITEM_CD FROM TB_CM_ITEM_MST  

#### INV_LOCAT_CD
> 저장 위치 코드   
> Storage Location 코드  
> SELECT INV_LOCAT_CD FROM TB_CM_STORAGE_LOCATION  

#### VEHICL_VAL
> 운송 수단  
> SELECT VEHICL_TP FROM TB_CM_VEHICLE

#### BOD_LEADTIME
> BOD Leadtime

#### SHPP_DATE
> 출하일자
> `TB_CM_INTRANSIT_STOCK_MST` 테이블의 `SHPP_DATE` 컬럼의 값입니다.

#### ETD
> 예상 출발일자
> Estimated time of Departure

#### ESTIMT_USABLE_DATE
> 사용일자

#### EXPIRE_DATE
> 만료일자

#### INV_LOCAT_CATAGY_NM
> 저장 위치 븐류 명  
> SELECT INV_LOCAT_CATAGY_NM FROM TB_IM_STOCK_QTY_TYPE  

#### INV_QTY_TP_NM
> 재고 수량 타입  
> SELECT INV_QTY_TP_NM FROM TB_IM_STOCK_QTY_TYPE

#### QTY
> 수량  

#### PO_NO
> PO No  

#### INVOICE_NO
> Invoice No  
> 송장 번호  

#### CONTAINER_NO
> Container No  

#### LOT_NO
> Lot No  
 
#### ACCOUNT_CD
> 거래처 코드  
> `거래처` 화면의 `거래처 코드`로 입력합니다.  
> SELECT ACCOUNT_CD FROM TB_DP_ACCOUNT_MST

#### PLAN_YN
> 계획 여부  
 
#### CREATE_BY
> 생성자

#### CREATE_DTTM
> 생성일

#### MODIFY_BY
> 수정자

#### MODIFY_DTTM
> 수정일시

### 연관 테이블

- TB_CM_INTRANSIT_STOCK_MST : 이동중 재고
- TB_CM_INTRANSIT_STOCK_QTY : 이동중 재고 수량