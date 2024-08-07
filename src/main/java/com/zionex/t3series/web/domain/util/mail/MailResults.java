package com.zionex.t3series.web.domain.util.mail;

import org.springframework.data.domain.Page;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MailResults {

    private Page<Mail> pageContent;
    private Page<Mail> pageComment;

}
