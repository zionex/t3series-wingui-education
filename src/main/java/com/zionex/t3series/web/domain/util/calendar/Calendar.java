package com.zionex.t3series.web.domain.util.calendar;

//import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zionex.t3series.web.util.audit.BaseEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = false)
@Table(name = "TB_UT_CALENDAR")
@Entity
public class Calendar extends BaseEntity {

    public Calendar copy(Calendar cal) {
        // id를 제외하고 모두 복사
        this.categoryId = cal.categoryId;
        this.userId = cal.userId;
        this.schId = cal.schId;
        this.schNm = cal.schNm;
        this.schStartDttm = cal.schStartDttm;
        this.schEndDttm = cal.schEndDttm;
        this.fullDayYn = cal.fullDayYn;
        this.meetId = cal.meetId;
        this.repeatTp = cal.repeatTp;
        this.memo = cal.memo;

        return this;
    }

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "CATEGORY_ID")
    private String categoryId;

    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "SCH_ID")
    private String schId;

    @Column(name = "SCH_NM")
    private String schNm;

    @Column(name = "SCH_START_DTTM")
    private java.sql.Timestamp schStartDttm;

    @Column(name = "SCH_END_DTTM")
    private java.sql.Timestamp schEndDttm;

    @Column(name = "FULL_DAY_YN")
    private String fullDayYn;

    @Column(name = "MEET_ID")
    private String meetId;

    @Column(name = "REPEAT_TP")
    private String repeatTp;

    @Column(name = "MEMO")
    private String memo;

    @Transient
    private String categoryNm;

    @Transient
    private String categoryColor;

    @Transient
    private String canDeleteYn;
    
    @Transient
    private ArrayList<Integer> files;

    @PrePersist
    public void setDefaultValue() {
        if (schId == null) {
            schId = UUID.randomUUID().toString().replace("-", "");
        }
    }
}
