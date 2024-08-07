package com.zionex.t3series.web.domain.admin.user.authority;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface AuthorityRepository extends JpaRepository<Authority, String> {

    List<Authority> findByUserId(String userId);

    boolean existsByUserIdAndAuthority(String userId, String authority);

    @Transactional
    void deleteByUserIdIn(List<String> userIds);

    @Transactional
    void deleteByUserIdAndAuthority(String userId, String authority);

}
