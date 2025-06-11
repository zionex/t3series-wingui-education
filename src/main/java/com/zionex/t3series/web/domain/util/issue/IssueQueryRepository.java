package com.zionex.t3series.web.domain.util.issue;

import static com.zionex.t3series.web.domain.util.issue.QIssue.issue;
import static com.zionex.t3series.web.domain.util.issue.QIssueAssign.issueAssign;
import static com.zionex.t3series.web.domain.snop.meeting.QMeetingIssue.meetingIssue;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class IssueQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    enum PriorityType {

        L("L"),
        M("M"),
        H("H");

        private String priority;

        private PriorityType(String priority) {
            this.priority = priority;
        }

        public String getPriority() {
            return priority;
        }

    }

    public Page<Issue> getIssueCertainList(Pageable pageable) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dateAfter15 = now.minusDays(15);

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(issue.publicYn.eq("Y"));
        builder.and(issue.status.eq("O"));
        builder.and(issue.createDttm.gt(dateAfter15).or(issue.priority.eq(PriorityType.H.name())));

        List<Issue> list = jpaQueryFactory
                .select(Projections.fields(Issue.class,
                        issue.id,
                        issue.title,
                        issue.content,
                        issue.startDttm,
                        issue.endDttm,
                        issue.priority,
                        issue.status,
                        issue.createBy,
                        issue.createDttm,
                        issue.modifyBy,
                        issue.modifyDttm,
                        issue.menuCd,
                        issue.publicYn,
                        issue.mailYn,
                        issue.issueType))
                .from(issue)
                .where(builder)
                .orderBy(issue.status.desc())
                .orderBy(issue.modifyDttm.coalesce(issue.createDttm).desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long count = jpaQueryFactory
                .select(issue.count())
                .from(issue)
                .where(builder)
                .fetchOne();

        return new PageImpl<>(list, pageable, count);
    }

    public BooleanExpression existAssignee(String username) {
        return JPAExpressions.selectOne()
                .from(issueAssign)
                .where(issueAssign.issueId.eq(issue.id)
                        .and(issueAssign.assignee.like("%" + username + "%")))
                        //.and(issueAssign.assignee.eq(username)))
                .exists();
    }

    public Page<Issue> getIssuesByUser(String menuCd, String username, Pageable pageable) {
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(issue.menuCd.eq(menuCd).or(issue.menuCd.eq("COMMON")));
        builder.and(issue.publicYn.eq("Y").or(existAssignee(username)).or(issue.createBy.eq(username)));
        builder.and(issue.status.eq("O"));

        List<Issue> list = jpaQueryFactory
                .select(Projections.fields(Issue.class,
                        issue.id,
                        issue.title,
                        issue.content,
                        issue.startDttm,
                        issue.endDttm,
                        issue.priority,
                        issue.status,
                        issue.createBy,
                        issue.createDttm,
                        issue.modifyBy,
                        issue.modifyDttm,
                        issue.menuCd,
                        issue.publicYn,
                        issue.mailYn,
                        issue.issueType))
                .from(issue)
                .where(builder)
                .orderBy(issue.modifyDttm.coalesce(issue.createDttm).desc(), issue.priority.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long count = jpaQueryFactory
                .select(issue.count())
                .from(issue)
                .where(builder)
                .fetchOne();

        return new PageImpl<>(list, pageable, count);
    }

    public Long getIssueCount(String menuCd, String username) {
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(issue.menuCd.eq(menuCd).or(issue.menuCd.eq("COMMON")));
        builder.and(issue.publicYn.eq("Y").or(existAssignee(username)).or(issue.createBy.eq(username)));
        builder.and(issue.status.eq("O"));

        Long count = jpaQueryFactory
                .select(issue.count())
                .from(issue)
                .where(builder)
                .fetchOne();

        return count;
    }

    public Page<Issue> getIssues(int searchOpt, String searchString, String menuCd, Boolean isAssigned, String status,
                                 String after15days, String username, boolean isAdmin, String issueType, Pageable pageable) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dateAfter15 = now.minusDays(15);

        BooleanBuilder builder = new BooleanBuilder();
        if (!StringUtils.isEmpty(menuCd)) {
            builder.and(issue.menuCd.eq(menuCd));
        }
        if (!StringUtils.isEmpty(status)) {
            builder.and(issue.status.eq(status));
        }
        if (!StringUtils.isEmpty(after15days)) {
            builder.and(issue.createDttm.gt(dateAfter15));
        }
        if (!StringUtils.isEmpty(issueType)) {
            builder.and(issue.issueType.eq(issueType));
        }

        if (isAssigned == null) {
            if (!isAdmin) {
                builder.and(issue.publicYn.eq("Y").or(existAssignee(username)).or(issue.createBy.eq(username)));
            }
        } else {
            BooleanBuilder orBuilder = new BooleanBuilder();
            if (isAssigned) {
                orBuilder.or(existAssignee(username));
            } else {
                orBuilder.or(issue.createBy.eq(username));
            }

            builder.and(orBuilder);
        }

        BooleanExpression exp = containsParamOpt(searchOpt, searchString);
        if (exp != null) {
            builder.and(exp);
        }

        List<Issue> list = jpaQueryFactory
                .select(Projections.fields(Issue.class,
                        issue.id,
                        issue.title,
                        issue.content,
                        issue.startDttm,
                        issue.endDttm,
                        issue.priority,
                        issue.status,
                        issue.createBy,
                        issue.createDttm,
                        issue.modifyBy,
                        issue.modifyDttm,
                        issue.menuCd,
                        issue.publicYn,
                        issue.mailYn,
                        issue.grpAssignYn,
                        issue.issueType))
                .from(issue)
                .where(builder)
                .orderBy(issue.status.desc())
                .orderBy(new CaseBuilder()
                    .when(issue.priority.eq("H")).then(0)
                    .when(issue.priority.eq("M")).then(1)
                    .otherwise(2).asc())
                .orderBy(issue.modifyDttm.coalesce(issue.createDttm).desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long count = jpaQueryFactory
                .select(issue.count())
                .from(issue)
                .where(builder)
                .fetchOne();

        return new PageImpl<>(list, pageable, count);
    }

    public Page<Issue> getIssuesMeet(int searchOpt, String searchString, String menuCd, Boolean isAssigned, String status,
                                 String after15days, String meetId, String username, boolean isAdmin, String issueType, Pageable pageable) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dateAfter15 = now.minusDays(15);

        BooleanBuilder builder = new BooleanBuilder();
        if (!StringUtils.isEmpty(menuCd)) {
            builder.and(issue.menuCd.eq(menuCd));
        }
        if (!StringUtils.isEmpty(status)) {
            builder.and(issue.status.eq(status));
        }
        if (!StringUtils.isEmpty(after15days)) {
            builder.and(issue.createDttm.gt(dateAfter15));
        }
        if (!StringUtils.isEmpty(meetId)) {
            builder.and(meetingIssue.meetId.eq(meetId));
        }
        if (!StringUtils.isEmpty(issueType)) {
            builder.and(issue.issueType.eq(issueType));
        }

        if (isAssigned == null) {
            if (!isAdmin) {
                builder.and(issue.publicYn.eq("Y").or(existAssignee(username)).or(issue.createBy.eq(username)));
            }
        } else {
            BooleanBuilder orBuilder = new BooleanBuilder();
            if (isAssigned) {
                orBuilder.or(existAssignee(username));
            } else {
                orBuilder.or(issue.createBy.eq(username));
            }

            builder.and(orBuilder);
        }

        BooleanExpression exp = containsParamOpt(searchOpt, searchString);
        if (exp != null) {
            builder.and(exp);
        }

        List<Issue> list = jpaQueryFactory
                .select(Projections.fields(Issue.class,
                        issue.id,
                        issue.title,
                        issue.content,
                        issue.startDttm,
                        issue.endDttm,
                        issue.priority,
                        issue.status,
                        issue.createBy,
                        issue.createDttm,
                        issue.modifyBy,
                        issue.modifyDttm,
                        issue.menuCd,
                        issue.publicYn,
                        issue.mailYn,
                        issue.grpAssignYn,
                        issue.issueType))
                .from(issue)
                .innerJoin(meetingIssue)
                .on(issue.id.eq(meetingIssue.issueId))
                .where(builder)
                .orderBy(issue.status.desc())
                .orderBy(new CaseBuilder()
                    .when(issue.priority.eq("H")).then(0)
                    .when(issue.priority.eq("M")).then(1)
                    .otherwise(2).asc())
                .orderBy(issue.modifyDttm.coalesce(issue.createDttm).desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long count = jpaQueryFactory
                .select(issue.count())
                .from(issue)
                .innerJoin(meetingIssue)
                .on(issue.id.eq(meetingIssue.issueId))
                .where(builder)
                .fetchOne();

        return new PageImpl<>(list, pageable, count);
    }

    private static final int TITLE_SEARCH = 1;
    private static final int CONTENT_SEARCH = 2;

    private BooleanExpression containsParamOpt(int searchOpt, String searchString) {
        if (StringUtils.isEmpty(searchString)) {
            return null;
        }
        if (searchOpt == TITLE_SEARCH) {
            return issue.title.contains(searchString);
        } else if (searchOpt == CONTENT_SEARCH) {
            return issue.content.contains(searchString);
        } else {
            return issue.title.contains(searchString).or(issue.content.contains(searchString));
        }
    }

}
