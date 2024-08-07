### 개요
    단위 가격을  등록합니다.
    Demand의 금액을 계산할 때 사용하는 단위가격입니다.

### 주의 사항
    Price를 Entry에서 입력항목으로 관리하는 경우 이 테이블에 데이타를 사용하지 않습니다.

### 관련 화면
- 데이터 통합 > 수요 계획 > [판매 계층](#/dataintegration/demandplan/salesprice) 

### 작업 테이블 정보

- #### TB_DP_UNIT_PRICE


| 필수 | 물리명                         | 논리명   | 형식     |    기본값    | 
|:--:|:----------------------------|:------|:-------|:---------:|
| O  | PRICE_TYPE_CONF_CD | 생성자   | STRING |           |
| O  | ACCOUNT_CD   | 거래처코드 | STRING |           |
| O  | ITEM_CD        | 품목 코드 | STRING |           |
| O  | BASE_DATE    | 기준날짜  | DATE   |           |
| O  | UTPIC            | 생성자   | NUMBER |           |
|    | CREATE_BY   | 생성자   | STRING |           |
|    | MODIFY_BY   | 수정자   | STRING |           |

#### PRICE_TYPE_CONF_CD
> 가격타입    
> `TB_CM_COMM_CONFIG` 테이블의 `CONF_CD` 컬럼의 값이 됩니다.  
> 가격타입을 여러개로 관리할 경우 사용합니다.  
> 'Type1'을 기본값으로 사용하면 됩니다.

#### ACCOUNT_CD
> 거래처코드  
> `TB_DP_ACCOUNT_MST` 테이블의 `ACCOUNT_CD` 컬럼의 값이 됩니다.

#### ITEM_CD
> 품목 코드  
> `TB_CM_ITEM_MST` 테이블의 `ITEM_CD` 컬럼의 값이 됩니다.  

#### BASE_DATE
> 기준날짜

#### UTPIC
> 단위가격


#### CREATE_BY
> 생성자  

#### MODIFY_BY
> 수정자  

### 연관 테이블

- TB_CM_ITEM_MST : 품목
- TB_DP_ACCOUNT_MST : 거래처
- TB_CM_COMM_CONFIG : 일반환경설정 
