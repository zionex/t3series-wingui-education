package com.zionex.t3series.web.domain.snop.meeting;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zionex.t3series.web.domain.util.calendar.Calendar;
import com.zionex.t3series.web.domain.util.calendar.CalendarQueryRepository;
import com.zionex.t3series.web.domain.util.calendar.CalendarRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MeetingService {

    private final MeetingQueryRepository meetingQueryRepository;
    private final CalendarQueryRepository calendarQueryRepository;

    private final MeetingMasterRepository meetingMasterRepository;
    private final MeetingMinutesRepository meetingMinutesRepository;
    private final MeetingAttendeeRepository meetingAttendeeRepository;
    private final MeetingAgendaRepository meetingAgendaRepository;
    private final MeetingMenuRepository meetingMenuRepository;
    private final MeetingFileRepository meetingFileRepository;

    private final CalendarRepository calendarRepository;

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

    public Boolean isRepeatType(String meetId) {
        Calendar calendar = calendarRepository.findBymeetId(meetId);
        return calendar.getRepeatTp().equals("") ? false : true;
    }

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
        Calendar calendar = calendarRepository.findBymeetId(meetId);
        meetingMaster.setCategoryId(calendar.getCategoryId());

        return meetingMaster;
    }

    public void saveMeeting(String rangeTp, MeetingMaster meeting) {
        String meetId = meeting.getId();

        if (rangeTp.equals("") || rangeTp.equals("selected")) {
            meetingMasterRepository.save(meeting);

            List<MeetingAgenda> agendaList = meeting.getAgenda();
            meetingAgendaRepository.saveAll(agendaList);

            List<MeetingMenu> menuList = meeting.getMenu();
            meetingMenuRepository.saveAll(menuList);

        } else if (rangeTp.equals("after")) {
            meetingMasterRepository.save(meeting);

            List<Calendar> calendars = calendarQueryRepository
                    .findCalendarsByDateAfterMeetIdEqSchId(meeting.getMeetStartDttm(), meetId);

            for (int i = 0; i < calendars.size(); i++) {
                Calendar cal = calendars.get(i);
                meetingAgendaRepository.deleteByMeetId(cal.getMeetId());

                List<MeetingMenu> meetMenu = meeting.getMenu();
                meetingMenuRepository.deleteByMeetId(cal.getMeetId());

                meetingFileRepository.deleteByMeetId(cal.getMeetId());

                List<MeetingAgenda> agendaList = meeting.getAgenda();
                for (MeetingAgenda agenda : agendaList) {
                    String uuid = UUID.randomUUID().toString().replace("-", "");
                    agenda.setId(uuid);
                    agenda.setMeetId(cal.getMeetId());
                    agenda.setAgendaTitle(agenda.getAgendaTitle());
                    agenda.setSeq(agenda.getSeq());

                    meetingAgendaRepository.save(agenda);

                    List<MeetingMenu> meetMenuList = new ArrayList<>();
                    if (meetMenu.size() > 0) {
                        for (MeetingMenu menu : meetMenu) {
                            if (agenda.getSeq() == menu.getAgendaSeq()) {
                                MeetingMenu menuar = new MeetingMenu();
                                menuar.setMenuCd(menu.getMenuCd());
                                menuar.setMenuNm(menu.getMenuNm());
                                menuar.setMeetId(cal.getMeetId());
                                menuar.setUrlTitle(menu.getUrlTitle());
                                menuar.setUrlLink(menu.getUrlLink());
                                menuar.setLinkType(menu.getLinkType());
                                menuar.setAgendaId(uuid);
                                meetMenuList.add(menuar);
                            }
                        }
                        meetingMenuRepository.saveAll(meetMenuList);
                    }

                    List<MeetingFile> orgfileList = meeting.getUploadfiles();
                    if (orgfileList.size() > 0) {
                        List<MeetingFile> newMeetFiles = new ArrayList<>();
                        for (MeetingFile file : orgfileList) {
                            if (file.getAgendaSeq() == agenda.getSeq()) {
                                MeetingFile meetFile = new MeetingFile();
                                meetFile.setMeetId(cal.getMeetId());
                                meetFile.setAgendaId(uuid);
                                meetFile.setFileStorageId(file.getFileStorageId());
                                meetFile.setSeq(file.getSeq());
                                newMeetFiles.add(meetFile);
                            }
                        }
                        meetingFileRepository.saveAll(newMeetFiles);
                    }
                }
            }
        } else if (rangeTp.equals("all")) {
            List<Calendar> calendars = calendarQueryRepository.findCalendarsByMeetIdEqSchId(meetId);

            for (int i = 0; i < calendars.size(); i++) {
                Calendar cal = calendars.get(i);
                meetingAgendaRepository.deleteByMeetId(cal.getMeetId());

                List<MeetingMenu> meetMenu = meeting.getMenu();
                meetingMenuRepository.deleteByMeetId(cal.getMeetId());

                meetingFileRepository.deleteByMeetId(cal.getMeetId());

                List<MeetingAgenda> agendaList = meeting.getAgenda();
                for (MeetingAgenda agenda : agendaList) {
                    String uuid = UUID.randomUUID().toString().replace("-", "");
                    agenda.setId(uuid);
                    agenda.setMeetId(cal.getMeetId());
                    agenda.setAgendaTitle(agenda.getAgendaTitle());
                    agenda.setSeq(agenda.getSeq());

                    meetingAgendaRepository.save(agenda);

                    List<MeetingMenu> meetMenuCopy = new ArrayList<>();
                    if (meetMenu.size() > 0) {
                        for (MeetingMenu menu : meetMenu) {
                            if (agenda.getSeq() == menu.getAgendaSeq()) {
                                MeetingMenu menuar = new MeetingMenu();
                                menuar.setMenuCd(menu.getMenuCd());
                                menuar.setMenuNm(menu.getMenuNm());
                                menuar.setMeetId(cal.getMeetId());
                                menuar.setUrlTitle(menu.getUrlTitle());
                                menuar.setUrlLink(menu.getUrlLink());
                                menuar.setLinkType(menu.getLinkType());
                                menuar.setAgendaId(uuid);
                                meetMenuCopy.add(menuar);
                            }
                        }
                        meetingMenuRepository.saveAll(meetMenuCopy);
                    }

                    List<MeetingFile> orgfileList = meeting.getUploadfiles();
                    if (meetMenu.size() > 0) {
                        List<MeetingFile> newMeetFiles = new ArrayList<>();
                        for (MeetingFile file : orgfileList) {
                            if (file.getAgendaSeq() == agenda.getSeq()) {
                                MeetingFile meetFile = new MeetingFile();
                                meetFile.setMeetId(cal.getMeetId());
                                meetFile.setAgendaId(uuid);
                                meetFile.setFileStorageId(file.getFileStorageId());
                                meetFile.setSeq(file.getSeq());
                                newMeetFiles.add(meetFile);
                            }
                        }
                        meetingFileRepository.saveAll(newMeetFiles);
                    }
                }
            }
        }
    }

    public void deleteMeeting(String meetId) {
        MeetingMaster meetMaster = meetingMasterRepository.findByIdAndDelYn(meetId, "N");

        meetMaster.setDelYn("Y");
        meetingMasterRepository.save(meetMaster);
        calendarRepository.deleteByMeetId(meetId);
    }

    public List<MeetingAttendee> getMeetingAttendee(String meetId) {
        return meetingQueryRepository.getMeetingAttendee(meetId);
    }

    public void saveMeetingAttendee(List<MeetingAttendee> meetingAttendees) {
        meetingAttendeeRepository.saveAll(meetingAttendees);
    }

    public void deleteMeetingAttendee(List<MeetingAttendee> meetingAttendees) {
        meetingAttendeeRepository.deleteAll(meetingAttendees);
    }

    public List<MeetingAgenda> getMeetingAgenda(String meetId) {
        return meetingQueryRepository.getMeetingAgenda(meetId);
    }

    public void saveMeetingAgenda(List<MeetingAgenda> meetingAgendas) {
        for (int i = 0; i < meetingAgendas.size(); i++) {
            MeetingAgenda meetingAgenda = meetingAgendas.get(i);
            meetingAgendaRepository.save(meetingAgenda);
        }
    }

    public void deleteMeetingAgenda(List<MeetingAgenda> meetingAgendas) {
        for (int i = 0; i < meetingAgendas.size(); i++) {
            String agendaId = meetingAgendas.get(i).getId();

            meetingMenuRepository.deleteByAgendaId(agendaId);
            meetingFileRepository.deleteByAgendaId(agendaId);
        }
        meetingAgendaRepository.deleteAll(meetingAgendas);
    }

    public List<MeetingMenu> getMeetingMenu(String meetId) {
        return meetingQueryRepository.getMeetingMenu(meetId);
    }

    public void saveMeetingMenu(List<MeetingMenu> meetingMenus) {
        meetingMenuRepository.saveAll(meetingMenus);
    }

    public void deleteMeetingMenu(List<MeetingMenu> meetingMenus) {
        meetingMenuRepository.deleteAll(meetingMenus);
    }

    public List<MeetingFileInfo> getMeetingFiles(String meetId) {
        return meetingQueryRepository.getMeetingAgendaFiles(meetId);
    }

    public void saveMeetingFile(List<MeetingFile> meetingFiles) {
        meetingFileRepository.saveAll(meetingFiles);
    }

    public void deleteMeetingFile(List<MeetingFile> meetingFiles) {
        meetingFileRepository.deleteAll(meetingFiles);
    }

    public void copyMeeting(MeetingMaster source, String cpMeetId, String meetSbjt, Timestamp targetStartDt,
            Timestamp targetEndDt) {
        Optional<MeetingMaster> targetMeet = Optional.ofNullable(new MeetingMaster());
        targetMeet = meetingMasterRepository.findById(cpMeetId);

        List<MeetingMinutes> meetMinutes = meetingMinutesRepository.findByMeetId(source.getId());
        List<MeetingAgenda> agendaList = meetingAgendaRepository.findByMeetId(source.getId());
        List<MeetingAttendee> meetAttendee = meetingAttendeeRepository.findByMeetId(source.getId());
        List<MeetingMenu> menusList = meetingMenuRepository.findByMeetId(source.getId());
        List<MeetingFile> fileList = meetingFileRepository.findByMeetId(source.getId());

        MeetingMaster trgt = targetMeet.get();
        copyMeeting(source, trgt, meetMinutes, agendaList, meetAttendee, menusList, fileList, targetStartDt,
                targetEndDt);

    }

    private void copyMeeting(MeetingMaster source, MeetingMaster target,
            List<MeetingMinutes> meetMinutes, List<MeetingAgenda> agendaList, List<MeetingAttendee> meetAttendee,
            List<MeetingMenu> menusList, List<MeetingFile> fileList, Timestamp targetStartDt,
            Timestamp targetEndDt) {
        MeetingMaster newMeetingMaster = new MeetingMaster();
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        newMeetingMaster.setId(uuid);
        newMeetingMaster.setDelYn(source.getDelYn());
        newMeetingMaster.setMailSendYn(source.getMailSendYn());
        newMeetingMaster.setMeetStartDttm(targetStartDt);
        newMeetingMaster.setMeetEndDttm(targetEndDt);
        newMeetingMaster.setMeetOwnerId(source.getMeetOwnerId());
        newMeetingMaster.setMeetSubject(source.getMeetSubject());
        meetingMasterRepository.save(newMeetingMaster);

        Calendar newCalendar = new Calendar();
        String uuidd = UUID.randomUUID().toString().replaceAll("-", "");
        newCalendar.setId(uuidd);
        newCalendar.setCategoryId(source.getCategoryId());
        newCalendar.setUserId(source.getMeetOwnerId());
        newCalendar.setMeetId(uuid);
        newCalendar.setFullDayYn("N");
        newCalendar.setSchEndDttm(targetStartDt);
        newCalendar.setRepeatTp("");
        newCalendar.setSchStartDttm(targetEndDt);
        newCalendar.setSchNm(source.getMeetSubject());
        calendarRepository.save(newCalendar);

        if (meetAttendee != null) {
            // 이전 참석자 삭제
            meetingAttendeeRepository.deleteByMeetId(target.getId());

            List<MeetingAttendee> meetAttendeeCopy = new ArrayList<>();
            for (int i = 0; i < meetAttendee.size(); i++) {
                MeetingAttendee srcMeetingAttendee = meetAttendee.get(i);

                MeetingAttendee meetAttendeeCopyRow = new MeetingAttendee();
                meetAttendeeCopyRow.setMeetId(uuid);
                meetAttendeeCopyRow.setUserId(srcMeetingAttendee.getUserId());
                meetAttendeeCopyRow.setUsername(srcMeetingAttendee.getUsername());
                meetAttendeeCopyRow.setDepartment(srcMeetingAttendee.getDepartment());
                meetAttendeeCopyRow.setBusinessValue(srcMeetingAttendee.getBusinessValue());
                meetAttendeeCopyRow.setEmail(srcMeetingAttendee.getEmail());
                meetAttendeeCopyRow.setPhone(srcMeetingAttendee.getPhone());
                meetAttendeeCopy.add(meetAttendeeCopyRow);
            }
            if (meetAttendeeCopy.size() > 0) {
                meetingAttendeeRepository.saveAll(meetAttendeeCopy);
            }
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

                String newAgendaId = UUID.randomUUID().toString().replace("-", "");
                newMeetAgendaRow.setMeetId(uuid);
                newMeetAgendaRow.setId(newAgendaId);
                newMeetAgendaRow.setAgendaTitle(orgAgenda.getAgendaTitle());
                newMeetAgendaRow.setSeq(orgAgenda.getSeq());

                newMeetAgendaRow.setAgendaContents(orgAgenda.getAgendaContents());

                meetingAgendaRepository.save(newMeetAgendaRow);

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

                            meetMenuRow.setMeetId(uuid);
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

                            meetFileRow.setMeetId(uuid);
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
            meetingMinutesRepository.deleteByMeetId(uuid);
            List<MeetingMinutes> meetMinutesCopy = new ArrayList<>();

            for (int i = 0; i < meetMinutes.size(); i++) {
                MeetingMinutes meetMinutesRow = new MeetingMinutes();

                meetMinutesRow.setMeetId(uuid);
                meetMinutesRow.setMinutes(meetMinutes.get(i).getMinutes());
                meetMinutesCopy.add(meetMinutesRow);
            }
            meetingMinutesRepository.saveAll(meetMinutesCopy);
        }
    }
}
