package com.zionex.t3series.web.domain.util.mail;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zionex.t3series.web.util.audit.BaseEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = false)
@Table(name = "TB_UT_MAIL_RECIEVER")
@Entity
@IdClass(MailRecieverPK.class)
public class MailReciever extends BaseEntity {

    @Id
    private String mailId;

    @Id
    private int seq;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "RECIEVER_TP")
    private String recieverTp = "T";

    @Transient
    private String recieverDisplayName;

}
