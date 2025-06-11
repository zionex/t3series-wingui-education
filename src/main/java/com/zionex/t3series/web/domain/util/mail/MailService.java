package com.zionex.t3series.web.domain.util.mail;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zionex.t3series.web.domain.admin.user.User;
import com.zionex.t3series.web.domain.admin.user.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;

@Log
@Service
@Transactional
@RequiredArgsConstructor
public class MailService {

    private final MailRepository mailRepository;
    private final MailQueryRepository mailQueryRepository;

    private final MailFileService mailFileService;
    private final MailRecieverService mailRecieverService;
    private final UserService userService;

    private final ApplicationEventPublisher publisher;

    public Page<Mail> getMails(String userId, String search, String searchOpt, int page, int size) {
        Page<Mail> pageContent = mailQueryRepository.getMailList(userId, search, searchOpt, PageRequest.of(page, size));
        pageContent.forEach(mail -> {
            User user = userService.getUser(mail.getCreateBy());
            String displayName = user.getDisplayName();
            if (displayName == null) {
                mail.setSenderDisplayName(mail.getCreateBy());
            } else {
                mail.setSenderDisplayName(displayName);
            }
            List<MailReciever> recievers = mailRecieverService.getMailRecievers(mail.getMailId());
            mail.setRecievers(recievers);

            List<MailFile> mailFiles = mailFileService.getMailFiles(mail.getMailId());
            mail.setFiles(mailFiles);
        });

        return pageContent;
    }

    public List<Mail> getProcessingMails() {
        List<Mail> mailList = mailQueryRepository.getProcessingMailList();
        mailList.forEach(mail -> {
            User user = userService.getUser(mail.getSender());
            String displayName = user.getDisplayName();
            if (displayName == null) {
                mail.setSenderDisplayName(mail.getSender());
            } else {
                mail.setSenderDisplayName(displayName);
            }
            List<MailReciever> recievers = mailRecieverService.getMailRecievers(mail.getMailId());
            mail.setRecievers(recievers);

            List<MailFile> mailFiles = mailFileService.getMailFiles(mail.getMailId());
            mail.setFiles(mailFiles);

        });

        return mailList;
    }

    public Mail getMail(String mailId) {
        Mail mail = getMailById(mailId);
        if (mail == null) {
            return null;
        }

        User user = userService.getUser(mail.getCreateBy());
        String displayName = user.getDisplayName();
        if (displayName == null) {
            mail.setSenderDisplayName(mail.getCreateBy());
        } else {
            mail.setSenderDisplayName(displayName);
        }
        List<MailReciever> recievers = mailRecieverService.getMailRecievers(mailId);
        mail.setRecievers(recievers);

        List<MailFile> mailFiles = mailFileService.getMailFiles(mailId);
        mail.setFiles(mailFiles);

        return mail;
    }

    public Mail getMailById(String mailId) {
        return mailRepository.findById(mailId).orElse(null);
    }

    private static boolean isEmptyOrNull(String str) {
        if (str != null && !str.isEmpty()) {
            return false;
        } else {
            return true;
        }
    }

    public void saveMail(Mail mail) {
        if (!this.isValidUpdate(mail)) {
            return;
        }

        mail.setContent(cleanXss(mail.getContent()));
        String mailId = mailRepository.save(mail).getMailId();

        AtomicInteger cnt = new AtomicInteger(0);
        if (mail.getRecievers() != null) {
            mail.getRecievers().forEach(reciever -> {
                reciever.setMailId(mailId);
                reciever.setSeq(cnt.getAndIncrement());
                String userId = reciever.getUserId();
                String email = reciever.getEmail();
                if (isEmptyOrNull(userId) == false && isEmptyOrNull(email)) {
                    User user = userService.getUserById(userId);
                    if (user != null) {
                        reciever.setEmail(user.getEmail());
                    }
                }
                mailRecieverService.saveMailReciever(reciever);
            });
        }

        if (mail.getFiles() != null) {
            mail.getFiles().forEach(mailFile -> {
                mailFile.setMailId(mailId);
                mailFileService.saveMailFile(mailFile);
            });
        }

        publisher.publishEvent(new MailEvent(mailId));
    }

    public void updateProcessMail(Mail mail) {
        mail.setModifyDttm(LocalDateTime.now());
        mailRepository.save(mail);
    }

    private boolean isValidUpdate(Mail mail) {
        String mailId = mail.getMailId();
        String updateUserId = mail.getModifyBy();

        if (mailId != null) {
            Mail originMail = getMailById(mailId);
            if (originMail == null) {
                log.info(String.format("Invalid mail id (%s)", mailId));
                return false;
            }
            String owner = originMail.getCreateBy();
            if (owner == null || updateUserId == null || !owner.equals(updateUserId)) {
                log.info(String.format("The user(%s) does not have permission to update.", updateUserId));
                return false;
            }
        }
        return true;
    }

    private String cleanXss(String value) {
        if (value == null || value.trim() == "") {
            return value;
        }

        String cleanedValue = value;
        cleanedValue = cleanedValue.replaceAll("(?i)javascript", "x-javascript");
        cleanedValue = cleanedValue.replaceAll("(?i)script", "x-script");
        cleanedValue = cleanedValue.replaceAll("(?i)iframe", "x-iframe");
        cleanedValue = cleanedValue.replaceAll("(?i)document", "x-document");
        cleanedValue = cleanedValue.replaceAll("(?i)vbscript", "x-vbscript");
        cleanedValue = cleanedValue.replaceAll("(?i)applet", "x-applet");
        cleanedValue = cleanedValue.replaceAll("(?i)embed", "x-embed"); // embed 태그를 사용하지 않을 경우만
        cleanedValue = cleanedValue.replaceAll("(?i)object", "x-object"); // object 태그를 사용하지 않을 경우만
        cleanedValue = cleanedValue.replaceAll("(?i)frame", "x-frame");
        cleanedValue = cleanedValue.replaceAll("(?i)grameset", "x-grameset");
        cleanedValue = cleanedValue.replaceAll("(?i)layer", "x-layer");
        cleanedValue = cleanedValue.replaceAll("(?i)bgsound", "x-bgsound");
        cleanedValue = cleanedValue.replaceAll("(?i)alert", "x-alert");
        cleanedValue = cleanedValue.replaceAll("(?i)onblur", "x-onblur");
        cleanedValue = cleanedValue.replaceAll("(?i)onchange", "x-onchange");
        cleanedValue = cleanedValue.replaceAll("(?i)onclick", "x-onclick");
        cleanedValue = cleanedValue.replaceAll("(?i)ondblclick", "x-ondblclick");
        cleanedValue = cleanedValue.replaceAll("(?i)onerror", "x-onerror");
        cleanedValue = cleanedValue.replaceAll("(?i)onfocus", "x-onfocus");
        cleanedValue = cleanedValue.replaceAll("(?i)onload", "x-onload");
        cleanedValue = cleanedValue.replaceAll("(?i)onmouse", "x-onmouse");
        cleanedValue = cleanedValue.replaceAll("(?i)onscroll", "x-onscroll");
        cleanedValue = cleanedValue.replaceAll("(?i)onsubmit", "x-onsubmit");
        cleanedValue = cleanedValue.replaceAll("(?i)onunload", "x-onunload");
        return cleanedValue;
    }

}
