### 개요
    Measure Data를 등록합니다.

### 주의 사항
    날짜는 수요계획의 버킷단위로 데이타를 구성해야 합니다.
    예를 들어 수요계획의 버킷 타입이 PW 이면 PW 단위로 데이타를 구성합니다.

### 관련 화면
- 데이터 통합 > 수요 계획 > [Measure 데이터](#/dataintegration/demandplan/measuredata)   

### 작업 테이블 정보
- #### TB_DP_MEASURE_DATA


| 필수 | 물리명                                   | 논리명    | 형식     |    기본값    | 
|:--:|:--------------------------------------|:-------|:-------|:---------:|
| O  | ACCOUNT_CD | 거래처코드  | STRING |           |
| O  | ITEM_CD                   | 품목 코드  | STRING |           |
| O  | BASE_DATE                   | 기준날짜   | DATE   |           |
|    | ANNUAL_QTY                  | 연간계획수량 | NUMBER |           |
|    | ANNUAL_AMT                  | 연간계획금액 | NUMBER |           |
|   | YOY_QTY                   | 전년동기수량 | NUMBER |           |
|   | YOY_AMT                   | 전년동기금액 | NUMBER |           |
|   | BF_MEAS_QTY                   | 예측수량   | NUMBER |           |
|   | BF_MEAS_AMT                  | 예측금액   | NUMBER |           |
|   | ACT_SALES_QTY                   | 실적수량   | NUMBER |           |
|   | ACT_SALES_AMT                   | 실적금액   | NUMBER |           |
|    | CREATE_BY                   | 생성자    | STRING |           |
|    | MODIFY_BY                   | 수정자    | STRING |           |

#### ACCOUNT_CD
> 거래처코드    
> `TB_DP_ACCOUNT_MST` 테이블의 `ACCOUNT_CD` 컬럼의 값이 됩니다.

#### ITEM_CD
> 품목 코드    
> `TB_CM_ITEM_MST` 테이블의 `ITEM_CD` 컬럼의 값이 됩니다.  

#### BASE_DATE
> 기준날짜

#### ANNUAL_QTY
> 연간계획수량
#### ANNUAL_AMT
> 연간계획금액

#### YOY_QTY
> 전년동기수량

#### YOY_AMT
> 전년동기금액

#### BF_MEAS_QTY
> 실적수량

#### BF_MEAS_AMT
> 실적금액

#### ACT_SALES_QTY
> 판매실적금액


#### ACT_SALES_AMT
> 판매실적금액


#### CREATE_BY
> 생성자  

#### MODIFY_BY
> 수정자  


### 연관 테이블

- TB_CM_ITEM_MST : 품목
- TB_DP_ACCOUNT_MST : 거래처
- TB_CM_COMM_CONFIG : 일반환경설정 
