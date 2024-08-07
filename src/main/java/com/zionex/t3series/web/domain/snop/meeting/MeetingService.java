package com.zionex.t3series.web.domain.snop.meeting;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.persistence.Transient;

import org.apache.poi.util.StringUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zionex.t3series.util.StringUtils;
import com.zionex.t3series.web.domain.util.calendar.CalendarRepository;
import com.zionex.t3series.web.domain.util.filestorage.FileStorage;
import com.zionex.t3series.web.domain.util.filestorage.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MeetingService {

    private final MeetingQueryRepository meetingQueryRepository;

    private final MeetingMasterRepository meetingMasterRepository;
    private final MeetingMinutesRepository meetingMinutesRepository;
    private final MeetingAttendeeRepository meetingAttendeeRepository;
    private final MeetingAgendaRepository meetingAgendaRepository;
    private final MeetingMenuRepository meetingMenuRepository;
    private final MeetingFileRepository meetingFileRepository;

    private final CalendarRepository calendarRepository;

    private final FileStorageService fileStorageService;

    // 회의록을 작성했던 모든 일자를 불러오기
    public List<MeetingMaster> getMeetingDates() {
        return meetingMasterRepository.findByDelYnOrderByMeetStartDttmAsc("N");
    }

    public String getMeetingId(Timestamp date) {
        MeetingMaster meetingMaster = meetingMasterRepository.findTopByMeetStartDttmAndDelYnOrderByMeetStartDttm(date,
                "N");
        if (meetingMaster == null) {
            return null;
        }

        return meetingMaster.getId();
    }

    // 회의록 조회
    public MeetingMaster getMeeting(String meetId) {
        MeetingMaster meetingMaster = meetingQueryRepository.getMeeting(meetId, "N");

        List<MeetingAgenda> agendas = getMeetingAgenda(meetId);
        List<MeetingAttendee> attendees = getMeetingAttendee(meetId);
        List<MeetingFileInfo> atchFiles = getMeetingFiles(meetId);
        List<MeetingMenu> menus = getMeetingMenu(meetId);

        meetingMaster.setAgenda(agendas);
        meetingMaster.setAttendee(attendees);
        meetingMaster.setFiles(atchFiles);
        meetingMaster.setMenu(menus);
        return meetingMaster;
    }

    // 회의록 저장
    public void saveMeeting(MeetingMaster meetingMaster) {
        // mst 저장 후 id 획득
        String meetId = meetingMasterRepository.save(meetingMaster).getId();

        MeetingMinutes meetingMinutes = new MeetingMinutes();
        meetingMinutes.setMeetId(meetId);

        List<MeetingMinutes> result = meetingQueryRepository.getMeetIssueId(meetId);
        if (result.size() > 0)
            meetingMinutes.setId(result.get(0).getId());

        meetingMinutes.setMinutes(meetingMaster.getMinutes());
        meetingMinutesRepository.save(meetingMinutes);
    }

    // 회의록 전체 삭제
    public void deleteMeeting(String meetId) {
        MeetingMaster meetMaster = meetingMasterRepository.findByIdAndDelYn(meetId, "N");

        meetMaster.setDelYn("Y");
        meetingMasterRepository.save(meetMaster);
        calendarRepository.deleteByMeetId(meetId);
    }

    // 참석자 조회
    public List<MeetingAttendee> getMeetingAttendee(String meetId) {
        return meetingQueryRepository.getMeetingAttendee(meetId);
    }

    // 참석자 저장
    public void saveMeetingAttendee(List<MeetingAttendee> meetingAttendees) {
        String getMeetId = meetingAttendees.get(0).getMeetId();

        meetingAttendeeRepository.saveAll(meetingAttendees);
    }

    // 참석자 삭제
    public void deleteMeetingAttendee(List<MeetingAttendee> meetingAttendees) {
        meetingAttendeeRepository.deleteAll(meetingAttendees);
    }

    // Agenda 조회
    public List<MeetingAgenda> getMeetingAgenda(String meetId) {
        return meetingQueryRepository.getMeetingAgenda(meetId);
    }

    // Agenda 저장
    public void saveMeetingAgenda(List<MeetingAgenda> meetingAgendas) {

        for (int i = 0; i < meetingAgendas.size(); i++) {
            MeetingAgenda meetingAgenda = meetingAgendas.get(i);
            meetingAgendaRepository.save(meetingAgenda);
        }
    }

    // Agenda 삭제
    public void deleteMeetingAgenda(List<MeetingAgenda> meetingAgendas) {
        for (int i = 0; i < meetingAgendas.size(); i++) {
            String agendaId = meetingAgendas.get(i).getId();
            // agenda menu 삭제
            meetingMenuRepository.deleteByAgendaId(agendaId);
            // agenda file 삭제
            meetingFileRepository.deleteByAgendaId(agendaId);
        }

        meetingAgendaRepository.deleteAll(meetingAgendas);
    }

    // 화면 조회
    public List<MeetingMenu> getMeetingMenu(String meetId) {
        return meetingQueryRepository.getMeetingMenu(meetId);
    }

    // 화면 저장
    public void saveMeetingMenu(List<MeetingMenu> meetingMenus) {

        meetingMenuRepository.saveAll(meetingMenus);
    }

    // 화면 삭제
    public void deleteMeetingMenu(List<MeetingMenu> meetingMenus) {
        meetingMenuRepository.deleteAll(meetingMenus);
    }

    // 첨부파일 조회
    public List<MeetingFileInfo> getMeetingFiles(String meetId) {
        return meetingQueryRepository.getMeetingAgendaFiles(meetId);
    }

    // 첨부파일 저장
    public void saveMeetingFile(List<MeetingFile> meetingFiles) {

        meetingFileRepository.saveAll(meetingFiles);
    }

    // 첨부파일 삭제
    public void deleteMeetingFile(List<MeetingFile> meetingFiles) {
        meetingFileRepository.deleteAll(meetingFiles);
    }

    // 이전 회의록 복사
    public void copyMeeting(MeetingMaster source, java.sql.Date targetDt, String postApply,
            List keyCopy, List extraCopy) {

        List<MeetingMaster> targetList = new ArrayList<>();

        if ("Y".equals(postApply)) {
            targetList = meetingMasterRepository
                    .findByMeetStartDttmGreaterThanEqualOrderByMeetStartDttmAsc(
                            new java.sql.Timestamp(targetDt.getTime()));
        } else {
            targetList = meetingMasterRepository
                    .findByMeetStartDttmOrderByMeetStartDttmAsc(new java.sql.Timestamp(targetDt.getTime()));
        }

        boolean agendaCopy = false;
        boolean attendeeCopy = false;
        boolean minuteCopy = false;
        boolean agendaDetailCopy = false;
        boolean menuCopy = false;
        boolean attchCopy = false;

        if (keyCopy.contains("AGENDA"))
            agendaCopy = true;
        if (keyCopy.contains("ATTENDEE"))
            attendeeCopy = true;

        if (extraCopy.contains("CONTENT"))
            minuteCopy = true;
        if (extraCopy.contains("AGENDADETAIL"))
            agendaDetailCopy = true;
        if (extraCopy.contains("MENU"))
            menuCopy = true;
        if (extraCopy.contains("ATTACH"))
            attchCopy = true;

        List<MeetingMinutes> meetMinutes = null;
        List<MeetingAgenda> agendaList = null;
        List<MeetingAttendee> meetAttendee = null;
        List<MeetingMenu> menusList = null;
        List<MeetingFile> fileList = null;

        if (minuteCopy)
            meetMinutes = meetingMinutesRepository.findByMeetId(source.getId());
        if (agendaCopy)
            agendaList = meetingAgendaRepository.findByMeetId(source.getId());

        if (attendeeCopy)
            meetAttendee = meetingAttendeeRepository.findByMeetId(source.getId());

        if (menuCopy)
            menusList = meetingMenuRepository.findByMeetId(source.getId());
        if (attchCopy)
            fileList = meetingFileRepository.findByMeetId(source.getId());

        if (targetList != null) {
            for (int i = 0; i < targetList.size(); i++) {
                MeetingMaster trgt = targetList.get(i);
                copyMeeting(source, trgt, agendaDetailCopy, meetMinutes, agendaList, meetAttendee,
                        menusList, fileList);
            }
        }
    }

    public void copyMeeting(MeetingMaster source, MeetingMaster target,
            boolean agendaDetailCopy,
            List<MeetingMinutes> meetMinutes,
            List<MeetingAgenda> agendaList,
            List<MeetingAttendee> meetAttendee,
            List<MeetingMenu> menusList,
            List<MeetingFile> fileList) {

        target.setMeetSubject(source.getMeetSubject());
        target.setMeetOwnerId(source.getMeetOwnerId());
        // target.setMeetStartDttm(source.getMeetStartDttm()); //수정되면 안됨
        // target.setMeetEndDttm(source.getMeetEndDttm());//수정되면 안됨
        // target.setMailSendYn(source.getMailSendYn());//수정되면 안됨
        // target.setDelYn(source.getDelYn());//수정되면 안됨

        meetingMasterRepository.save(target);

        // 참석자
        if (meetAttendee != null) {
            // 이전 참석자 삭제
            meetingAttendeeRepository.deleteByMeetId(target.getId());

            List<MeetingAttendee> meetAttendeeCopy = new ArrayList<>();
            for (int i = 0; i < meetAttendee.size(); i++) {
                MeetingAttendee srcMeetingAttendee = meetAttendee.get(i);

                MeetingAttendee meetAttendeeCopyRow = new MeetingAttendee();
                meetAttendeeCopyRow.setMeetId(target.getId());
                meetAttendeeCopyRow.setUserId(srcMeetingAttendee.getUserId());
                meetAttendeeCopyRow.setUsername(srcMeetingAttendee.getUsername());
                meetAttendeeCopyRow.setDepartment(srcMeetingAttendee.getDepartment());
                meetAttendeeCopyRow.setBusinessValue(srcMeetingAttendee.getBusinessValue());
                meetAttendeeCopyRow.setEmail(srcMeetingAttendee.getEmail());
                meetAttendeeCopyRow.setPhone(srcMeetingAttendee.getPhone());

                meetAttendeeCopy.add(meetAttendeeCopyRow);
            }
            if (meetAttendeeCopy.size() > 0)
                meetingAttendeeRepository.saveAll(meetAttendeeCopy);
        }

        if (agendaList != null) {

            // 이전 agenda 삭제
            meetingAgendaRepository.deleteByMeetId(target.getId());
            // 이전 agenda 메뉴/파일 삭제
            meetingMenuRepository.deleteByMeetId(target.getId());
            meetingFileRepository.deleteByMeetId(target.getId());

            for (int i = 0; i < agendaList.size(); i++) {

                MeetingAgenda orgAgenda = agendaList.get(i);
                String orgAgendaId = orgAgenda.getId();

                MeetingAgenda newMeetAgendaRow = new MeetingAgenda();

                // agenda는 id를 수동 생성해줘야 한다.
                String newAgendaId = UUID.randomUUID().toString().replace("-", "");
                newMeetAgendaRow.setMeetId(target.getId());
                newMeetAgendaRow.setId(newAgendaId);
                newMeetAgendaRow.setAgendaTitle(orgAgenda.getAgendaTitle());
                newMeetAgendaRow.setSeq(orgAgenda.getSeq());

                if (agendaDetailCopy)
                    newMeetAgendaRow.setAgendaContents(orgAgenda.getAgendaContents());

                meetingAgendaRepository.save(newMeetAgendaRow);

                // 복사할 데이터 조회, 셋팅, 저장 (mune)
                if (menusList != null) {
                    List<MeetingMenu> meetMenu = new ArrayList<>();
                    menusList.forEach(m -> {
                        if (orgAgendaId.equals(m.getAgendaId()))
                            meetMenu.add(m);
                    });

                    List<MeetingMenu> meetMenuCopy = new ArrayList<>();
                    // 데이터가 존재 할 경우 복사
                    if (meetMenu.size() > 0) {
                        for (int j = 0; j < meetMenu.size(); j++) {
                            MeetingMenu orgMeetingMenu = meetMenu.get(j);

                            MeetingMenu meetMenuRow = new MeetingMenu();

                            meetMenuRow.setMeetId(target.getId());
                            meetMenuRow.setAgendaId(newAgendaId);
                            meetMenuRow.setMenuCd(orgMeetingMenu.getMenuCd());
                            meetMenuRow.setMenuNm(orgMeetingMenu.getMenuNm());
                            meetMenuRow.setLinkType(orgMeetingMenu.getLinkType());
                            meetMenuRow.setUrlLink(orgMeetingMenu.getUrlLink());
                            meetMenuRow.setUrlTitle(orgMeetingMenu.getUrlTitle());
                            meetMenuRow.setSeq(orgMeetingMenu.getSeq());

                            meetMenuCopy.add(meetMenuRow);
                        }
                        meetingMenuRepository.saveAll(meetMenuCopy);
                    }
                }

                // 복사할 데이터 조회, 셋팅, 저장 (file)
                if (fileList != null) {
                    List<MeetingFile> meetFile = new ArrayList<>();
                    fileList.forEach(f -> {
                        if (orgAgendaId.equals(f.getAgendaId()))
                            meetFile.add(f);
                    });

                    List<MeetingFile> meetFileCopy = new ArrayList<>();
                    // 데이터가 존재 할 경우 복사
                    if (meetFile.size() > 0) {
                        for (int j = 0; j < meetFile.size(); j++) {
                            MeetingFile orgMeetFile = meetFile.get(j);
                            MeetingFile meetFileRow = new MeetingFile();

                            meetFileRow.setMeetId(target.getId());
                            meetFileRow.setAgendaId(newAgendaId);
                            meetFileRow.setFileStorageId(orgMeetFile.getFileStorageId());
                            meetFileRow.setSeq(orgMeetFile.getSeq());

                            meetFileCopy.add(meetFileRow);
                        }

                        meetingFileRepository.saveAll(meetFileCopy);
                    }
                }
            }
        }

        if (meetMinutes != null) {
            // 이전 데이타 삭제
            meetingMinutesRepository.deleteByMeetId(target.getId());

            List<MeetingMinutes> meetMinutesCopy = new ArrayList<>();

            for (int i = 0; i < meetMinutes.size(); i++) {
                MeetingMinutes meetMinutesRow = new MeetingMinutes();

                meetMinutesRow.setMeetId(target.getId());
                meetMinutesRow.setMinutes(meetMinutes.get(i).getMinutes());

                meetMinutesCopy.add(meetMinutesRow);
            }

            meetingMinutesRepository.saveAll(meetMinutesCopy);
        }
    }

}
