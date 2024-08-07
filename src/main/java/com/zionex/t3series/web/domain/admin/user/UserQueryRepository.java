package com.zionex.t3series.web.domain.admin.user;

import static com.zionex.t3series.web.domain.admin.user.QUser.user;
import static com.zionex.t3series.web.domain.admin.user.authority.QAuthority.authority1;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.StringPath;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.jpa.impl.JPAUpdateClause;
import com.zionex.t3series.web.domain.admin.user.group.QUserGroup;
import com.zionex.t3series.web.domain.admin.user.group.UserGroup;
import com.zionex.t3series.web.domain.admin.user.group.UserGroupQueryRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserQueryRepository {

    private final UserGroupQueryRepository userGroupQueryRepository;
    QUserGroup userGroup = QUserGroup.userGroup;

    private final JPAQueryFactory jpaQueryFactory;

    public List<User> getUsers(String username, String displayName, String uniqueValue, String department) {
        return jpaQueryFactory
                .select(Projections.fields(User.class,
                        user.id,
                        user.username,
                        user.displayName,
                        user.department,
                        user.businessValue,
                        user.uniqueValue,
                        user.email,
                        user.phone,
                        user.address,
                        user.etc,
                        user.enabled,
                        user.passwordExpired,
                        user.loginFailCount,
                        new CaseBuilder()
                                .when(authority1.authority.isNull())
                                .then(false)
                                .otherwise(true).as("adminYn")))
                .from(user)
                .leftJoin(authority1).on(user.id.eq(authority1.userId).and(authority1.authority.eq("ADMIN")))
                .where(containsParam(user.username, username),
                        containsParam(user.displayName, displayName),
                        containsParam(user.uniqueValue, uniqueValue),
                        containsParam(user.department, department))
                .fetch();
    }

    @Transactional
    public void updateUser(User updateUser) {
        JPAUpdateClause clause = jpaQueryFactory
                .update(user)
                .where(user.username.eq(updateUser.getUsername()));

        if (updateUser.getEnabled() != null) {
            clause.set(user.enabled, updateUser.getEnabled());
        }

        if (updateUser.getLoginFailCount() != null) {
            clause.set(user.loginFailCount, 0);
        }

        if (updateUser.getSessionExpiredDttm() != null) {
            clause.set(user.sessionExpiredDttm, updateUser.getSessionExpiredDttm());
        }

        if (updateUser.getPasswordExpired() != null) {
            clause.set(user.passwordExpired, updateUser.getPasswordExpired());
        }

        if (updateUser.getJti() != null) {
            clause.set(user.jti, updateUser.getJti());
        }

        clause.execute();
    }

    @Transactional
    public void updateLoginFailCount(String username) {
        jpaQueryFactory
                .update(user)
                .set(user.loginFailCount, user.loginFailCount.add(1))
                .where(user.username.eq(username))
                .execute();
    }

    private BooleanExpression containsParam(StringPath stringPath, String param) {
        if (StringUtils.isEmpty(param)) {
            return null;
        }
        return stringPath.toUpperCase().contains(param.toUpperCase());
    }

    public List<User> getUsersByGroupCd(String grpId, String username, String displayName) {
        BooleanBuilder builder = new BooleanBuilder();

        if (grpId != null && !grpId.isEmpty()) {
            List<String> userIds = userGroupQueryRepository.getUserIdByGrpId(grpId)
                    .stream()
                    .map(UserGroup::getUserId)
                    .collect(Collectors.toList());
            builder.and(user.id.in(userIds));
        }

        if (username != null && !username.isEmpty()) {
            builder.and(user.username.contains(username));
        }

        if (displayName != null && !displayName.isEmpty()) {
            builder.and(user.displayName.contains(displayName));
        }

        return jpaQueryFactory
                .select(Projections.fields(User.class,
                        user.id,
                        user.username,
                        user.displayName,
                        user.department,
                        user.businessValue,
                        user.uniqueValue,
                        user.email,
                        user.phone,
                        user.address,
                        user.etc,
                        user.enabled,
                        user.passwordExpired,
                        user.loginFailCount))
                .from(user)
                .where(builder)
                .fetch();
    }

}
