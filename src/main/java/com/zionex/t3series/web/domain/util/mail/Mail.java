package com.zionex.t3series.web.domain.util.mail;

import java.util.List;

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
@Entity
@Table(name = "TB_UT_MAIL")
public class Mail extends BaseEntity {

    @Id
    @GeneratedValue(generator = "generator-uuid")
    @GenericGenerator(name = "generator-uuid", strategy = "uuid")
    @Column(name = "MAIL_ID ")
    private String mailId;

    @Column(name = "SENDER")
    private String sender;

    @Column(name = "TITLE")
    private String title;

    @Column(name = "CONTENT")
    private String content;

    @Column(name = "CONTENT_TP")
    private String contentTp;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "TRY_CNT")
    private int tryCnt = 0;

    @Column(name = "ERR_CAUSE")
    private String errCause;

    @Transient
    private List<MailReciever> recievers;

    @Transient
    private List<MailFile> files;

    @Transient
    private String senderDisplayName;

}
