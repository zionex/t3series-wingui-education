package com.zionex.t3series.web.domain.util.calendar;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zionex.t3series.util.StringUtils;
import com.zionex.t3series.web.domain.snop.meeting.MeetingAttendee;
import com.zionex.t3series.web.domain.snop.meeting.MeetingAttendeeRepository;
import com.zionex.t3series.web.domain.snop.meeting.MeetingMaster;
import com.zionex.t3series.web.domain.snop.meeting.MeetingMasterRepository;
import com.zionex.t3series.web.domain.snop.meeting.MeetingQueryRepository;
import com.zionex.t3series.web.domain.util.filestorage.FileStorage;
import com.zionex.t3series.web.domain.util.filestorage.FileStorageRepository;
import com.zionex.t3series.web.domain.util.filestorage.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final CalendarQueryRepository calendarQueryRepository;
    private final MeetingQueryRepository meetingQueryRepository;
    private final FileStorageRepository fileStorageRepository;

    private final CalendarRepository calendarRepository;
    private final CalendarCategoryRepository calendarCategoryRepository;
    private final MeetingMasterRepository meetingMasterRepository;
    private final MeetingAttendeeRepository meetingAttendeeRepository;
    private final CalendarFileRepository calendarFileRepository;
    
    private final FileStorageService fileStorageService;

    public List<Calendar> getCalendar(String userId) {
        return calendarQueryRepository.getCalendar(userId);
    }

    public List<CalendarCategory> getCalendarCategory(String userId) {
        return calendarQueryRepository.getCalendarCategory(userId);
    }

    public List<Calendar> getRepeatDate(String username, String categoryId, String schId) {
        return calendarQueryRepository.getRepeatDate(username, categoryId, schId);
    }

    public List<MeetingMaster> getRepeatDate(String schId) {
        return meetingQueryRepository.getRepeatDate(schId);
    }

    @Transactional
    public synchronized void deleteCalendar(String userId, String categoryId, String schId) {
        calendarRepository.deleteByUserIdAndCategoryIdAndSchId(userId, categoryId, schId);
    }

    @Transactional
    public void deleteMeetingMaster(String schId) {
        meetingQueryRepository.deleteMeetingMasterBySchId(schId);
    }

    @Transactional
    public synchronized void deleteCalendarById(String userId, String categoryId, String schId, String id) {
        calendarRepository.deleteByUserIdAndCategoryIdAndSchIdAndId(userId, categoryId, schId, id);
    }

    @Transactional
    public void deleteMeetingMasterAndAroundById(String id) {
        if (!id.trim().equals("") && !id.trim().isEmpty()) {
            MeetingMaster meetMaster = meetingMasterRepository.findByIdAndDelYn(id, "N");
            meetMaster.setDelYn("Y");
            meetingMasterRepository.save(meetMaster);
        }
    }

    @Transactional
    public synchronized void deleteCalendarAfter(String userId, String categoryId, String schId, String id) {
        Calendar calendar = calendarRepository.findByUserIdAndCategoryIdAndSchIdAndId(userId, categoryId, schId, id);
        if (calendar != null) {
            meetingQueryRepository.deleteMeetingMasterAfter(schId, calendar.getSchStartDttm());
            calendarQueryRepository.deleteCalendarAfter(userId, categoryId, schId, id, calendar.getSchStartDttm());
        }
    }

    @Transactional
    public void deleteCalendarCategory(String userId, String categoryId) {
        calendarRepository.deleteByUserIdAndCategoryId(userId, categoryId);
        calendarCategoryRepository.deleteById(categoryId);
    }

    @Transactional
    public void saveCalendarCategory(CalendarCategory calendarCategory) {
        calendarCategoryRepository.save(calendarCategory);
    }

    @Transactional
    public void saveEvent(Calendar calendar, MeetingMaster meetingMaster, List<MeetingAttendee> meetingAttendees) {
        // 1. 일정정보 저장
        calendarRepository.save(calendar);
        if (!calendar.getMeetId().equals(null) && !calendar.getMeetId().equals("")) {
            // 2. 미팅정보 가져와서 미팅생성
            meetingMasterRepository.save(meetingMaster);
            if (meetingAttendees.size() > 0) {
                meetingAttendeeRepository.saveAll(meetingAttendees);
            }
        }
    }

    /**
     * startCal의 값 기준으로 반복 Calendar 생성.
     * 
     * @param startCal
     * @param baseStartDt
     * @param repeatType
     * @param repeatOption
     * @param nRepeatNo
     * @return
     */
    private Calendar makeRepeatCalendar(Calendar startCal, Date baseStartDt, String repeatType, String repeatOption, int nRepeatNo) {
        Calendar repCalendar = new Calendar();
        repCalendar.copy(startCal);

        long diff = startCal.getSchEndDttm().getTime() - startCal.getSchStartDttm().getTime();
        java.util.Calendar stCalendar = java.util.Calendar.getInstance();

        stCalendar.setTime(baseStartDt);

        if ("D".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.DATE, nRepeatNo);
        } else if ("W".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.DATE, nRepeatNo * 7);
        } else if ("M".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.MONTH, nRepeatNo);
        } else if ("Y".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.YEAR, nRepeatNo);
        }
        Date schStartDttm2 = stCalendar.getTime();
        java.sql.Timestamp schEndDttm2 = new java.sql.Timestamp(schStartDttm2.getTime() + diff);

        repCalendar.setSchStartDttm(new java.sql.Timestamp(schStartDttm2.getTime()));
        repCalendar.setSchEndDttm(schEndDttm2);
        return repCalendar;
    }

    /**
     * 반복 일정중 특정 일정 이후 반복일정 만들기
     * 
     * @param startCal:    수정된 원래 일정
     * @param cal          : 원래 일정
     * @param baseStartDt
     * @param repeatType
     * @param repeatOption
     * @param nRepeatNo
     * @return
     */
    private Calendar makeRepeatCalendar(Calendar startCal, Calendar cal, Date baseStartDt, String repeatType, String repeatOption, int nRepeatNo) {
        Calendar repCalendar = cal.copy(startCal);

        long diff = startCal.getSchEndDttm().getTime() - startCal.getSchStartDttm().getTime();
        java.util.Calendar stCalendar = java.util.Calendar.getInstance();

        stCalendar.setTime(baseStartDt);

        if ("D".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.DATE, nRepeatNo);
        } else if ("W".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.DATE, nRepeatNo * 7);
        } else if ("M".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.MONTH, nRepeatNo);
        } else if ("Y".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.YEAR, nRepeatNo);
        }
        Date schStartDttm2 = stCalendar.getTime();

        java.sql.Timestamp schEndDttm2 = new java.sql.Timestamp(schStartDttm2.getTime() + diff);

        repCalendar.setSchStartDttm(new java.sql.Timestamp(schStartDttm2.getTime()));
        repCalendar.setSchEndDttm(schEndDttm2);
        return repCalendar;
    }

    /**
     * startCal의 값 기준으로 반복 Calendar 생성.
     * 
     * @param startMeetingMaster
     * @param baseStartDt
     * @param repeatType
     * @param repeatOption
     * @param nRepeatNo
     * @return
     */
    private MeetingMaster makeRepeatMeetingCalendar(MeetingMaster startMeetingMaster, Date baseStartDt, String repeatType, String repeatOption, int nRepeatNo) {
        MeetingMaster repCalendar = new MeetingMaster();
        repCalendar.copy(startMeetingMaster);

        long diff = startMeetingMaster.getMeetEndDttm().getTime() - startMeetingMaster.getMeetStartDttm().getTime();
        java.util.Calendar stCalendar = java.util.Calendar.getInstance();

        stCalendar.setTime(baseStartDt);

        if ("D".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.DATE, nRepeatNo);
        } else if ("W".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.DATE, nRepeatNo * 7);
        } else if ("M".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.MONTH, nRepeatNo);
        } else if ("Y".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.YEAR, nRepeatNo);
        }
        Date meetStartDttm2 = stCalendar.getTime();
        java.sql.Timestamp meetEndDttm2 = new java.sql.Timestamp(meetStartDttm2.getTime() + diff);

        repCalendar.setMeetStartDttm(new java.sql.Timestamp(meetStartDttm2.getTime()));
        repCalendar.setMeetEndDttm(meetEndDttm2);
        return repCalendar;
    }

    /**
     * 반복 일정중 특정 일정 이후 반복일정 만들기
     * 
     * @param startCal:    수정된 원래 일정
     * @param cal          : 원래 일정
     * @param baseStartDt
     * @param repeatType
     * @param repeatOption
     * @param nRepeatNo
     * @return
     */
    private MeetingMaster makeRepeatMeetingCalendar(MeetingMaster meetingMaster, MeetingMaster meetMaster, Date baseStartDt, String repeatType, String repeatOption, int nRepeatNo) {
        MeetingMaster repCalendar = meetMaster.copy(meetingMaster);

        long diff = meetingMaster.getMeetEndDttm().getTime() - meetingMaster.getMeetStartDttm().getTime();
        java.util.Calendar stCalendar = java.util.Calendar.getInstance();

        stCalendar.setTime(baseStartDt);

        if ("D".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.DATE, nRepeatNo);
        } else if ("W".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.DATE, nRepeatNo * 7);
        } else if ("M".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.MONTH, nRepeatNo);
        } else if ("Y".equals(repeatType)) {
            stCalendar.add(java.util.Calendar.YEAR, nRepeatNo);
        }
        Date meetStartDttm2 = stCalendar.getTime();

        java.sql.Timestamp meetEndDttm2 = new java.sql.Timestamp(meetStartDttm2.getTime() + diff);

        repCalendar.setMeetStartDttm(new java.sql.Timestamp(meetStartDttm2.getTime()));
        repCalendar.setMeetEndDttm(meetEndDttm2);
        return repCalendar;
    }

    private int compareDate(Date startDate, Date endDate) {
        java.util.Calendar cal1 = java.util.Calendar.getInstance();
        java.util.Calendar cal2 = java.util.Calendar.getInstance();

        cal1.setTime(startDate);
        cal2.setTime(endDate);

        int year1 = cal1.get(java.util.Calendar.YEAR);
        int year2 = cal2.get(java.util.Calendar.YEAR);

        int month1 = cal1.get(java.util.Calendar.MONTH);
        int month2 = cal2.get(java.util.Calendar.MONTH);

        int day1 = cal1.get(java.util.Calendar.DATE);
        int day2 = cal2.get(java.util.Calendar.DATE);

        return (year1 - year2) == 0 ? ((month1 - month2) == 0 ? (day1 - day2) : (month1 - month2)) : (year1 - year2);
    }

    /**
     * 신규일정 반복 만들기
     * 
     * @param calendar
     * @param repeatType
     * @param repeatOption
     * @param nRepeatNo
     * @param repeatEndDate
     */
    @Transactional
    public void saveRepeatCalendar(Calendar calendar, MeetingMaster meetingMaster, List<MeetingAttendee> meetingAttendees, String repeatType, String repeatOption, int nRepeatNo, java.sql.Date repeatEndDate) {
        Date baseStartDt = calendar.getSchStartDttm();
        if ("N".equals(repeatOption)) { // 반복 개수
            for (int i = 0; i < nRepeatNo; i++) {
                Calendar repeatCal = makeRepeatCalendar(calendar, baseStartDt, repeatType, repeatOption, i);
                MeetingMaster repeatMeetCal = makeRepeatMeetingCalendar(meetingMaster, baseStartDt, repeatType, repeatOption, i);

                String uuid = UUID.randomUUID().toString().replaceAll("-", "");
                repeatCal.setMeetId(uuid);
                
                if (repeatMeetCal != null) {
                    repeatMeetCal.setId(uuid);
                }

                for (MeetingAttendee attendee : meetingAttendees) {
                    String uuid2 = UUID.randomUUID().toString().replaceAll("-", "");
                    attendee.setMeetId(uuid);
                    attendee.setId(uuid2);
                }
                saveEvent(repeatCal, repeatMeetCal, meetingAttendees);
            }
        } else if ("D".equals(repeatOption)) { // 마지막 일자 이전까지 만든다.
            int repeat = 0;
            Calendar repeatCal = makeRepeatCalendar(calendar, baseStartDt, repeatType, repeatOption, repeat);
            MeetingMaster repeatMeetCal = makeRepeatMeetingCalendar(meetingMaster, baseStartDt, repeatType, repeatOption, repeat);
            // 시작일자가 종료일자를 넘지 않도록
            Date schDt = repeatCal.getSchStartDttm();
            while (compareDate(repeatEndDate, schDt) >= 0) {
                String uuid = UUID.randomUUID().toString().replaceAll("-", "");
                repeatCal.setMeetId(uuid);

                if (repeatMeetCal != null) {
                    repeatMeetCal.setId(uuid);
                }
    
                for (MeetingAttendee attendee : meetingAttendees) {
                    String uuid2 = UUID.randomUUID().toString().replaceAll("-", "");
                    attendee.setMeetId(uuid);
                    attendee.setId(uuid2);
                }
                saveEvent(repeatCal, repeatMeetCal, meetingAttendees);
                repeat++;
                repeatCal = makeRepeatCalendar(calendar, baseStartDt, repeatType, repeatOption, repeat);
                repeatMeetCal = makeRepeatMeetingCalendar(meetingMaster, baseStartDt, repeatType, repeatOption, repeat);

                schDt = repeatCal.getSchStartDttm();
            }
        }
    }

    /**
     * 기존일 반복 수정
     * 
     * @param startCal      수정된 일정정보
     * @param cal           : 원래 일정정보
     * @param idx
     * @param repeatType
     * @param repeatOption
     * @param repeatEndDate
     */
    @Transactional
    public void saveRepeatCalendar(Calendar startCal, Calendar cal, MeetingMaster meetingMaster, MeetingMaster meetMaster, List<MeetingAttendee> meetingAttendees,
                                   int idx, String repeatType, String repeatOption, java.sql.Date repeatEndDate) {
        Date baseStartDt = startCal.getSchStartDttm();
        if ("N".equals(repeatOption)) { // 반복 개수
            startCal.setMeetId(cal.getMeetId());
            Calendar repeatCal = makeRepeatCalendar(startCal, cal, baseStartDt, repeatType, repeatOption, idx);
            MeetingMaster repeatMeetCal = null;
            if (!startCal.getMeetId().equals("")) {
                meetingMaster.setId(meetMaster.getId());
                repeatMeetCal = makeRepeatMeetingCalendar(meetingMaster, meetMaster, baseStartDt, repeatType, repeatOption, idx);
            }
            
            String uuid = UUID.randomUUID().toString().replaceAll("-", "");
            repeatCal.setMeetId(uuid);
            repeatMeetCal.setId(uuid);
            for (MeetingAttendee attendee : meetingAttendees) {
                String uuid2 = UUID.randomUUID().toString().replaceAll("-", "");
                attendee.setMeetId(uuid);
                attendee.setId(uuid2);
            }

            saveEvent(repeatCal, repeatMeetCal, meetingAttendees);
        } else if ("D".equals(repeatOption)) { // 마지막 일자 이전까지 만든다.
            startCal.setMeetId(cal.getMeetId());
            Calendar repeatCal = makeRepeatCalendar(startCal, cal, baseStartDt, repeatType, repeatOption, idx);
            MeetingMaster repeatMeetCal = null;
            if (!startCal.getMeetId().equals("")) {
                meetingMaster.setId(meetMaster.getId());
                repeatMeetCal = makeRepeatMeetingCalendar(meetingMaster, meetMaster, baseStartDt, repeatType, repeatOption, idx);
            }

            String uuid = UUID.randomUUID().toString().replaceAll("-", "");
            repeatCal.setMeetId(uuid);
            repeatMeetCal.setId(uuid);
            for (MeetingAttendee attendee : meetingAttendees) {
                String uuid2 = UUID.randomUUID().toString().replaceAll("-", "");
                attendee.setMeetId(uuid);
                attendee.setId(uuid2);
            }
            
            // 시작일자가 종료일자를 넘지 않도록
            Date schDt = repeatCal.getSchStartDttm();
            if (compareDate(repeatEndDate, schDt) >= 0) {
                saveEvent(repeatCal, repeatMeetCal, meetingAttendees);
            }
        }
    }

    @Transactional
    public void saveCalendar(Calendar calendar, MeetingMaster meetingMaster, List<MeetingAttendee> meetingAttendees, String saveType,
                             String repeatType, String repeatOption, java.sql.Date repeatEndDate, int nRepeatNo) {
        if ("N".equals(repeatType) || repeatType == null) {
            saveEvent(calendar, meetingMaster, meetingAttendees);
        } else { // 반복 일정
            String id = calendar.getId();
            if (StringUtils.isBlankOrEmpty(id)) { // 신규
                saveRepeatCalendar(calendar, meetingMaster, meetingAttendees, repeatType, repeatOption, nRepeatNo, repeatEndDate);
            } else { // 이전 반복일정 중 하나 수정
                if ("equal".equals(saveType)) { // 자기자신만 저장
                    saveEvent(calendar, meetingMaster, meetingAttendees);
                } else if ("greaterThenOrEqualTo".equals(saveType)) { // 자기자신과 그 이후

                    Calendar orgMe = calendarRepository.findByUserIdAndCategoryIdAndSchIdAndId(calendar.getUserId(),
                            calendar.getCategoryId(), calendar.getSchId(), id);

                    // 이런경우엔 이후 일정 삭제 후 새롭게 생성
                    if (!calendar.getRepeatTp().equals(orgMe.getRepeatTp())) {
                        deleteCalendarAfter(calendar.getUserId(), calendar.getCategoryId(), calendar.getSchId(), calendar.getId());
                        saveRepeatCalendar(calendar, meetingMaster, meetingAttendees, repeatType, repeatOption, nRepeatNo, repeatEndDate);
                    } else {
                        // 반복일정을 가져온다.
                        List<Calendar> listCal = getRepeatDate(calendar.getUserId(), calendar.getCategoryId(), calendar.getSchId());
                        List<MeetingMaster> listMeeting = getRepeatDate(calendar.getSchId());

                        boolean proc = false;
                        int idx = 0;
                        for (int i = 0; i < listCal.size(); i++) {
                            Calendar cal = listCal.get(i);
                            MeetingMaster meetCal = null;

                            if (listMeeting.size() != 0) {
                                meetCal = listMeeting.get(i);
                            }
                            if (cal.getId().equals(id)) {
                                proc = true;
                            }
                            if (proc == true) {
                                //1.기존 일정 삭제
                                deleteMeetingMasterAndAroundById(cal.getMeetId());
                                deleteCalendarById(cal.getUserId(), cal.getCategoryId(), cal.getSchId(), cal.getId());
                                deleteCalendarFile(cal.getUserId(), cal.getSchId());
                                //2.변경된 일정 저장
                                saveRepeatCalendar(calendar, cal, meetingMaster, meetCal, meetingAttendees, idx, repeatType, repeatOption, repeatEndDate);
                                idx++;
                            }
                        }
                    }

                } else if ("all".equals(saveType)) { // 전체 일정변경, 과거 변경이 맞나?
                }
            }
        }
    }

    public void deleteCalendarFile(String userId, String schId) {
        List<Calendar> calendarList = calendarRepository.findByUserIdAndSchId(userId, schId);
        List<CalendarFile> calendarFiles = calendarFileRepository.findBySchId(schId);
        if (calendarList.size() == 0) {
            calendarFileRepository.deleteBySchId(schId);
            for (CalendarFile fileIds : calendarFiles) {
                fileStorageRepository.deleteById(fileIds.getFileStorageId());
            }
        }
    }

    public void saveCalendarFile(Calendar calendar) {
        if (calendar.getFiles() != null) {
            String schId = calendar.getSchId();
            calendar.getFiles().forEach(fileId -> {
                CalendarFile calendarFile = new CalendarFile();
                calendarFile.setSchId(schId);
                calendarFile.setFileStorageId(fileId);
                calendarFileRepository.save(calendarFile);
            });
        }
    }

    public List<FileStorage> getCalendarFileData(String schId) {
        List<Integer> fileStorageIdList = new ArrayList<>();

        calendarFileRepository.findBySchId(schId).forEach(mCalendarFile -> fileStorageIdList.add(mCalendarFile.getFileStorageId()));

        return fileStorageService.getFilesInfo(fileStorageIdList);
    }

}
