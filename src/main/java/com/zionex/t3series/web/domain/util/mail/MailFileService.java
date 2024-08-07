package com.zionex.t3series.web.domain.util.mail;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailFileService {

    private final MailFileRepository mailFileRepository;

    public List<MailFile> getMailFiles(String mailId) {
        return mailFileRepository.findByMailId(mailId);
    }

    public void saveMailFile(MailFile mailFile) {
        mailFileRepository.save(mailFile);
    }

}
