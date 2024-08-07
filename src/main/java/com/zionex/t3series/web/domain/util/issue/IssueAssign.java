package com.zionex.t3series.web.domain.util.issue;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zionex.t3series.web.util.audit.BaseEntity;
import com.zionex.t3series.web.util.converter.BooleanToYNConverter;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = false)
@Table(name = "TB_UT_ISSUE_ASSIGN")
@Entity
@IdClass(IssueAssignPK.class)
public class IssueAssign extends BaseEntity {

    @Id
    private String issueId;

    @Id
    private int seq;

    @Column(name = "ASSIGNEE")
    private String assignee;

    @Column(name = "GRP_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean grpYn = false;

    @Column(name = "USER_TP")
    private String userTp = "S";

    @Transient
    private String recieverDisplayName;

}
