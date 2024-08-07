### 개요
    Dimension Data를  등록합니다.
    수요계획입력화면에서 Dimension에는 기본적으로 품목관련 계층/속성, 거래처관련계층/속성만 설정이 가능합니다.  
    Dimension에 품목-거래처 단위의 추가적인 정보를 보여주고 싶다면 등록합니다. 
    기본값은 실적1개월평균수량, 실적3개월평균수량, 실적6개월평균수량, 예측정확도, 예측선택모델의 컬럼이 생성되어있습니다.

### 주의 사항
    추가적인 컬럼의 데이터를 넣으려면 기본 설정으로는 데이타일괄처리에서 어렵습니다. 연구소로 연락주세요.


### 관련 화면
- 데이터 통합 > 수요 계획 > [Dimension 데이터](#/dataintegration/demandplan/dimdata)   

### 작업 테이블 정보

- #### TB_DP_DIMENSION_DATA


| 필수 | 물리명                                   | 논리명       | 형식     |    기본값    | 
|:--:|:--------------------------------------|:----------|:-------|:---------:|
| O  | ACCOUNT_CD | 거래처코드     | STRING |           |
| O  | ITEM_CD                  | 품목 코드     | STRING |           |
|    | SALES_1M                   | 실적1개월평균수량 | NUMBER |           |
|    | SALES_3M                   | 실적3개월평균수량 | NUMBER |           |
|    | SALES_6M                   | 실적6개월평균수량 | NUMBER |           |
|    | BF_ACCURACY                   | 예측정확도     | NUMBER |           |
|    | BF_MODEL                   | 예측선택모델    | STRING |           |
|    | CREATE_BY                   | 생성자       | STRING |           |
|    | MODIFY_BY                   | 수정자       | STRING |           |

#### ACCOUNT_CD
> 거래처코드    
> `TB_DP_ACCOUNT_MST` 테이블의 `ACCOUNT_CD` 컬럼의 값이 됩니다.

#### ITEM_CD
> 품목 코드   
> `TB_CM_ITEM_MST` 테이블의 `ITEM_CD` 컬럼의 값이 됩니다.  

#### SALES_1M
> 실적1개월평균수량

#### SALES_3M
> 실적3개월평균수량

#### SALES_6M
> 실적6개월평균수량

#### BF_ACCURACY
> 예측정확도

#### BF_MODEL
> 예측선택모델

#### CREATE_BY
> 생성자  

#### MODIFY_BY
> 수정자  

### 연관 테이블

- TB_CM_ITEM_MST : 품목
- TB_DP_ACCOUNT_MST : 거래처
