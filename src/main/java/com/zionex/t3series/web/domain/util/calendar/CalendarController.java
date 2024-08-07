package com.zionex.t3series.web.domain.util.calendar;

import java.sql.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3series.util.StringUtils;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.snop.meeting.MeetingAttendee;
import com.zionex.t3series.web.domain.snop.meeting.MeetingMaster;
import com.zionex.t3series.web.domain.util.filestorage.FileStorage;
import com.zionex.t3series.web.security.authentication.AuthenticationInfo;
import com.zionex.t3series.web.security.authentication.AuthenticationManager;
import com.zionex.t3series.web.util.ResponseEntityUtil;
import com.zionex.t3series.web.util.ResponseEntityUtil.ResponseMessage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;
import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;
    private final AuthenticationManager authenticationManager;

    private final ObjectMapper objectMapper;

    private static final String CATEGORY_ID = "category-id";
    private static final String SCH_ID = "sch-id";
    private static final String ID = "id";
    private static final String MEET_ID = "meet-id";
    private static final String OPTION = "option";

    // 일정 조회
    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("/calendar")
    public List<Calendar> getCalendar() {
        AuthenticationInfo authenticationInfo = authenticationManager.getAuthenticationInfo();
        return calendarService.getCalendar(authenticationInfo.getUserId());
    }

    // 반복날짜 조회
    // @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    // @GetMapping("/calendar/repeat")
    // public List<Calendar> getRepeatDate(@RequestParam(CATEGORY_ID) String
    // categoryId,
    // @RequestParam(SCH_ID) String schId) {
    // AuthenticationInfo authenticationInfo =
    // authenticationManager.getAuthenticationInfo();
    // return calendarService.getRepeatDate(authenticationInfo.getUsername(),
    // categoryId, schId);
    // }

    // 일정 저장
    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("/calendar")
    public ResponseEntity<ResponseMessage> saveCalendar(HttpServletRequest request)
            throws JsonMappingException, JsonProcessingException {
        final Calendar calendar = objectMapper.readValue(request.getParameter(ServiceConstants.PARAMETER_KEY_DATA),
                new TypeReference<Calendar>() {
                });
        final MeetingMaster meetingMaster = objectMapper.readValue(request.getParameter("meetingChanges"),
                new TypeReference<MeetingMaster>() {
                });
        final List<MeetingAttendee> meetingAttendees = objectMapper.readValue(request.getParameter("attendeeChanges"),
                new TypeReference<List<MeetingAttendee>>() {
                });

        String saveType = request.getParameter("saveType");
        String repeatType = request.getParameter("repeatType"); // 'N','D','W','M','Y'
        String repeatOption = request.getParameter("repeatOption"); // N, D
        Date repeatEndDate = QueryHandler.getDate(request.getParameter("repeatEndDate"));
        String repeatNumber = request.getParameter("repeatNumber");
        int nRepeatNo = 0;
        if (!StringUtils.isBlankOrEmpty(repeatNumber) && "N".equals(repeatOption)) {
            nRepeatNo = Integer.parseInt(repeatNumber);
        }

        AuthenticationInfo authenticationInfo = authenticationManager.getAuthenticationInfo();
        calendar.setUserId(authenticationInfo.getUserId());
        meetingMaster.setMeetOwnerId(authenticationInfo.getUserId());

        calendarService.saveCalendar(calendar, meetingMaster, meetingAttendees, saveType, repeatType, repeatOption, repeatEndDate, nRepeatNo);
        calendarService.saveCalendarFile(calendar);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved calendar"));
    }

    // 일정 삭제
    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("/calendar/delete")
    public ResponseEntity<ResponseMessage> deleteCalendar(@RequestParam(CATEGORY_ID) String categoryId,
            @RequestParam(SCH_ID) String schId,
            @RequestParam(ID) String id,
            @RequestParam(MEET_ID) String meetId) {
        AuthenticationInfo authenticationInfo = authenticationManager.getAuthenticationInfo();
        calendarService.deleteMeetingMasterAndAroundById(meetId);
        calendarService.deleteCalendarById(authenticationInfo.getUserId(), categoryId, schId, id);
        calendarService.deleteCalendarFile(authenticationInfo.getUserId(), schId);

        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted calendar"));
    }

    // 일정 삭제(반복된 일정 모두삭제)
    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("/calendar/deleteall")
    public ResponseEntity<ResponseMessage> deleteCalendarAll(@RequestParam(CATEGORY_ID) String categoryId,
            @RequestParam(SCH_ID) String schId) {
        AuthenticationInfo authenticationInfo = authenticationManager.getAuthenticationInfo();
        calendarService.deleteMeetingMaster(schId);
        calendarService.deleteCalendar(authenticationInfo.getUserId(), categoryId, schId);
        calendarService.deleteCalendarFile(authenticationInfo.getUserId(), schId);

        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted calendar"));
    }

    // 반복일정 삭제
    @PostMapping("/calendar/repeatdelete")
    public ResponseEntity<ResponseMessage> deleteRepeatCalendar(@RequestParam(CATEGORY_ID) String categoryId,
            @RequestParam(SCH_ID) String schId, @RequestParam(ID) String id,
            @RequestParam(OPTION) String option, @RequestParam(MEET_ID) String meetId) {
        AuthenticationInfo authenticationInfo = authenticationManager.getAuthenticationInfo();
        if ("equal".equals(option)) {
            calendarService.deleteMeetingMasterAndAroundById(meetId);
            calendarService.deleteCalendarById(authenticationInfo.getUserId(), categoryId, schId, id);
            calendarService.deleteCalendarFile(authenticationInfo.getUserId(), schId);
        } else if ("greaterThenOrEqualTo".equals(option)) {
            calendarService.deleteCalendarAfter(authenticationInfo.getUserId(), categoryId, schId, id);
            calendarService.deleteCalendarFile(authenticationInfo.getUserId(), schId);
        }

        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted calendar"));
    }

    // Category 조회
    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("/calendar-category")
    public List<CalendarCategory> getCalendarCategory() {
        AuthenticationInfo authenticationInfo = authenticationManager.getAuthenticationInfo();
        return calendarService.getCalendarCategory(authenticationInfo.getUserId());
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_UPDATE)
    @PostMapping("/calendar-category")
    public ResponseEntity<ResponseMessage> saveCalendarCategory(HttpServletRequest request)
            throws JsonMappingException, JsonProcessingException {
        final CalendarCategory calendarCategory = objectMapper.readValue(
                request.getParameter(ServiceConstants.PARAMETER_KEY_DATA), new TypeReference<CalendarCategory>() {
                });

        AuthenticationInfo authenticationInfo = authenticationManager.getAuthenticationInfo();
        calendarCategory.setUserId(authenticationInfo.getUserId());

        calendarService.saveCalendarCategory(calendarCategory);
        return ResponseEntityUtil
                .setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved calendar category"));
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_DELETE)
    @PostMapping("/calendar-category/delete")
    public ResponseEntity<ResponseMessage> deleteCalendarCategory(@RequestParam(CATEGORY_ID) String categoryId) {
        AuthenticationInfo authenticationInfo = authenticationManager.getAuthenticationInfo();
        calendarService.deleteCalendarCategory(authenticationInfo.getUserId(), categoryId);

        return ResponseEntityUtil
                .setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted calendar category"));
    }

    @GetMapping("/calendar-file")
    public List<FileStorage> getCalendarFileData(@RequestParam("SCH_ID") String schId) {
        return calendarService.getCalendarFileData(schId);
    }

}
