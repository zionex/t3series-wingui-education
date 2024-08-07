### 개요
    거점-품목의 보충 발주 정보를 인터페이스 하여 RP 보충 발주 정책 정보를 일괄로 등록합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다. 

### 관련 화면
- 보충 계획 > 사전 분석 > 보충 발주 정책 > [보충 발주 정책](#/dataintegration/dataloading/dataimport)

### 작업 테이블 정보

- #### TB_IF_REPLSH_STRATEGY

| 필수 | 물리명                                          | 논리명                   | 형식      | 기본값        | 
|:--:|:-------------------------------------------------|:------------------------|:----------|:-------------:|
| O  | LOCAT_CD                                         | 거점 코드                | STRING    |               |
| O  | ITEM_CD                                          | 품목 코드                | STRING    |               |
| O  | INV_MGMT_SYSTEM_TP_CD                            | 재고 관리 유형           | STRING    |               |
|    | PO_CYCLE_CALENDAR_CD                             | 발주 주기 캘린더 코드     | STRING    |               |
|    | MIN_ORDER_QTY                                    | 최소 발주 수량           | NUMBER    |               |
|    | MAX_ORDER_QTY                                    | 최대 발주 수량           | NUMBER    |               |
|    | MULTIPLIER_ORDER_QTY                             | 최소 주문 수량           | NUMBER    |               |
|    | CREATE_BY                                        | 생성자                   | USER_ID   |               |
|    | CREATE_DTTM                                      | 생성일시                 | NOW       |               |
|    | MODIFY_BY                                        | 수정자                   | USER_ID   |               |
|    | MODIFY_DTTM                                      | 수정일시                 | NOW       |               |


#### LOCAT_CD
> 거점 코드  
> `거점` 화면의 `거점 코드`로 입력합니다.  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### ITEM_CD
> 품목 코드  
> `품목` 화면의 `품목 코드`로 입력합니다.  
> SELECT ITEM_CD FROM TB_CM_ITEM_MST  

#### INV_MGMT_SYSTEM_TP_CD
> 재고 관리 유형  
> SELECT A.COMN_CD FROM TB_AD_COMN_CODE A, TB_AD_COMN_GRP B WHERE B.ID = A.SRC_ID AND B.GRP_CD = 'INVENTORY_MGMT_SYSTEM_TYPE'

#### PO_CYCLE_CALENDAR_CD
> 발주 주기 캘린더 코드  
> 데이터 예시 입니다. (ex : PO Calendar - 001 | PO Calendar - 002 | … )  

#### MIN_ORDER_QTY
> 최소 발주 수량  

#### MAX_ORDER_QTY
> 최대 발주 수량   

#### MULTIPLIER_ORDER_QTY
> 최소 주문 수량  

#### CREATE_BY
> 생성자  

#### CREATE_DTTM
> 생성일  

#### MODIFY_BY
> 수정자  

#### MODIFY_DTTM
> 수정일시

### 연관 테이블

- TB_RP_REPLSH_STRATEGY : 보충 발주 정책
