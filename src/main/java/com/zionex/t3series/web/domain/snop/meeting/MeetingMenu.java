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
@Table(name = "TB_SA_MEET_MENU")
@Entity
public class MeetingMenu extends BaseEntity {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "MEET_ID")
    private String meetId;

    @Column(name = "AGENDA_ID")
    private String agendaId;

    @Column(name = "MENU_CD")
    private String menuCd;

    @Column(name = "LINK_TYPE")
    private String linkType;

    @Column(name = "URL_TITLE")
    private String urlTitle;

    @Column(name = "URL_LINK")
    private String urlLink;

    @Transient
    private String menuNm;

    @Transient
    private Integer agendaSeq;

    @Column(name = "SEQ")
    private Integer seq;

    // @Transient
    // private String meetDt;

}
