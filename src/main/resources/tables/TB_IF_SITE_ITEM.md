### 개요
    거점 품목 정보를 인터페이스 하여 IM/RP/MP 거점 품목 정보를 일괄로 등록합니다.  
    `TB_IF_SITE_ITEM` 테이블에 저장 시 거점 품목, 글로벌 생산 BOM 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다. 

### 관련 화면
- 데이터 통합 > 공급망 네트워크 > [거점 품목](#/dataintegration/network/siteitem)
- 데이터 통합 > 공급망 네트워크 > [글로벌 생산 BOM](#/dataintegration/network/productionbom)

### 작업 테이블 정보

- #### TB_IF_SITE_ITEM

| 필수 | 물리명                                          | 논리명                   | 형식      | 기본값        | 
|:--:|:-------------------------------------------------|:------------------------|:----------|:-------------:|
| O  | LOCAT_CD                                         | 거점 코드                | STRING    |               |
| O  | ITEM_CD                                          | 품목 코드                | STRING    |               |
|    | EXCEPT_BOM                                       | BOM 모델링 제외 여부      | STRING    | N             |
|    | DIRECT_COST                                      | 직접비                   | NUMBER    |               |
|    | INDIRECT_COST                                    | 간접비                   | NUMBER    |               |
|    | CURCY_CD                                         | 통화 코드                | STRING    |               |
|    | CREATE_BY                                        | 생성자                   | USER_ID   |               |
|    | CREATE_DTTM                                      | 생성일시                 | NOW       |               |
|    | MODIFY_BY                                        | 수정자                   | USER_ID   |               |
|    | MODIFY_DTTM                                      | 수정일시                 | NOW       |               |


#### LOCAT_CD
> 거점 코드  
> `거점` 화면의 `거점 코드`로 입력합니다.  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### ITEM_CD
> 품목 코드   
> `품목` 화면의 `품목 코드`로 입력합니다.  
> SELECT ITEM_CD FROM TB_CM_ITEM_MST  

#### EXCEPT_BOM
> BOM 모델링 제외 여부   


#### DIRECT_COST
> 직접비  

#### INDIRECT_COST
> 간접비  

#### CURCY_CD
> 통화 코드
> `TB_AD_COMN_GRP` 테이블의 GRP_CD는 `CURRENCY` 인 `TB_AD_COMN_CODE` 테이블의 `COMN_CD` 컬럼의 값입니다.    
> 데이터 예시 입니다. (ex : KRW | USD)  
> SELECT A.COMN_CD FROM TB_AD_COMN_CODE A, TB_AD_COMN_GRP B WHERE B.ID = A.SRC_ID AND B.GRP_CD = 'CURRENCY'

#### CREATE_BY
> 생성자

#### CREATE_DTTM
> 생성일

#### MODIFY_BY
> 수정자

#### MODIFY_DTTM
> 수정일시

### 연관 테이블

- TB_CM_SITE_ITEM : 거점 품목
- TB_CM_GLOBAL_BOM_MST : 글로벌 생산 BOM Master
- TB_CM_GLOBAL_BOM_DTL : 글로벌 생산 BOM Detail
