package com.zionex.t3series.web.domain.util.issue;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zionex.t3series.web.util.audit.BaseEntity;
import com.zionex.t3series.web.util.converter.BooleanToYNConverter;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = false)
@Table(name = "TB_UT_ISSUE")
@Entity
public class Issue extends BaseEntity {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "CONTENT")
    private String content;

    @Column(name = "GRP_ASSIGN_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean grpAssignYn;

    @Column(name = "START_DTTM")
    private LocalDateTime startDttm;

    @Column(name = "END_DTTM")
    private LocalDateTime endDttm;

    @Column(name = "PRIORITY")
    private String priority;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "MENU_CD")
    private String menuCd;

    @Column(name = "MAIL_YN")
    // @Convert(converter = BooleanToYNConverter.class)
    private String mailYn;

    @Column(name = "PUBLIC_YN")
    // @Convert(converter = BooleanToYNConverter.class)
    private String publicYn;

    @Column(name = "ISSUE_TP")
    private String issueType;

    @Transient
    private ArrayList<Integer> files;

    @Transient
    private List<String> assignees;

    @Transient
    private String createByDisplayName;

}
