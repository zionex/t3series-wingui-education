### 개요
    공급 주문 정보를 인터페이스 하여 MP 공급 주문 정보를 일괄로 등록합니다.
    `TB_IF_DEMAND` 테이블에 저장 시 공급 주문 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다. 

### 관련 화면
- 공급 계획 > 사전 분석 > [공급 주문](#/masterplan/preanalysis/demandoverview)

### 작업 테이블 정보

- #### TB_IF_DEMAND

| 필수 | 물리명                | 논리명               | 형식      | 기본값 | 
|:--:|:-------------------|:------------------|:----------|:---:|
| O  | DMND_VER_ID        | 수요 버전 ID | STRING    |     |
| O  | DMND_ID            | 수요 ID             | STRING    |     |
|    | DMND_TP_NM         | 수요 유형명            | STRING    |     |
|    | DMND_CLASS_NM      | 수요 분류명            | STRING    |     |
| O  | ACCOUNT_CD         | 거래처 코드            | STRING    |     |
| O  | ITEM_CD            | 품목 코드             | STRING    |     |
|    | URGENT_ORDER_TP_NM | 긴급 주문 타입명         | STRING    |     |
| O  | DMND_QTY           | 수요량               | NUMBER    |     |
|    | UOM_CD             | 시간단위              | STRING    |     |
| O  | DUE_DATE           | 납기일               | DATE      |     |
|    | PST                | 계획 시작 가능일         | DATE      |     |
|    | DUE_DATE_FNC       | 납기 제한일            | DATE      |     |
| O  | REQUEST_SITE_CD    | 출하지 거점 코드         | STRING    |     |
|    | EFFICY             | 효율                | NUMBER    | 100 |
|    | PRIORT             | 수요 우선순위           | NUMBER    |     |
|    | PARTIAL_PLAN_YN    | 분할 계획 여부          | STRING    | 'N'  |
|    | DELIVY_PLAN_POLICY_CD            | 배송 정책 코드          | STRING    |     |
|    | DESCRIP            | 설명                | STRING    |     |
|    | DISPLAY_COLOR      | 간트차트 표시 색상        | STRING    |     |
|    | CREATE_BY          | 생성자               | USER_ID   |     |
|    | CREATE_DTTM        | 생성일시              | NOW       |     |
|    | MODIFY_BY          | 수정자               | USER_ID   |     |
|    | MODIFY_DTTM        | 수정일시              | NOW       |     |


#### DMND_VER_ID
> 수요 버전 ID

#### DMND_ID
> 수요 ID

#### DMND_TP_NM
> 수요 유형명  
> SELECT B.COMN_CD_NM FROM TB_AD_COMN_GRP A INNER JOIN TB_AD_COMN_CODE B ON A.ID = B.SRC_ID WHERE A.GRP_CD = 'DEMAND_TYPE'

#### DMND_CLASS_NM
> 수요 분류명  
> SELECT B.COMN_CD_NM FROM TB_AD_COMN_GRP A INNER JOIN TB_AD_COMN_CODE B ON A.ID = B.SRC_ID WHERE A.GRP_CD = 'DEMAND_CLASS'

#### ACCOUNT_CD
> 거래처 코드  
> `거래처` 화면의 `거래처 코드`로 입력합니다.  
> SELECT ACCOUNT_CD FROM TB_DP_ACCOUNT_MST

#### ITEM_CD
> 품목 코드  
> `품목` 화면의 `품목 코드`로 입력합니다.  
> SELECT ITEM_CD FROM TB_CM_ITEM_MST  

#### URGENT_ORDER_TP_NM
> 긴급 주문 타입명  
> SELECT B.COMN_CD_NM FROM TB_AD_COMN_GRP A INNER JOIN TB_AD_COMN_CODE B ON A.ID = B.SRC_ID WHERE A.GRP_CD = 'URGENT_ORDER_TYPE'

#### DMND_QTY
> 수요량

#### UOM_CD
> 시간단위  
> SELECT UOM_CD FROM TB_CM_UOM WHERE BASE_PLAN_UOM_YN = 'Y

#### DUE_DATE
> 납기일

#### PST
> 계획 시작 가능일

#### DUE_DATE_FNC
> 납기 제한일

#### REQUEST_SITE_CD
> 출하지 거점 코드  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### EFFICY
> 효율

#### PRIORT
> 수요 우선순위

#### PARTIAL_PLAN_YN
> 분할 계획 여부

#### DELIVY_PLAN_POLICY_CD
> 배송 정책 코드  
> SELECT CONF_CD FROM TB_CM_COMM_CONFIG WHERE CONF_GRP_CD = 'CM_BASE_ORD_DELIV_POLICY'

#### DESCRIP
> 설명

#### DISPLAY_COLOR
> 간트차트 표시 색상

#### CREATE_BY
> 생성자

#### CREATE_DTTM
> 생성일

#### MODIFY_BY
> 수정자

#### MODIFY_DTTM
> 수정일시

### 연관 테이블

- TB_CM_DEMAND_OVERVIEW : 공급 주문