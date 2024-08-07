### 개요
    판매 인자 값을  등록합니다.

### 주의 사항
    예측구간의 값도 필요합니다.

### 관련 화면
- 데이터 통합 > 수요 예측 > [품목별 인자](#/dataintegration/baselineforecast/salesfactor)   

### 작업 테이블 정보

- #### TB_BF_SALES_FACTOR


| 필수 | 물리명                             | 논리명   | 형식     |    기본값    | 
|:--:|:--------------------------------|:------|:-------|:---------:|
| O  | ACCOUNT_CD      | 거래처코드 | STRING |           |
| O  | ITEM_CD            | 품목 코드 | STRING |           |
| O  | BASE_DATE         | 기준날짜  | DATE   |           |
|    | SALES_FACTOR1 | 판매인자1 | NUMBER |           |
|    | SALES_FACTOR2 | 판매인자2 | NUMBER |           |
|    | SALES_FACTOR3 | 판매인자3 | NUMBER |           |
|    | SALES_FACTOR4 | 판매인자4 | NUMBER |           |
|    | SALES_FACTOR5 | 판매인자5 | NUMBER |           |
|    | CREATE_BY         | 생성자   | STRING |           |
|    | MODIFY_BY         | 수정자   | STRING |           |

#### ACCOUNT_CD
> 거래처코드    
> `TB_DP_ACCOUNT_MST` 테이블의 `ACCOUNT_CD` 컬럼의 값이 됩니다.

#### ITEM_CD
> 품목 코드    
> `TB_CM_ITEM_MST` 테이블의 `ITEM_CD` 컬럼의 값이 됩니다.  

#### BASE_DATE
> 기준날짜

#### SALES_FACTOR1
> 판매인자1

#### SALES_FACTOR2
> 판매인자2

#### SALES_FACTOR3
> 판매인자3

#### SALES_FACTOR4
> 판매인자4

> #### SALES_FACTOR5
> 판매인자5

#### CREATE_BY
> 생성자  

#### MODIFY_BY
> 수정자  


### 연관 테이블

- TB_CM_ITEM_MST : 품목
- TB_DP_ACCOUNT_MST : 거래처
