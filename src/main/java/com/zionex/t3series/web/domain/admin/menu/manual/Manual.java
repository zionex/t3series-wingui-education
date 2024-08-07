package com.zionex.t3series.web.domain.admin.menu.manual;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.zionex.t3series.web.util.audit.BaseEntity;
import com.zionex.t3series.web.util.converter.BooleanToYNConverter;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
@JsonIgnoreProperties
@Entity
@Table(name = "TB_AD_MANUAL")
public class Manual extends BaseEntity {

    @Id
    @Column(name = "MENU_CD")
    private String menuCd;

    @Column(name = "MANUAL_PATH")
    private String manualPath;

    @Column(name = "FILE_EXTENSION")
    private String fileExtension = "HTML";

    @Column(name = "USE_YN")
    @Convert(converter = BooleanToYNConverter.class)
    private Boolean useYn = true;

    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @Column(name = "CREATED_DTTM", updatable = false)
    private LocalDateTime createDttm;

}
