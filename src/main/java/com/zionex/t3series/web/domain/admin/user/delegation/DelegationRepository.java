package com.zionex.t3series.web.domain.admin.user.delegation;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

public interface DelegationRepository extends CrudRepository<Delegation, String> {

    List<Delegation> findByDelegationUserId(String delegationUserId);

    Delegation findByUserIdAndDelegationUserId(String userId, String delegationUserId);

    boolean existsByUserIdAndDelegationUserId(String userId, String delegationUserId);

    @Transactional
    void deleteByUserIdOrDelegationUserId(String userId, String delegationUserId);

    @Transactional
    void deleteByUserIdAndDelegationUserId(String userId, String delegationUserId);

}
