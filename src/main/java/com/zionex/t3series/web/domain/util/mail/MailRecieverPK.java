package com.zionex.t3series.web.domain.util.mail;

import java.io.Serializable;

import javax.persistence.Column;

import lombok.Data;

@Data
public class MailRecieverPK implements Serializable {

    private static final long serialVersionUID = 6999079390979244121L;

    @Column(name = "MAIL_ID")
    private String mailId;

    @Column(name = "SEQ")
    private int seq;

}
