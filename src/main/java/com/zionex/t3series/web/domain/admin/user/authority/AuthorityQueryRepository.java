package com.zionex.t3series.web.domain.admin.user.authority;

import static com.zionex.t3series.web.domain.admin.user.QUser.user;
import static com.zionex.t3series.web.domain.admin.user.authority.QAuthority.authority1;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AuthorityQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public boolean existsByUserAndAuthority(String username, String authority) {
        Integer result = jpaQueryFactory
                .selectOne()
                .from(user)
                .innerJoin(authority1)
                .on(user.id.eq(authority1.userId).and(authority1.authority.eq("ADMIN")))
                .where(user.username.eq(username))
                .fetchFirst();

        return (result != null);
    }

    public List<String> getAuthorities(String username) {
        return jpaQueryFactory
                .select(authority1.authority)
                .from(authority1)
                .innerJoin(user)
                .on(authority1.userId.eq(user.id).and(user.username.eq(username)))
                .fetch();
    }

}
