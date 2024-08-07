package com.zionex.t3series.web.domain.admin.theme;

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
@Entity
@Table(name = "TB_AD_THEME_DTL")
public class ThemeDetail extends BaseEntity {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "THEME_CD")
    private String themeCd;

    @Column(name = "REFER_CD")
    private String referCd;

    @Column(name = "CATEGORY")
    private String category;

    @Column(name = "PROP_TP")
    private String propType;

    @Column(name = "PROP_KEY")
    private String propKey;

    @Column(name = "PROP_VAL")
    private String propValue;

    @Column(name = "DESCRIP")
    private String descrip;

    @Column(name = "DEFAULT_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean defaultYn = false;
    
    @Transient
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean editYn = false;

    @Transient
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean commonYn = false;
}
