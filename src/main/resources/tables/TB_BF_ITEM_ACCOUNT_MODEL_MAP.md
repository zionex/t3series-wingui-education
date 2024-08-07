### 개요
    예측 대상을 등록합니다.

### 주의 사항


### 관련 화면
- 데이터 통합 > 수요 예측 > [예측 대상](#/dataintegration/baselineforecast/forecasttarget)   

### 작업 테이블 정보

- #### TB_BF_ITEM_ACCOUNT_MODEL_MAP

| 필수 | 물리명                                   | 논리명    | 형식     |    기본값    | 
|:--:|:--------------------------------------|:-------|:-------|:---------:|
| O  | ACCOUNT_CD | 거래처코드  | STRING |           |
| O  | ITEM_CD                   | 품목 코드  | STRING |           |
|    | CREATE_BY                   | 생성자    | STRING |           |
|    | MODIFY_BY                   | 수정자    | STRING |           |

#### ACCOUNT_CD
> 거래처코드  

#### ITEM_CD
> 품목 코드  

#### CREATE_BY
> 생성자  

#### MODIFY_BY
> 수정자  

### 연관 테이블
- TB_CM_ITEM_MST : 품목
- TB_DP_ACCOUNT_MST : 거래처
