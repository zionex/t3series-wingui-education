### 개요
    수요 출하지 매핑 정보를 인터페이스 하여 수요 출하지 정보를 일괄로 등록합니다.
    `TB_IF_DMND_SHPP_MAP` 테이블에 저장 시 수요 출하지 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다. 

### 관련 화면
- 데이터 통합 > 공급망 네트워크 > [수요 출하지](#/dataintegration/network/demandmapping)

### 작업 테이블 정보

- #### TB_IF_DMND_SHPP_MAP

| 필수 | 물리명         | 논리명    | 형식      |     기본값      | 
|:--:|:------------|:-------|:----------|:------------:|
| O  | ITEM_CD     | 품목 코드  | STRING    |              |
| O  | ACCOUNT_CD  | 거래처 코드 | STRING    |              |
| O  | LOCAT_CD    | 거점 코드  | STRING    |              |
|    | CREATE_BY   | 생성자    | USER_ID   |              |
|    | CREATE_DTTM | 생성일시   | NOW       |              |
|    | MODIFY_BY   | 수정자    | USER_ID   |              |
|    | MODIFY_DTTM | 수정일시   | NOW       |              |


#### ITEM_CD
> 품목 코드  
> `품목` 화면의 `품목 코드`로 입력합니다.  
> SELECT ITEM_CD FROM TB_CM_ITEM_MST

#### ACCOUNT_CD
> 거래처 코드  
> `거래처` 화면의 `거래처 코드`로 입력합니다.  
> SELECT ACCOUNT_CD FROM TB_DP_ACCOUNT_MST

#### LOCAT_CD
> 거점 코드  
> `거점` 화면의 `거점 코드`로 입력합니다.  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### CREATE_BY
> 생성자

#### CREATE_DTTM
> 생성일

#### MODIFY_BY
> 수정자

#### MODIFY_DTTM
> 수정일시

### 연관 테이블

- TB_CM_DMND_SHPP_MAP_MST : 수요 출하지