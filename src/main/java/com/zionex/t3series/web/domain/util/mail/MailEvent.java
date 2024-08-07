package com.zionex.t3series.web.domain.util.mail;

public class MailEvent {

    private String mailId;

    public MailEvent(String mailId) {
        this.mailId = mailId;
    }

    public String getMailId() {
        return this.mailId;
    }

}
