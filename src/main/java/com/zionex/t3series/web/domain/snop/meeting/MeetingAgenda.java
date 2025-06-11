package com.zionex.t3series.web.domain.snop.meeting;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zionex.t3series.web.util.audit.BaseEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = false)
@Table(name = "TB_SA_MEET_AGENDA")
@Entity
public class MeetingAgenda extends BaseEntity {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "MEET_ID")
    private String meetId;

    @Column(name = "AGENDA_TITLE")
    private String agendaTitle;

    @Column(name = "AGENDA_CONTENTS")
    private String agendaContents;

    @Column(name = "SEQ")
    private Integer seq;

}
