package com.zionex.t3series.web.domain.snop.dashboardfact;

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
@Table(name = "TB_SA_AGGR_MST")
public class AggrMst extends BaseEntity {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "SEQ")
    private Integer seq;

    @Column(name = "AGGR_ID")
    private String aggrId;

    @Column(name = "AGGR_NAME")
    private String aggrName;

    @Column(name = "AGGR_LVL1")
    private String aggrLvl1;

    @Column(name = "AGGR_LVL2")
    private String aggrLvl2;

    @Column(name = "AGGR_LVL3")
    private String aggrLvl3;

    @Column(name = "AGGR_LVL4")
    private String aggrLvl4;

    @Column(name = "AGGR_LVL5")
    private String aggrLvl5;

    @Column(name = "AGGR_SQL1")
    private String aggrSql1;

    @Column(name = "AGGR_SQL2")
    private String aggrSql2;

    @Column(name = "AGGR_SQL3")
    private String aggrSql3;

    @Column(name = "AGGR_SQL4")
    private String aggrSql4;

    @Column(name = "AGGR_SQL5")
    private String aggrSql5;
}
