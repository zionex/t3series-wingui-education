### 개요
    실적 참조를 위한 매핑정보입니다.   
    신제품이나 신거래처의 경우 실적이 없으므로 예측이 어렵습니다. 이때 실적이 있는 비슷한 품목과 거래처를 등록하면 이 매핑기준의 실적으로 예측합니다. 

### 주의 사항


### 관련 화면
- 데이터 통합 > 수요 예측 > [신-구 품목 매핑](#/dataintegration/baselineforecast/newtargetsalesmap )  

### 작업 테이블 정보
- #### TB_BF_NEW_ITEM_ACCOUNT_MAP

| 필수 | 물리명                                 | 논리명       | 형식     |    기본값    | 
|:--:|:------------------------------------|:----------|:-------|:---------:|
| O  | FROM_ACCOUNT_CD      | 구거래처코드    | STRING |           |
| O  | TO_ACCOUNT_CD        | 신거래처코드    | STRING |           |
| O  | FROM_ITEM_CD            | 구품목 코드    | STRING |           |
| O  | TO_ITEM_CD              | 신품목 코드    | STRING |           |
| O  | APPLY_PCT       | 반영비율      | STRING |           |
|   | FROM_APPLY_DATE | 실적반영 시작날짜 | STRING |           |
|   | TO_APPLY_DATE     | 실적반영 끝날짜  | STRING |           |
| O  | USE_YN                   | 사용여부      | STRING |           |
|    | CREATE_BY             | 생성자       | STRING |           |
|    | MODIFY_BY             | 수정자       | STRING |           |

#### FROM_ACCOUNT_CD
> 구 거래처코드      
> 실적이 있는 거래처

#### TO_ACCOUNT_CD
> 신 거래처코드   
> 실적이 없는 거래처

#### FROM_ITEM_CD
> 구 품목 코드
> 실적이 있는 품목

#### TO_ITEM_CD
> 신 품목 코드
> 실적이 없는 품목

#### APPLY_PCT
> 반영비율
> 예를 들어 100 이면 실적을 그대로 반영합니다. 80이면 실적의 80%를 계산하여 반영합니다.

#### FROM_APPLY_DATE
> 실적반영 시작날짜
#### TO_APPLY_DATE
> 실적반영 끝날짜
#### USE_YN
> 사용여부


#### CREATE_BY
> 생성자  

#### MODIFY_BY
> 수정자  

### 연관 테이블

- TB_CM_ITEM_MST : 품목
- TB_DP_ACCOUNT_MST : 거래처
