### 개요
    목표 재고 시뮬레이션 버전 정보를 인터페이스 하여 IM 목표 재고 시뮬레이션 버전 정보를 생성합니다.  
    `TB_IM_TARGET_INV_VERSION` 테이블에 저장 시 목표 재고 시뮬레이션, 시뮬레이션 결과 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다. 

### 관련 화면
- 재고 계획 > 시뮬레이션 > [목표 재고 시뮬레이션](#/inventoryplan/planningsimulation/targetinventorysimulation)  
- 재고 계획 > 시뮬레이션 > [목표 재고 시뮬레이션 결과](#/inventoryplan/planningsimulation/targetinventoryresult)

### 작업 테이블 정보

- #### TB_IF_TARGET_INV_VERSION

| 필수 | 물리명                                          | 논리명                   | 형식      | 기본값        | 
|:--:|:-------------------------------------------------|:------------------------|:----------|:-------------:|
| O  | SNRIO_DESCRIP                                    | 시나리오 설명            | STRING    |               |
|    | EVAL_STRT_DT                                     | 평가 시작 월             | STRING    |               |
|    | EVAL_END_DT                                      | 평가 종료 월             | STRING    |               |
|    | EVAL_UOM_CD                                      | 평가 기준 단위           | STRING    |               |
|    | CLASS_VER_CD                                     | ABC-XYZ 등급 분류 ID     | STRING    |               |
|    | EVAL_BASE_CD                                     | 평가 기준                | STRING    |               |
|    | AX_POLICY_CD                                     | AX 재고정책              | STRING    |               |
|    | AY_POLICY_CD                                     | AY 재고정책              | STRING    |               |
|    | AZ_POLICY_CD                                     | AZ 재고정책              | STRING    |               |
|    | BX_POLICY_CD                                     | BX 재고정책              | STRING    |               |
|    | BY_POLICY_CD                                     | BY 재고정책              | STRING    |               |
|    | BZ_POLICY_CD                                     | BZ 재고정책              | STRING    |               |
|    | CX_POLICY_CD                                     | CX 재고정책              | STRING    |               |
|    | CY_POLICY_CD                                     | CY 재고정책              | STRING    |               |
|    | CZ_POLICY_CD                                     | CZ 재고정책              | STRING    |               |
|    | AX_POLICY_VAL                                    | AX 재고정책 값           | NUMBER    |               |
|    | AY_POLICY_VAL                                    | AY 재고정책 값           | NUMBER    |               |
|    | AZ_POLICY_VAL                                    | AZ 재고정책 값           | NUMBER    |               |
|    | BX_POLICY_VAL                                    | BX 재고정책 값           | NUMBER    |               |
|    | BY_POLICY_VAL                                    | BY 재고정책 값           | NUMBER    |               |
|    | BZ_POLICY_VAL                                    | BZ 재고정책 값           | NUMBER    |               |
|    | CX_POLICY_VAL                                    | CX 재고정책 값           | NUMBER    |               |
|    | CY_POLICY_VAL                                    | CY 재고정책 값           | NUMBER    |               |
|    | CZ_POLICY_VAL                                    | CZ 재고정책 값           | NUMBER    |               |
|    | ACTV_YN                                          | 활성화 여부              | STRING    |               |
|    | CREATE_BY                                        | 생성자                   | USER_ID   |               |
|    | CREATE_DTTM                                      | 생성일시                 | NOW       |               |
|    | MODIFY_BY                                        | 수정자                   | USER_ID   |               |
|    | MODIFY_DTTM                                      | 수정일시                 | NOW       |               |


#### SNRIO_DESCRIP
> 시나리오 설명  
> 사용자가 식별할 수 있는 목표 재고 시뮬레이션 명을 입력합니다.   
> 데이터 예시 입니다. (ex : AX to CZ (95, 93, 90, 85, 80, 70, 14, 7, 0))  

#### EVAL_STRT_DT
> 평가 시작 월  
> 목표 재고 산출을 위한 평가 구간을 선택합니다.   
> 기본은 12개월입니다.  
> 거점별 출하 실적 정보를 활용합니다.  
> 데이터 예시 입니다. (ex : 2023-01)  

#### EVAL_END_DT
> 평가 종료 월   
> 실적 분석 구간 기본은 12개월입니다.  
> 데이터 예시 입니다. (ex : 2023-12)  

#### EVAL_UOM_CD
> 평가 기준 단위  
> 데이터 예시 입니다. (ex : DAY)  

#### CLASS_VER_CD
> ABC-XYZ 등급 분류 ID  
> ABC-XYZ 등급 분류 기준을 선택합니다.   
> 선택한 기준으로 제품의 등급을 분류하여 목표 재고 및 안전 재고 산출에 사용합니다.  

#### AX_POLICY_CD
> AX 재고정책  
> A 등급의 재고 정책을 설정합니다.   
> 데이터 예시 입니다. (ex : NOR_DIST | SAFETY_DAYS)  

#### AY_POLICY_CD
> AY 재고정책

#### AZ_POLICY_CD
> AZ 재고정책

#### BX_POLICY_CD
> BX 재고정책  
> B 등급의 재고 정책을 설정합니다.   
> 데이터 예시 입니다. (ex : NOR_DIST | SAFETY_DAYS)

#### BY_POLICY_CD
> BY 재고정책

#### BZ_POLICY_CD
> BZ 재고정책

#### CX_POLICY_CD
> CX 재고정책  
> C 등급의 재고 정책을 설정합니다.   
> 데이터 예시 입니다. (ex : NOR_DIST | SAFETY_DAYS)

#### CY_POLICY_CD
> CY 재고정책

#### CZ_POLICY_CD
> CZ 재고정책

#### AX_POLICY_VAL
> AX 재고정책 값  
> 기본은 정규 분포 확률로 AX : 95%, AY : 93%, AZ : 90% 입니다.

#### AY_POLICY_VAL
> AY 재고정책 값

#### AZ_POLICY_VAL
> AZ 재고정책 값

#### BX_POLICY_VAL
> BX 재고정책 값  
> 기본은 정규 분포 확률로 BX : 85%, BY : 80%, BZ : 70% 입니다.

#### BY_POLICY_VAL
> BY 재고정책 값

#### BZ_POLICY_VAL
> BZ 재고정책 값

#### CX_POLICY_VAL
> CX 재고정책 값  
> 기본은 안전 일수로 CX : 14일, CY : 7일, CZ : 0일 입니다.   
> CZ : 0일은 재고 관리를 하지 않겠다는 의미입니다.

#### CY_POLICY_VAL
> CY 재고정책 값

#### CZ_POLICY_VAL
> CZ 재고정책 값

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

- TB_IM_TARGET_INV_VERSION : 목표 재고 시뮬레이션 버전
- TB_IM_TARGET_INV_SETTING : 목표 재고 시뮬레이션 설정
- TB_IM_TARGET_INV_POLICY : 목표 재고 시뮬레이션 결과