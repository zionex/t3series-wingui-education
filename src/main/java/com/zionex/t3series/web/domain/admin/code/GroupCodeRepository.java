package com.zionex.t3series.web.domain.admin.code;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface GroupCodeRepository extends JpaRepository<GroupCode, String> {

    GroupCode findByGrpCdAndUseYn(String grpCd, Boolean useYn);

    GroupCode findByGrpCd(String grcCd);

    List<GroupCode> findByGrpCdContainingAndGrpNmContainingOrderByGrpCd(String grpCd, String grpNm);

    @Transactional
    void deleteByIdIn(List<String> ids);

}
