package com.zionex.t3series.web.domain.util.dashboard;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zionex.t3series.web.util.audit.BaseEntity;
import com.zionex.t3series.web.util.converter.BooleanToYNConverter;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_UT_DASHBOARD")
public class Dashboard extends BaseEntity {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "MENU_CD")
    private String menuCd;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "DESCRIP")
    private String descrip;

    @Column(name = "JSON_DATA")
    private String jsonData;

    @Column(name = "DEL_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean delYn;

}
