package com.zionex.t3series.web.domain.snop.meeting;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zionex.t3series.web.util.audit.BaseEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = false)
@Table(name = "TB_SA_MEET_ATTENDEE")
@Entity
public class MeetingAttendee extends BaseEntity {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "MEET_ID")
    private String meetId;

    @Column(name = "USER_ID")
    private String userId;

    @Transient
    private String username;

    @Transient
    private String department;

    @Transient
    private String businessValue;

    @Transient
    private String email;

    @Transient
    private String phone;

    // @Transient
    // private String meetDt;

}
