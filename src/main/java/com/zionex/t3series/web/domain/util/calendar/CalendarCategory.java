package com.zionex.t3series.web.domain.util.calendar;

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
@Table(name = "TB_UT_CALENDAR_CATEGORY")
@Entity
public class CalendarCategory extends BaseEntity {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "CATEGORY_NM")
    private String categoryNm;

    @Column(name = "CATEGORY_COLOR")
    private String categoryColor;

    @Column(name = "USE_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean useYn = true;

    @Column(name = "GRP_SHARE_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean grpShareYn = false;

    @Column(name = "DEFAULT_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean defaultYn = false;

    @Transient
    private String canDeleteYn;

}
