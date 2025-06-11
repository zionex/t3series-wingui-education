package com.zionex.t3series.web.domain.snop.meeting;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
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
@Table(name = "TB_SA_MEET_FILE")
@Entity
public class MeetingFile extends BaseEntity {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "ID")
    private String id;

    @Column(name = "MEET_ID")
    private String meetId;

    @Column(name = "AGENDA_ID")
    private String agendaId;

    @Column(name = "FILE_STORAGE_ID")
    private int fileStorageId;

    @Transient
    private Integer agendaSeq;

    @Column(name = "SEQ")
    private Integer seq;

}
