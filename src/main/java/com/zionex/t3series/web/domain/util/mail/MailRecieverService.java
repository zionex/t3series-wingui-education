package com.zionex.t3series.web.domain.util.mail;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailRecieverService {
    
    private final MailRecieverRepository mailRecieverRepository;

    public List<MailReciever> getMailRecievers(String mailId) {
        return mailRecieverRepository.findByMailId(mailId);
    }

    public void saveMailReciever(MailReciever mailReciever) {
        mailRecieverRepository.save(mailReciever);
    }

}
