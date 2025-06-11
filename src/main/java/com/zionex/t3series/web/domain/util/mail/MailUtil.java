package com.zionex.t3series.web.domain.util.mail;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.zionex.t3series.web.domain.admin.user.User;
import com.zionex.t3series.web.domain.admin.user.UserService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MailUtil {

    private final MailService mailService;
    private final UserService userService;

    /**
     * @param title
     * @param sender  : USERNAME
     * @param recievers      : ID
     * @param cc      : ID
     * @param Content
     * @param files
     */
    public void sendMailWithId(String title, String sender, List<String> recievers, List<String> cc, String Content, ArrayList<Integer> files) {
        User user = userService.getUser(sender);
        if (user.getEmail() == null) {
            return;
        }

        Mail mail = new Mail();
        mail.setSender(user.getEmail());
        mail.setTitle(title);
        mail.setContent(Content);
        mail.setContentTp("HTML");
        mail.setTryCnt(0);
        mail.setStatus("0"); // 0: 등록됨, 1: 보내는중, 2: 완료, 999: 에러

        List<MailFile> fileList = new ArrayList<MailFile>();

        if (files != null) {
            files.forEach(fileId -> {
                MailFile file = new MailFile();
                file.setFileStorageId(fileId);
                fileList.add(file);
            });
        }
        mail.setFiles(fileList);

        List<MailReciever> mailReciever = new ArrayList<MailReciever>();

        if (recievers != null) {
            recievers.forEach(username -> {
                User mailUser = userService.getUser(username);
                if (mailUser != null) {
                    MailReciever reciever = new MailReciever();
                    reciever.setEmail(mailUser.getEmail());
                    reciever.setUserId(mailUser.getUsername());

                    mailReciever.add(reciever);
                }
            });
        }

        mail.setRecievers(mailReciever);
        mailService.saveMail(mail);
    }

}
