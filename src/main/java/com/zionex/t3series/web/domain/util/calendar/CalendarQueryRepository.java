package com.zionex.t3series.web.domain.util.calendar;

import static com.zionex.t3series.web.domain.admin.user.QUser.user;
import static com.zionex.t3series.web.domain.admin.user.group.QGroup.group;
import static com.zionex.t3series.web.domain.admin.user.group.QUserGroup.userGroup;
import static com.zionex.t3series.web.domain.util.calendar.QCalendar.calendar;
import static com.zionex.t3series.web.domain.util.calendar.QCalendarCategory.calendarCategory;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CalendarQueryRepository {

        private final JPAQueryFactory jpaQueryFactory;

        public List<Calendar> getCalendar(String userId) {
                List<String> categoryIds = getCalendarCategory(userId)
                                .stream()
                                .map(CalendarCategory::getId)
                                .collect(Collectors.toList());

                List<String> exceptIds = jpaQueryFactory.select(calendar.id)
                                        .from(calendar)
                                        .innerJoin(calendarCategory)
                                        .on(calendar.categoryId.eq(calendarCategory.id))
                                        .where(calendarCategory.categoryNm.eq("MY_CALENDAR").and(calendar.userId.notEqualsIgnoreCase(userId)))
                                        .fetch();                            
                
                return jpaQueryFactory.select(Projections.fields(Calendar.class,
                                calendar.id,
                                calendar.userId,
                                calendar.categoryId,
                                calendarCategory.categoryNm,
                                calendarCategory.categoryColor,
                                calendar.schId,
                                calendar.schNm,
                                calendar.meetId,
                                calendar.schStartDttm,
                                calendar.schEndDttm,
                                calendar.fullDayYn,
                                calendar.repeatTp,
                                calendar.memo,
                                calendar.userId.when(userId).then("Y")
                                                .otherwise("N").as("canDeleteYn")))
                                .from(calendar)
                                .innerJoin(calendarCategory)
                                .on(calendar.categoryId.eq(calendarCategory.id))
                                .where(calendar.categoryId.in(categoryIds).and(calendar.id.notIn(exceptIds)))
                                .fetch();
        }

        public List<Calendar> findCalendarsByMeetIdEqSchId(String meetId) {
                return jpaQueryFactory.select(calendar)
                        .from(calendar)
                        .where(calendar.schId.eq(
                                jpaQueryFactory.select(calendar.schId)
                                        .from(calendar)
                                        .where(calendar.meetId.eq(meetId))
                        ))
                        .fetch();
            }

        public List<Calendar> findCalendarsByDateAfterMeetIdEqSchId(java.sql.Timestamp schStartDttm, String meetId) {
                return jpaQueryFactory.select(calendar)
                        .from(calendar)
                        .where(calendar.schId.eq(
                                jpaQueryFactory.select(calendar.schId)
                                        .from(calendar)
                                        .where(calendar.meetId.eq(meetId))
                        ).and(calendar.schStartDttm.goe(schStartDttm)))
                        .fetch();
        }

        public List<CalendarCategory> getCalendarCategory(String userId) {
                return jpaQueryFactory
                                .select(Projections.fields(CalendarCategory.class,
                                                calendarCategory.id,
                                                calendarCategory.userId,
                                                calendarCategory.categoryNm,
                                                calendarCategory.categoryColor,
                                                calendarCategory.useYn,
                                                calendarCategory.userId.when(userId).then("Y")
                                                                .otherwise("N").as("canDeleteYn")))
                                .from(calendarCategory)
                                .where((calendarCategory.userId.eq(userId)
                                                .or(calendarCategory.userId.isNull())
                                                .or(calendarCategory.grpShareYn.eq(true).and(
                                                                jpaQueryFactory.selectFrom(group).rightJoin(userGroup)
                                                                                .on(group.id.eq(userGroup.grpId))
                                                                                .rightJoin(user)
                                                                                .on(user.id.eq(userGroup.userId))
                                                                                .where(group.id.in(jpaQueryFactory
                                                                                                .select(userGroup.grpId)
                                                                                                .from(userGroup)
                                                                                                .innerJoin(calendarCategory)
                                                                                                .on(userGroup.userId.eq(
                                                                                                                calendarCategory.userId))
                                                                                                .fetch())
                                                                                                .and(group.grpCd.notEqualsIgnoreCase(
                                                                                                                "DEFAULT")
                                                                                                                .and(userGroup.userId
                                                                                                                                .eq(userId))))
                                                                                .exists())))
                                                .and(calendarCategory.useYn.eq(true)))
                                                .orderBy(new CaseBuilder()
                                                                .when(calendarCategory.categoryNm.eq("MY_CALENDAR"))
                                                                .then(0)
                                                                .otherwise(1)
                                                                .asc())
                                .fetch();
        }

        public List<Calendar> getRepeatDate(String username, String categoryId, String schId) {
                return jpaQueryFactory
                                .select(Projections.fields(Calendar.class,
                                                calendar.id,
                                                calendar.userId,
                                                calendar.categoryId,
                                                calendar.schStartDttm,
                                                calendar.schEndDttm,
                                                calendar.repeatTp,
                                                calendar.memo,
                                                calendar.meetId))
                                .from(calendar)
                                .leftJoin(user)
                                .on(calendar.userId.eq(user.id))
                                .where(calendar.categoryId.eq(categoryId)
                                                .and(calendar.schId.eq(schId)))
                                .orderBy(calendar.schStartDttm.asc())
                                .fetch();
        }

        public long deleteCalendarAfter(String userId, String categoryId, String schId, String id,
                        java.sql.Timestamp schStartDttm) {
                long count = jpaQueryFactory
                                .delete(calendar)
                                .where(calendar.categoryId.eq(categoryId)
                                                .and(calendar.schId.eq(schId))
                                                .and(calendar.userId.eq(userId))
                                                .and(calendar.schEndDttm.goe(schStartDttm)))
                                .execute();
                return count;
        }
        
        // public List<Calendar> getMeetIdBySchId(String schId) {
        //         return jpaQueryFactory
        //                         .select(Projections.fields(Calendar.class,
        //                                         calendar.id,
        //                                         calendar.userId,
        //                                         calendar.categoryId,
        //                                         calendar.schStartDttm,
        //                                         calendar.schEndDttm,
        //                                         calendar.repeatTp))
        //                         .from(calendar)
        //                         .where(calendar.schId.eq(schId))
        //                         .fetch();
        // }
}
