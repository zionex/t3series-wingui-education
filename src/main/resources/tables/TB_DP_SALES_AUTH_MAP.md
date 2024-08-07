### 개요
    관리자가  관리하는 판매 계층 노드를 등록합니다.
    각 관리자가 로그인해서 Demand 요청시 여기에 설정된 판매 계층 노드의 하위 Demand만 관리가 가능합니다. 

### 주의 사항
    하나의 판매 게층 노드에는 여러 사용자가 설정이 되어도 상관이 없습니다.
    등록된 관리자는 승인단계에 관여되는 사용자입니다.

### 관련 화면
- 데이터 통합 > 수요 계획 > [관리자 판매 관계](#/dataintegration/demandplan/salesauthmap)  

### 작업 테이블 정보

- #### TB_DP_SALES_AUTH_MAP


| 필수 | 물리명                                   | 논리명    | 형식     |    기본값    | 
|:--:|:--------------------------------------|:-------|:-------|:---------:|
| O  | USER_ID     | 권한유형   | STRING |           |
|    | SALES_LV_CD    | 사용자아이디 | STRING |           |
|    | STRT_DATE_AUTH | 거래처코드  | DATE   |           |
| O  | END_DATE_AUTH                   | 품목 코드  | DATE   |           |
|    | CREATE_BY                  | 생성자    | STRING |           |
|    | MODIFY_BY                   | 수정자    | STRING |           |


#### USER_ID
> 사용자 ID    
> `TB_AD_USER` 테이블의 `USERNAME` 컬럼의 값이 됩니다.

#### SALES_LV_CD
> 권한유형   
> `TB_DP_SALES_LEVEL_MGMT` 테이블의 `SALES_LV_CD` 컬럼의 값이 됩니다.

#### STRT_DATE_AUTH
> 권한 시작구간    
> `TB_DP_ACCOUNT_MST` 테이블의 `ACCOUNT_CD` 컬럼의 값이 됩니다.

#### END_DATE_AUTH
> 품목 코드    
> `TB_CM_ITEM_MST` 테이블의 `ITEM_CD` 컬럼의 값이 됩니다.  

#### CREATE_BY
> 생성자  

#### MODIFY_BY
> 수정자  

### 연관 테이블

- TB_DP_SALES_LEVEL_MGMT : 판매 계층
