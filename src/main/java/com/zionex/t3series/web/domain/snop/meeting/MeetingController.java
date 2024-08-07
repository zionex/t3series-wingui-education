package com.zionex.t3series.web.domain.snop.meeting;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.domain.util.filestorage.FileStorage;
import com.zionex.t3series.web.security.authentication.AuthenticationInfo;
import com.zionex.t3series.web.security.authentication.AuthenticationManager;
import com.zionex.t3series.web.util.ResponseEntityUtil;
import com.zionex.t3series.web.util.ResponseEntityUtil.ResponseMessage;
import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/meeting")
public class MeetingController {

    private final MeetingService meetingService;
    private final AuthenticationManager authenticationManager;

    // 회의록 전체 날짜 조회
    @GetMapping("/dates")
    public List<MeetingMaster> getMeetingDates() {
        return meetingService.getMeetingDates();
    }

    // 회의록 조회
    @GetMapping
    public MeetingMaster getMeeting(@RequestParam("meet-id") String meetId) {
        return meetingService.getMeeting(meetId);
    }

    // 회의록 저장
    @PostMapping
    public ResponseEntity<ResponseMessage> saveMeeting(@RequestBody MeetingMaster meetingMaster) {
        AuthenticationInfo authenticationInfo = authenticationManager.getAuthenticationInfo();
        meetingMaster.setMeetOwnerId(authenticationInfo.getUserId());

        meetingService.saveMeeting(meetingMaster);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved meeting"));
    }

    // 회의록 전체 삭제
    @PostMapping("/delete")
    public ResponseEntity<ResponseMessage> deleteMeeting(@RequestParam("meet-id") String meetId) {
        meetingService.deleteMeeting(meetId);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted meeting"));
    }

    // 참석자 조회
    @GetMapping("/attendee")
    public List<MeetingAttendee> getMeetingAttendee(@RequestParam("meet-id") String meetId) {
        return meetingService.getMeetingAttendee(meetId);
    }

    // 참석자 저장
    @PostMapping("/attendee")
    public ResponseEntity<ResponseMessage> saveMeetingAttendee(@RequestBody List<MeetingAttendee> meetingAttendees) {
        meetingService.saveMeetingAttendee(meetingAttendees);
        return ResponseEntityUtil
                .setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved meeting attendee"));
    }

    // 참석자 삭제
    @PostMapping("/attendee/delete")
    public ResponseEntity<ResponseMessage> deleteMeetingAttendee(@RequestBody List<MeetingAttendee> meetingAttendees) {
        meetingService.deleteMeetingAttendee(meetingAttendees);
        return ResponseEntityUtil
                .setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted meeting attendee"));
    }

    // Agenda 조회
    @GetMapping("/agenda")
    public List<MeetingAgenda> getMeetingAgenda(@RequestParam("meet-id") String meetId) {
        return meetingService.getMeetingAgenda(meetId);
    }

    // Agenda 저장
    @PostMapping("/agenda")
    public ResponseEntity<ResponseMessage> saveMeetingAgenda(@RequestBody List<MeetingAgenda> meetingAgenda) {
        meetingService.saveMeetingAgenda(meetingAgenda);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved meeting agenda"));
    }

    // Agenda 삭제
    @PostMapping("/agenda/delete")
    public ResponseEntity<ResponseMessage> deleteMeetingAgenda(@RequestBody List<MeetingAgenda> meetingAgenda) {
        meetingService.deleteMeetingAgenda(meetingAgenda);
        return ResponseEntityUtil
                .setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted meeting agenda"));
    }

    // 화면 조회
    @GetMapping("/menu")
    public List<MeetingMenu> getMeetingMenu(@RequestParam("meet-id") String meetId) {
        return meetingService.getMeetingMenu(meetId);
    }

    // 화면 저장
    @PostMapping("/menu")
    public ResponseEntity<ResponseMessage> saveMeetingMenu(@RequestBody List<MeetingMenu> meetingMenus,
            HttpServletRequest request) {
        meetingService.saveMeetingMenu(meetingMenus);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved meeting menu"));
    }

    // 화면 삭제
    @PostMapping("/menu/delete")
    public ResponseEntity<ResponseMessage> deleteMeetingMenu(@RequestBody List<MeetingMenu> meetingMenus,
            HttpServletRequest request) {
        meetingService.deleteMeetingMenu(meetingMenus);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted meeting menu"));
    }

    // 첨부파일 조회
    @GetMapping("/files")
    public List<MeetingFileInfo> getMeetingFiles(@RequestParam("meetId") String meetId) {
        return meetingService.getMeetingFiles(meetId);
    }

    // 첨부파일 저장
    @PostMapping("/files")
    public ResponseEntity<ResponseMessage> saveMeetingFile(@RequestBody List<MeetingFile> meetingFiles,
            HttpServletRequest request) {
        meetingService.saveMeetingFile(meetingFiles);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved meeting files"));
    }

    // 첨부파일 삭제
    @PostMapping("/files/delete")
    public ResponseEntity<ResponseMessage> deleteMeetingFile(@RequestBody List<MeetingFile> meetingFiles,
            HttpServletRequest request) {
        meetingService.deleteMeetingFile(meetingFiles);
        return ResponseEntityUtil
                .setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted meeting files"));
    }

    // // issue 조회
    // @GetMapping("/issue")
    // public List<MeetingIssue> getMeetingIssue(@RequestParam("meet-id") String
    // meetId) {
    // return meetingService.getMeetingIssue(meetId);
    // }

    // // issue 저장
    // @PostMapping("/issue")
    // public ResponseEntity<ResponseMessage> saveMeetingIssue(@RequestBody
    // List<MeetingIssue> meetingIssues,
    // HttpServletRequest request) {
    // meetingService.saveMeetingIssue(meetingIssues);
    // return ResponseEntityUtil.setResponseEntity(new
    // ResponseMessage(HttpStatus.OK.value(), "Saved meeting issue"));
    // }

    // // issue 삭제
    // @PostMapping("/issue/delete")
    // public ResponseEntity<ResponseMessage> deleteMeetingIssue(@RequestBody
    // List<MeetingIssue> meetingIssues,
    // HttpServletRequest request) {
    // meetingService.deleteMeetingIssue(meetingIssues);
    // return ResponseEntityUtil
    // .setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Deleted
    // meeting issue"));
    // }

    // 이전 회의록 복사
    @PostMapping("/copy")
    public ResponseEntity<ResponseMessage> copyMeeting(@RequestBody Map<String, Object> param,
            HttpServletRequest request) {
        AuthenticationInfo authenticationInfo = authenticationManager.getAuthenticationInfo();

        String meetId = (String) param.get("meetId");
        MeetingMaster sourceMeeting = meetingService.getMeeting(meetId);

        sourceMeeting.setMeetOwnerId(authenticationInfo.getUserId());
        java.sql.Date targetDt = QueryHandler.getDate(param.get("targetDt"));
        String postApply = (String) param.get("postApply");

        List keyCopy = (List) param.get("keyCopy");
        List extraCopy = (List) param.get("extraCopy");

        meetingService.copyMeeting(sourceMeeting, targetDt, postApply, keyCopy, extraCopy);
        return ResponseEntityUtil.setResponseEntity(new ResponseMessage(HttpStatus.OK.value(), "Saved meeting"));
    }

}
