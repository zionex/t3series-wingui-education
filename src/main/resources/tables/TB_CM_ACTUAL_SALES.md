### 개요
    판매 실적을  등록합니다.

### 주의 사항
    실제 판매 실적 테이블(TB_CM_ACTUAL_SALES)에는 QTY_CORRECTION, AMT_CORRECTION, CORRECTION_YN, CORRECTION_COMMENT_ID 있는데
    이는 실적값의 보정관련된 컬럼입니다.
    보정컬럼은 interface 이후에 원래 값을 수정하는 용도로 사용합니다.
    실적을 보정하는 이유는 BF에 잘못된 inteface 값을 정상화 시켜서 에측 input으로 사용하기 위함입니다.
    데이터 일괄 처리 에서는 보정 컬럼은 제외시켰습니다.


### 관련 화면
- 데이터 통합 > 수요 계획 > [판매실적](#/dataintegration/actual/actualsales)   

### 작업 테이블 정보

- #### TB_CM_ACTUAL_SALES

| 필수 | 물리명          | 논리명   | 형식     |    기본값    | 
|:--:|:-------------|:------|:-------|:---------:|
| O  | ACCOUNT_CD   | 거래처코드 | STRING |           |
| O  | ITEM_CD      | 품목 코드 | STRING |           |
| O  | BASE_DATE    | 기준날짜  | DATE   |           |
|    | SO_STATUS_CD | 생성자   | STRING |           |
| O  | QTY          | 생성자   | NUMBER |           |
| O  | AMT          | 생성자   | NUMBER |           |
|    | CREATE_BY    | 생성자   | STRING |           |
|    | MODIFY_BY    | 수정자   | STRING |           |

#### ACCOUNT_CD
> 거래처코드   
> `TB_DP_ACCOUNT_MST` 테이블의 `ACCOUNT_CD` 컬럼의 값이 됩니다.

#### ITEM_CD
> 품목 코드   
> `TB_CM_ITEM_MST` 테이블의 `ITEM_CD` 컬럼의 값이 됩니다.  

#### BASE_DATE
> 기준날짜

#### SO_STATUS_CD
> 실적의 구분타입   
> `TB_CM_COMM_CONFIG` 테이블의 `CONF_CD` 컬럼의 값이 됩니다.   
  'SHIP'을 기본으로 넣어주시면 됩니다.   
  계획이나 실적 처리에 의미있게 사용되지는 않습니다. 실적을 확인할때 구분하는 용도로 사용됩니다.   
#### QTY
> 판매수량

#### AMT
> 판매금액


#### CREATE_BY
> 생성자  

#### MODIFY_BY
> 수정자  

### 연관 테이블

- TB_CM_ITEM_MST : 품목
- TB_DP_ACCOUNT_MST : 거래처
- TB_CM_COMM_CONFIG : 일반환경설정 
