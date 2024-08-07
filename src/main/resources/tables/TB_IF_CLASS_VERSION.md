### 개요
    ABC-XYZ 분류 버전 정보를 인터페이스 하여 IM ABC-XYZ 분류 버전 정보를 생성합니다.
    `TB_IF_CLASS_VERSION` 테이블에 저장 시 ABC-XYZ 분류, ABC-XYZ 분석 상세 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다. 

### 관련 화면
- 재고 계획 > ABC-XYZ > [ABC-XYZ 분류](#/inventoryplan/analysis/abcxyz)
- 재고 계획 > ABC-XYZ > [ABC-XYZ 분석 상세](#/inventoryplan/analysis/abcxyzanalysisresult)

### 작업 테이블 정보

- #### TB_IF_CLASS_VERSION

| 필수 | 물리명                                          | 논리명                   | 형식      | 기본값        | 
|:--:|:-------------------------------------------------|:------------------------|:----------|:-------------:|
| O  | CLASS_DESCRIP                                    | 분류 버전 설명           | STRING    |               |
|    | ANLYS_PERIOD                                     | 실적 분석 구간           | NUMBER    |               |
|    | UOM_CD                                           | 구간 단위                | STRING    |               |
|    | EVAL_END_DT                                      | 평가 종료 월             | STRING    |               |
|    | GRADE_CAL_BASE_CD                                | 등급 산정 기준           | STRING    |               |
|    | EVAL_BASE_CD                                     | 평가 기준                | STRING    |               |
|    | A_EVAL_VAL                                       | A 등급 평가 값           | NUMBER    |               |
|    | B_EVAL_VAL                                       | B 등급 평가 값           | NUMBER    |               |
|    | C_EVAL_VAL                                       | C 등급 평가 값           | NUMBER    |               |
|    | X_EVAL_VAL                                       | X 등급 평가 값           | NUMBER    |               |
|    | Y_EVAL_VAL                                       | Y 등급 평가 값           | NUMBER    |               |
|    | Z_EVAL_VAL                                       | Z 등급 평가 값           | NUMBER    |               |
|    | NEW_ITEM_CNT                                     | 신규품목수               | NUMBER    |               |
|    | NO_SALES_CNT                                     | 판매없는 품목수           | NUMBER    |               |
|    | EOS_ITEM_CNT                                     | 판매단종예상 품목수       | NUMBER    |               |
|    | ACTV_YN                                          | 활성화 여부              | STRING    |               |
|    | CREATE_BY                                        | 생성자                   | USER_ID   |               |
|    | CREATE_DTTM                                      | 생성일시                 | NOW       |               |
|    | MODIFY_BY                                        | 수정자                   | USER_ID   |               |
|    | MODIFY_DTTM                                      | 수정일시                 | NOW       |               |


#### CLASS_DESCRIP
> 분류 버전 설명    
> 사용자가 식별할 수 있는 등급 분류 명을 입력합니다.   
> 데이터 예시 입니다. (ex : 거점-품목 7:2:1)  

#### ANLYS_PERIOD
> 실적 분석 구간  
> 데이터 예시 입니다. (ex : 12)  

#### UOM_CD
> 실적 분석 구간의 날짜 단위  
> 실적 분석 구간 기본은 12개월입니다.  
> 데이터 예시 입니다. (ex : MONTH)  

#### EVAL_END_DT
> 평가 종료 월  
> 데이터 예시 입니다. (ex : 2024-12)  

#### GRADE_CAL_BASE_CD
> 등급 산정 기준  
> 1. 거점 & 품목을 선택하면 거점별 출하 실적 정보로 등급 평가를 실행합니다.   
> 2. 품목을 선택하면 전사 기준 판매 실적 정보로 등급 평가를 실행합니다.   
> 동일한 품목은 모든 거점에 동일한 등급으로 적용됩니다.  
> 데이터 예시 입니다. (ex : LOCAT_ITEM | ITEM)  

#### EVAL_BASE_CD
> 평가 기준  
> 1. 기업의 수익에 영향을 미치는 인자는 금액(매출)이며, 전체 품목을 동일한 기준으로 분류할 수 있는 기준입니다.   
> 2. 판매량을 평가 기준으로 선택할 수도 있지만, 품목의 단위가 서로 다른 경우에는 추천하지 않습니다.  
> 데이터 예시 입니다. (ex : REVENUE_BASE | QTY_BASE)  

#### A_EVAL_VAL
> A 등급 평가 값  
> 평가 기준을 매출로 선택한 경우를 기준으로, A : 70% 는 전체 매출의 70% 까지 차지하는 품목을 A 등급으로 판단하겠다는 의미입니다.   
> A + B + C 등급 비율의 합은 100% 입니다.  

#### B_EVAL_VAL
> B 등급 평가 값  

#### C_EVAL_VAL
> C 등급 평가 값  

#### X_EVAL_VAL
> X 등급 평가 값  
> 기본은 X : 15% 이하(↓), Y : 50% 이하(↓), Z : 50% 이상(↑) 입니다.   
> 평가 기준을 매출로 선택한 경우를 기준으로, X : 15% 이하(↓) 는 매출 평균의 표준 편차로 계산한 변동성이 15% 보다 낮은 품목을 X 등급으로 판단하겠다는 의미입니다.   
> 표준 편차가 낮다는 것은 그 품목이 안정적으로 꾸준히 잘 판매된다는 의미이고, 표준 편차가 높다는 것은 그 품목이 언제 얼마만큼 판매될지 예상하기 어렵다는 의미입니다.   

#### Y_EVAL_VAL
> Y 등급 평가 값

#### Z_EVAL_VAL
> Z 등급 평가 값

#### NEW_ITEM_CNT
> 신규품목수

#### NO_SALES_CNT
> 판매없는 품목수

#### EOS_ITEM_CNT
> 판매단종예상 품목수

#### ACTV_YN
> 활성화 여부

#### CREATE_BY
> 생성자

#### CREATE_DTTM
> 생성일

#### MODIFY_BY
> 수정자

#### MODIFY_DTTM
> 수정일시

### 연관 테이블

- TB_IM_CLASS_VERSION : ABC-XYZ 분류 버전
- TB_IM_ABCXYZ_ANLYS : ABC-XYZ 분류 분석 결과