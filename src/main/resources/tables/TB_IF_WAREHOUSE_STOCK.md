### 개요
    창고 재고 정보를 인터페이스 하여 IM/RP/MP 창고 재고 정보를 일괄로 등록합니다.   
    `TB_IF_WAREHOUSE_STOCK` 테이블에 저장 시 창고 재고 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다. 

### 관련 화면
- 데이터 통합 > 공급계획 > [창고 재고](#/dataintegration/actual/warehousestock)

### 작업 테이블 정보

- #### TB_IF_WAREHOUSE_STOCK

| 필수 | 물리명                                          | 논리명                   | 형식      | 기본값        | 
|:--:|:-------------------------------------------------|:------------------------|:----------|:-------------:|
| O  | CUTOFF_DATE                                      | CutOff 일자             | DATE      |               |
| O  | INV_ID                                           | 재고 ID                 | STRING    |               |
| O  | LOCAT_CD                                         | 거점 코드                | STRING    |               |
| O  | ITEM_CD                                          | 품목 코드                | STRING    |               |
| O  | INV_LOCAT_CD                                     | 저장 위치 코드           | STRING    |               |
| O  | RECEIPT_DATE                                     | 입고일자                 | DATE      |               |
|    | USABLE_DATE                                      | 사용일자                 | DATE      |               |
|    | EXPIRE_DATE                                      | 만료일자                 | DATE      |               |
| O  | INV_LOCAT_CATAGY_NM                              | 저장 위치 명             | STRING    |               |
| O  | INV_QTY_TP_NM                                    | 재고 수량 타입           | STRING    |               |    
| O  | QTY                                              | 수량                    | NUMBER    |               |
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

#### LOCAT_CD
> 거점 코드
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

#### RECEIPT_DATE
> 입고일자  

#### USABLE_DATE
> 사용일자  

#### EXPIRE_DATE
> 만료일자  

#### INV_LOCAT_CATAGY_NM
> 저장 위치 분류 명  
> SELECT INV_LOCAT_CATAGY_NM FROM TB_IM_STOCK_QTY_TYPE  

#### INV_QTY_TP_NM
> 재고 수량 타입  
> SELECT INV_QTY_TP_NM FROM TB_IM_STOCK_QTY_TYPE

#### QTY
> 수량  

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

- TB_CM_WAREHOUSE_STOCK_MST : 창고 재고
- TB_CM_WAREHOUSE_STOCK_QTY : 창고 재고 수량