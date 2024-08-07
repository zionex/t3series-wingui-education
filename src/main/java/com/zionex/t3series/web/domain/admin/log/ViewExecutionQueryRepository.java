package com.zionex.t3series.web.domain.admin.log;

import static com.zionex.t3series.web.domain.admin.lang.QLangPack.langPack;
import static com.zionex.t3series.web.domain.admin.log.QViewExecution.viewExecution;
import static com.zionex.t3series.web.domain.admin.user.QUser.user;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.StringPath;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zionex.t3series.web.domain.admin.lang.LangPackService;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ViewExecutionQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    private final LangPackService langPackService;

    public Page<ViewExecution> getViewExecutionLog(LocalDateTime startDttm, LocalDateTime endDttm, String menuCd, String menuNm, String username, Pageable pageable) {
        List<ViewExecution> results = jpaQueryFactory
                .select(Projections.fields(ViewExecution.class,
                        viewExecution.id,
                        user.username,
                        viewExecution.userIp,
                        viewExecution.userBrowser,
                        viewExecution.viewCd,
                        langPack.langValue.as("viewNm"),
                        viewExecution.executionDttm,
                        viewExecution.modifyDttm))
                .from(viewExecution)
                .innerJoin(user)
                .on(viewExecution.user.id.eq(user.id))
                .fetchJoin()
                .leftJoin(langPack).on(viewExecution.viewCd.eq(langPack.langKey)
                        .and(langPack.langCd.eq(langPackService.getCachedLanguageCode())))
                .where(viewExecution.executionDttm.between(startDttm, endDttm),
                        containsParam(viewExecution.viewCd, menuCd),
                        containsParam(langPack.langValue, menuNm),
                        containsParam(user.username, username))
                .orderBy(viewExecution.executionDttm.asc(), viewExecution.id.asc(), viewExecution.user.id.asc(),
                        viewExecution.viewCd.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = jpaQueryFactory
                .selectFrom(viewExecution)
                .innerJoin(user)
                .on(viewExecution.user.id.eq(user.id))
                .leftJoin(langPack).on(viewExecution.viewCd.eq(langPack.langKey)
                        .and(langPack.langCd.eq(langPackService.getCachedLanguageCode())))
                .where(viewExecution.executionDttm.between(startDttm, endDttm),
                        containsParam(viewExecution.viewCd, menuCd),
                        containsParam(langPack.langValue, menuNm),
                        containsParam(user.username, username))
                .fetchCount();

        return new PageImpl<>(results, pageable, total);
    }

    private BooleanExpression containsParam(StringPath stringPath, String param) {
        if (StringUtils.isEmpty(param)) {
            return null;
        }
        return stringPath.toUpperCase().contains(param.toUpperCase());
    }

}
