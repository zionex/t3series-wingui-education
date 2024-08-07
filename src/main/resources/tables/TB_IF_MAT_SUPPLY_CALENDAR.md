### 개요
    자재 공급 캘린더 정보를 인터페이스 하여 MP 자재 공급 캘린더 정보를 일괄로 등록합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다. 

### 관련 화면
    없음

### 작업 테이블 정보

- #### TB_IF_MAT_SUPPLY_CALENDAR

| 필수 | 물리명                                          | 논리명                   | 형식      | 기본값        | 
|:--:|:-------------------------------------------------|:------------------------|:----------|:-------------:|
| O  | CUTOFF_DATE                                      | CutOff 일자              | DATE      |               |
| O  | LOCAT_CD                                         | 거점 코드                | STRING    |               |
| O  | ITEM_CD                                          | 품목 코드                | STRING    |               |
|    | VENDOR_CD                                        | Vendor 코드             | STRING    |               |
|    | BOOKING_DATE                                     | 예약일자                 | DATE      |               |
|    | ETD                                              | 예상 출발일자            | DATE      |               |
|    | ATD                                              | 실제 출발일자            | DATE      |               |
|    | ETA                                              | 예상 도착일자            | DATE      |               |
| O  | ATA                                              | 실제 도착일자            | DATE      |               |
| O  | GR_QTY                                           | 입고수량                 | NUMBER    |               |
|    | GR_AMT                                           | 입고금액                 | NUMBER    |               |
| O  | INV_LOCAT_CD                                     | 저장 위치 코드           | STRING    |               |
|    | PO_NO                                            | PO No                   | STRING    |               |
|    | INVOICE_NO                                       | Invoice No              | STRING    |               |
|    | CONTAINER_NO                                     | Container No            | STRING    |               |
|    | CREATE_BY                                        | 생성자                   | USER_ID   |               |
|    | CREATE_DTTM                                      | 생성일시                 | NOW       |               |
|    | MODIFY_BY                                        | 수정자                   | USER_ID   |               |
|    | MODIFY_DTTM                                      | 수정일시                 | NOW       |               |


#### CUTOFF_DATE
> CutOff 일자

#### LOCAT_CD
> 거점 코드  
> `거점` 화면의 `거점 코드`로 입력합니다.  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### ITEM_CD
> 품목 코드  
> `품목` 화면의 `품목 코드`로 입력합니다.  
> SELECT ITEM_CD FROM TB_CM_ITEM_MST  

#### VENDOR_CD
> Vendor 코드

#### BOOKING_DATE
> 예약일자

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

#### GR_QTY
> 입고수량

#### GR_AMT
> 입고금액

#### INV_LOCAT_CD
> 저장 위치 코드 
> Storage Location 코드  
> SELECT INV_LOCAT_CD FROM TB_CM_STORAGE_LOCATION  

#### PO_NO
> PO No

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

- TB_MP_MAT_SUPPLY_CALENDAR : 자재 공급 캘린더
- TB_IM_INV_COST : 재고 비용