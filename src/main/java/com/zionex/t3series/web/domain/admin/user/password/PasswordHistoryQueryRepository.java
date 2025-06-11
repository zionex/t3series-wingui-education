package com.zionex.t3series.web.domain.admin.user.password;

import static com.zionex.t3series.web.domain.admin.user.QUser.user;
import static com.zionex.t3series.web.domain.admin.user.password.QPasswordHistory.passwordHistory;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PasswordHistoryQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public List<String> findByUsernameAndCount(String username, int count) {
        return jpaQueryFactory
                .select(passwordHistory.password)
                .from(passwordHistory)
                .innerJoin(user)
                .on(passwordHistory.userId.eq(user.id).and(user.username.eq(username)))
                .orderBy(passwordHistory.createDttm.desc())
                .limit(count)
                .fetch();
    }

}
