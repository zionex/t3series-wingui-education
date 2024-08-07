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
@Table(name = "TB_SA_AGGR_FIELD_DESC")
public class FactFieldDesc extends BaseEntity {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "AGGR_ID")
    private String aggrId;

    @Column(name = "SEQ")
    private Integer seq;

    @Column(name = "FIELD")
    private String field;

    @Column(name = "DESCRIP")
    private String descrip;

    @Column(name = "HEADER_TEXT")
    private String headerText;

    @Column(name = "GROUP_TEXT")
    private String groupText;

    @Column(name = "COLUMN_TYPE")
    private String columnType;

    @Column(name = "DATA_TYPE")
    private String dataType;

    @Column(name = "DATA_WIDTH")
    private String dataWidth;

    @Column(name = "DATA_ALIGN")
    private String dataAlign;

    @Column(name = "DATA_FORMAT")
    private String dataFormat;

    @Column(name = "DATA_VISIBLE")
    private String dataVisible;

    @Column(name = "CHART_TYPE")
    private String chartType;

    @Column(name = "DATA_PREFIX")
    private String dataPreFix;

    @Column(name = "DATA_SUFFIX")
    private String dataSuffix;

    @Column(name = "CHART_COLOR")
    private String chartColor;

    @Column(name = "CONDITION_YN")
    private String conditionYn;
    
    @Column(name = "CONDITION_TYPE")
    private String conditionType;

    @Column(name = "CONDITION_FORMAT")
    private String conditionFormat;

    @Column(name = "CONDITION_ITEM")
    private String conditionItem;

    @Column(name = "CONDITION_OPRT")
    private String conditionOprt;
    
    @Column(name = "CONDITION_PARAM")
    private String conditionParam;
    
    @Column(name = "CONDITION_DEFAULT")
    private String conditionDefault;
}
