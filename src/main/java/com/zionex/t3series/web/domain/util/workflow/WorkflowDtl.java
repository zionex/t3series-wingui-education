package com.zionex.t3series.web.domain.util.workflow;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zionex.t3series.web.util.audit.BaseEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_UT_WORKFLOW_DTL")
public class WorkflowDtl extends BaseEntity {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "WORKFLOW_ID")
    private String workflowId;

    @Column(name = "WORK_NM")
    private String workNm;

    @Column(name = "DESC_TXT")
    private String descTxt;

    @Column(name = "WORK_SEQ")
    private Integer workSeq;

    @Column(name = "MENU_CD")
    private String menuCd;

    @Column(name = "ATTR_01")
    private String attr01;

    @Column(name = "ATTR_02")
    private String attr02;
    
    @Column(name = "ATTR_03")
    private String attr03;

    @Column(name = "ATTR_04")
    private String attr04;

    @Column(name = "ATTR_05")
    private String attr05;

}
