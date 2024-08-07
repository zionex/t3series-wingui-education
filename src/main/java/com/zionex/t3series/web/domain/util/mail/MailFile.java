package com.zionex.t3series.web.domain.util.mail;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zionex.t3series.web.util.audit.BaseEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "TB_UT_MAIL_FILE")
@IdClass(MailFile.class)
public class MailFile extends BaseEntity implements Serializable {

    @Id
    @Column(name = "MAIL_ID")
    private String mailId;

    @Id
    @Column(name = "FILE_STORAGE_ID")
    private int fileStorageId;

}
