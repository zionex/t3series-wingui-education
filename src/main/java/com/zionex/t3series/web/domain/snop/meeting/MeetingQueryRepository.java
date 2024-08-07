package com.zionex.t3series.web.domain.snop.meeting;

import static com.zionex.t3series.web.domain.admin.lang.QLangPack.langPack;
import static com.zionex.t3series.web.domain.admin.user.QUser.user;
import static com.zionex.t3series.web.domain.snop.meeting.QMeetingAgenda.meetingAgenda;
import static com.zionex.t3series.web.domain.snop.meeting.QMeetingAttendee.meetingAttendee;
import static com.zionex.t3series.web.domain.snop.meeting.QMeetingFile.meetingFile;
import static com.zionex.t3series.web.domain.snop.meeting.QMeetingMaster.meetingMaster;
import static com.zionex.t3series.web.domain.snop.meeting.QMeetingMenu.meetingMenu;
import static com.zionex.t3series.web.domain.snop.meeting.QMeetingMinutes.meetingMinutes;
import static com.zionex.t3series.web.domain.util.calendar.QCalendar.calendar;
import static com.zionex.t3series.web.domain.util.filestorage.QFileStorage.fileStorage;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zionex.t3series.web.domain.admin.lang.LangPackService;
import com.zionex.t3series.web.domain.util.calendar.Calendar;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MeetingQueryRepository {

        private final JPAQueryFactory jpaQueryFactory;
        private final LangPackService langPackService;

        // 회의록 조회
        public MeetingMaster getMeeting(String meetId, String deleteYn) {
                return jpaQueryFactory
                                .select(Projections.fields(MeetingMaster.class,
                                                meetingMaster.id,
                                                meetingMaster.meetSubject,
                                                meetingMaster.meetOwnerId,
                                                meetingMaster.meetStartDttm,
                                                meetingMaster.meetEndDttm,
                                                meetingMaster.mailSendYn,
                                                meetingMaster.delYn,
                                                meetingMinutes.minutes))
                                .from(meetingMaster)
                                .leftJoin(meetingMinutes)
                                .on(meetingMaster.id.eq(meetingMinutes.meetId))
                                .where(meetingMaster.id.eq(meetId).and(meetingMaster.delYn.eq(deleteYn)))
                                .orderBy(meetingMaster.meetStartDttm.desc())
                                .fetchFirst();
        }

        // 참석자 조회
        public List<MeetingAttendee> getMeetingAttendee(String meetId) {
                return jpaQueryFactory
                                .select(Projections.fields(MeetingAttendee.class,
                                                meetingAttendee.id,
                                                meetingAttendee.meetId,
                                                meetingAttendee.userId,
                                                user.username,
                                                user.displayName,
                                                user.department,
                                                user.email,
                                                user.phone,
                                                user.businessValue,
                                                user.uniqueValue))
                                .from(meetingAttendee)
                                .leftJoin(user).on(meetingAttendee.userId.eq(user.id))
                                .where(meetingAttendee.meetId.eq(meetId))
                                .orderBy(meetingAttendee.userId.desc())
                                .fetch();
        }

        // Agenda 조회
        public List<MeetingAgenda> getMeetingAgenda(String meetId) {
                return jpaQueryFactory
                                .select(Projections.fields(MeetingAgenda.class,
                                                meetingAgenda.id,
                                                meetingAgenda.meetId,
                                                meetingAgenda.seq,
                                                meetingAgenda.agendaTitle,
                                                meetingAgenda.agendaContents))
                                .from(meetingAgenda)
                                .where(meetingAgenda.meetId.eq(meetId))
                                .orderBy(meetingAgenda.seq.asc())
                                .fetch();
        }

        // 화면 조회
        public List<MeetingMenu> getMeetingMenu(String meetId) {
                return jpaQueryFactory
                                .select(Projections.fields(MeetingMenu.class,
                                                meetingMenu.id,
                                                meetingMenu.meetId,
                                                meetingMenu.agendaId,
                                                meetingMenu.menuCd,
                                                meetingMenu.linkType,
                                                meetingMenu.seq,
                                                new CaseBuilder()
                                                                .when(meetingMenu.linkType.eq("O"))
                                                                .then(meetingMenu.urlLink)
                                                                .otherwise(meetingMenu.menuCd)
                                                                .as("urlLink"),
                                                new CaseBuilder()
                                                                .when(meetingMenu.linkType.eq("O"))
                                                                .then(meetingMenu.urlTitle)
                                                                .otherwise(langPack.langValue)
                                                                .as("urlTitle"),
                                                langPack.langValue.as("menuNm")))
                                .from(meetingMenu)
                                .leftJoin(langPack)
                                .on(meetingMenu.menuCd.eq(langPack.langKey)
                                                .and(langPack.langCd.eq(langPackService.getCachedLanguageCode())))
                                .where(meetingMenu.meetId.eq(meetId))
                                // .orderBy(meetingMenu.menuCd.desc())
                                .orderBy(meetingMenu.seq.asc())
                                .fetch();
        }

        // File 조회
        public List<MeetingFileInfo> getMeetingAgendaFiles(String meetId) {
                return jpaQueryFactory
                                .select(Projections.fields(MeetingFileInfo.class,
                                                meetingFile.id,
                                                meetingFile.meetId,
                                                meetingFile.agendaId,
                                                meetingFile.fileStorageId,
                                                meetingFile.seq,
                                                fileStorage.fileName,
                                                fileStorage.fileSize,
                                                fileStorage.fileType))
                                .from(meetingMaster)
                                .innerJoin(meetingFile)
                                .on(meetingMaster.id.eq(meetingFile.meetId))
                                .innerJoin(fileStorage)
                                .on(meetingFile.fileStorageId.eq(fileStorage.id))
                                .where(meetingMaster.id.eq(meetId))
                                .orderBy(meetingFile.seq.asc())
                                .fetch();
        }

        // 회의록 id 조회
        public List<MeetingMinutes> getMeetIssueId(String meetId) {
                return jpaQueryFactory
                                .select(Projections.fields(MeetingMinutes.class,
                                                meetingMinutes.id))
                                .from(meetingMinutes)
                                .where(meetingMinutes.meetId.eq(meetId))
                                .fetch();
        }

        public List<MeetingMaster> getRepeatDate(String schId) {

                List<String> meetIds = getMeetIdBySchId(schId)
                                .stream()
                                .map(Calendar::getMeetId)
                                .collect(Collectors.toList());

                return jpaQueryFactory
                                .select(Projections.fields(MeetingMaster.class,
                                                meetingMaster.id,
                                                meetingMaster.meetSubject,
                                                meetingMaster.meetOwnerId,
                                                meetingMaster.meetStartDttm,
                                                meetingMaster.meetEndDttm,
                                                meetingMaster.mailSendYn,
                                                meetingMaster.delYn))
                                .from(meetingMaster)
                                .where(meetingMaster.id.in(meetIds))
                                .orderBy(meetingMaster.meetStartDttm.asc())
                                .fetch();
        }

        // 해당 일정 id 값 삭제 내부함수
        public List<Calendar> getMeetIdBySchId(String schId) {
                return jpaQueryFactory
                                .select(Projections.fields(Calendar.class,
                                                calendar.id,
                                                calendar.userId,
                                                calendar.categoryId,
                                                calendar.meetId,
                                                calendar.schStartDttm,
                                                calendar.schEndDttm,
                                                calendar.repeatTp))
                                .from(calendar)
                                .where(calendar.schId.eq(schId))
                                .fetch();
        }

        // 해당 일정 id 값 삭제 내부함수
        public List<Calendar> getMeetIdBySchIdSchStartDttm(String schId, java.sql.Timestamp schStartDttm) {
                return jpaQueryFactory
                                .select(Projections.fields(Calendar.class,
                                                calendar.id,
                                                calendar.userId,
                                                calendar.categoryId,
                                                calendar.meetId,
                                                calendar.schStartDttm,
                                                calendar.schEndDttm,
                                                calendar.repeatTp))
                                .from(calendar)
                                .where(calendar.schId.eq(schId)
                                                .and(calendar.schStartDttm.goe(schStartDttm)))
                                .fetch();
        }

        // 해당 일정 id 값 삭제
        public long deleteMeetingMasterBySchId(String schId) {

                List<String> meetIds = getMeetIdBySchId(schId)
                                .stream()
                                .map(Calendar::getMeetId)
                                .collect(Collectors.toList());

                // Meet Mst
                long count = jpaQueryFactory
                                .delete(meetingMaster)
                                .where(meetingMaster.id.in(meetIds))
                                .execute();

                // Meet Attendee
                count = count + jpaQueryFactory
                                .delete(meetingAttendee)
                                .where(meetingAttendee.meetId.in(meetIds))
                                .execute();

                // Meet Agenda
                count = count + jpaQueryFactory
                                .delete(meetingAgenda)
                                .where(meetingAgenda.meetId.in(meetIds))
                                .execute();

                // Meet File
                count = count + jpaQueryFactory
                                .delete(meetingFile)
                                .where(meetingFile.meetId.in(meetIds))
                                .execute();

                // Meet Menu
                count = count + jpaQueryFactory
                                .delete(meetingMenu)
                                .where(meetingMenu.meetId.in(meetIds))
                                .execute();

                // Meet Minute
                count = count + jpaQueryFactory
                                .delete(meetingMinutes)
                                .where(meetingMinutes.meetId.in(meetIds))
                                .execute();

                return count;
        }

        public long deleteMeetingMasterAfter(String schId, java.sql.Timestamp schStartDttm) {

                List<String> meetIds = getMeetIdBySchIdSchStartDttm(schId, schStartDttm)
                                .stream()
                                .map(Calendar::getMeetId)
                                .collect(Collectors.toList());

                // Meet Mst
                long count = jpaQueryFactory
                                .delete(meetingMaster)
                                .where(meetingMaster.id.in(meetIds))
                                .execute();

                // Meet Attendee
                count = count + jpaQueryFactory
                                .delete(meetingAttendee)
                                .where(meetingAttendee.meetId.in(meetIds))
                                .execute();

                // Meet Agenda
                count = count + jpaQueryFactory
                                .delete(meetingAgenda)
                                .where(meetingAgenda.meetId.in(meetIds))
                                .execute();

                // Meet File
                count = count + jpaQueryFactory
                                .delete(meetingFile)
                                .where(meetingFile.meetId.in(meetIds))
                                .execute();

                // Meet Menu
                count = count + jpaQueryFactory
                                .delete(meetingMenu)
                                .where(meetingMenu.meetId.in(meetIds))
                                .execute();

                // Meet Minute
                count = count + jpaQueryFactory
                                .delete(meetingMinutes)
                                .where(meetingMinutes.meetId.in(meetIds))
                                .execute();

                return count;
        }

}
