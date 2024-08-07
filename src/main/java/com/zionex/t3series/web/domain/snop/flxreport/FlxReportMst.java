package com.zionex.t3series.web.domain.snop.flxreport;

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
@Table(name = "TB_SA_FLX_RPT_MST")
public class FlxReportMst extends BaseEntity {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "SEQ")
    private Integer seq;

    @Column(name = "AGGR_ID")
    private String aggrId;

    @Column(name = "TYPE")
    private String type;

    @Column(name = "NAME")
    private String name;

    @Column(name = "DESCR")
    private String descr;

    @Column(name = "JSON_TXT")
    private String jsonTxt;

    @Column(name = "PIVOT_SETTINGS")
    private String pivotSettings;

    @Column(name = "SQL1")
    private String sql1;

    @Column(name = "SQL2")
    private String sql2;

    @Column(name = "SQL3")
    private String sql3;

    @Column(name = "SQL4")
    private String sql4;

    @Column(name = "SQL5")
    private String sql5;

    @Column(name = "USE_YN")
    private String useYn;
}
