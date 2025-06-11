package com.zionex.t3series.web.domain.snop.meeting;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zionex.t3series.web.util.audit.BaseEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = false)
@Table(name = "TB_SA_MEET_MST")
@Entity
public class MeetingMaster extends BaseEntity {

    public MeetingMaster copy(MeetingMaster meeting) {
        // id를 제외하고 모두 복사
        this.id = meeting.id;
        this.meetSubject = meeting.meetSubject;
        this.meetOwnerId = meeting.meetOwnerId;
        this.meetStartDttm = meeting.meetStartDttm;
        this.meetEndDttm = meeting.meetEndDttm;
        this.mailSendYn = meeting.mailSendYn;
        this.delYn = meeting.delYn;

        return this;
    }

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "MEET_SUBJECT")
    private String meetSubject;

    @Column(name = "MEET_OWNER_ID")
    private String meetOwnerId;

    @Column(name = "MEET_START_DTTM")
    private java.sql.Timestamp meetStartDttm;    

    @Column(name = "MEET_END_DTTM")
    private java.sql.Timestamp meetEndDttm;    

    @Column(name = "MAIL_SEND_YN")
    private String mailSendYn;

    @Column(name = "DEL_YN")
    private String delYn;

    @Transient
    private String meetId;

    @Transient
    private String minutes;

    // 캘린더 단순조회 위한 컬럼
    @Transient
    private String userId;

    @Transient
    private String categoryId;

    @Transient
    private String categoryNm;

    @Transient
    private String categoryColor;

    @Transient
    private String schId;

    @Transient
    private String schNm;

    @Transient
    private String schStartDttm;

    @Transient
    private String schEndDttm;

    @Transient
    private List<MeetingAgenda> agenda;

    @Transient
    private List<MeetingAttendee> attendee;

    @Transient
    private List<MeetingFile> uploadfiles;

    @Transient
    private List<MeetingFileInfo> files;

    @Transient
    private List<MeetingMenu> menu;
    
}
