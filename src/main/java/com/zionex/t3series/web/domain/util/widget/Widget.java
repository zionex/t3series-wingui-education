package com.zionex.t3series.web.domain.util.widget;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zionex.t3series.web.util.audit.BaseEntity;
import com.zionex.t3series.web.util.converter.BooleanToYNConverter;

import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@JsonIgnoreProperties
@Entity
@Table(name = "TB_UT_WIDGET")
public class Widget extends BaseEntity {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "PARENT_ID")
    private String parentId;

    @Column(name = "WIDGET_CD")
    private String widgetCd;

    @Column(name = "WIDGET_PATH")
    private String widgetPath;

    @Column(name = "WIDGET_TP")
    private String widgetTp;

    @Column(name = "WIDGET_SEQ")
    private Integer widgetSeq;

    @Column(name = "WIDGET_ICON")
    private String widgetIcon;

    @Column(name = "USE_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean useYn;

}
