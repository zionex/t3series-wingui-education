package com.zionex.t3series.web.domain.admin.theme;

import static com.zionex.t3series.web.domain.admin.theme.QThemeDetail.themeDetail;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.StringPath;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ThemeDetailQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    private static final String COMMON = "COMMON";

    public List<ThemeDetail> getThemes(String themeCd) {
        return jpaQueryFactory
                .select(themeDetail)
                .from(themeDetail)
                .where(themeDetail.themeCd.in(themeCd, COMMON))
                .fetch();
    }

    public List<ThemeDetail> getCategory() {
        return jpaQueryFactory
                .select(Projections.fields(ThemeDetail.class,
                        themeDetail.category))
                .from(themeDetail)
                .groupBy(themeDetail.category)
                .fetch();
    }

    public List<ThemeDetail> getThemeCd() {
        return jpaQueryFactory
                .select(Projections.fields(ThemeDetail.class,
                        themeDetail.themeCd))
                .from(themeDetail)
                .groupBy(themeDetail.themeCd)
                .fetch();
    }

    public List<ThemeDetail> getThemeDetails(String themeCd, String category, String propType) {

        return jpaQueryFactory
                .select(Projections.fields(ThemeDetail.class,
                        themeDetail.id,
                        themeDetail.themeCd,
                        themeDetail.referCd,
                        themeDetail.category,
                        themeDetail.propType,
                        themeDetail.propKey,
                        themeDetail.propValue,
                        themeDetail.descrip,
                        themeDetail.defaultYn,
                        new CaseBuilder()
                                .when(themeDetail.themeCd.eq("COMMON"))
                                .then(true)
                                .otherwise(false)
                                .as("commonYn"),
                        new CaseBuilder()
                                .when(themeDetail.category.eq("palette").and(themeDetail.propType.eq("color")))
                                .then(true)
                                .otherwise(false)
                                .as("editYn")))
                .from(themeDetail)
                .where(themeDetail.themeCd.in(themeCd, COMMON),
                        containsParam(themeDetail.category, category),
                        containsParam(themeDetail.propType, propType),
                        themeDetail.category.notEqualsIgnoreCase("palette-base"))
                .orderBy(themeDetail.referCd.asc())
                .fetch();
    }

    private BooleanExpression containsParam(StringPath stringPath, String param) {
        if (StringUtils.isEmpty(param)) {
            return null;
        }
        return stringPath.toUpperCase().contains(param.toUpperCase());
    }

    @Transactional
    public long deleteThemeDetails(String themeCd, String category, String propType, String propkey) {
        BooleanBuilder whereClause = new BooleanBuilder();

        if (themeCd != null) {
            whereClause.and(themeDetail.themeCd.eq(themeCd));
        }
        if (category != null) {
            whereClause.and(themeDetail.category.eq(category));
        }
        if (propType != null) {
            whereClause.and(themeDetail.propType.eq(propType));
        }
        if (propkey != null) {
            whereClause.and(themeDetail.propKey.eq(propkey));
        }

        return jpaQueryFactory
                .delete(themeDetail)
                .where(whereClause)
                .execute();
    }

}
