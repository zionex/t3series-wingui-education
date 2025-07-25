package com.zionex.t3series.web.domain.util.mail;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.servlet.ServletContext;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.zionex.t3series.ApplicationProperties;
import com.zionex.t3series.ApplicationProperties.Service.Mailing;
import com.zionex.t3series.ApplicationProperties.Service.Mailing.Smtp;
import com.zionex.t3series.web.domain.util.filestorage.FileStorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;

@Log
@Component
@RequiredArgsConstructor
public class MailTask {

    public static boolean mailAgentCheck = false;
    public static boolean useThisMailAgent = false;

    private final MailService mailService;
    private final FileStorageService fileStorageService;
    private final ApplicationProperties applicationProperties;

    public void sendMail(List<Mail> mails) {
        Mailing mailing = applicationProperties.getService().getMailing();
        if (mailing == null) {
            return;
        }

        Smtp smtp = mailing.getSmtp();
        if (smtp == null) {
            return;
        }

        final String username = smtp.getUsername();
        final String password = smtp.getPassword();

        Properties prop = new Properties();
        prop.put("mail.smtp.host", smtp.getHost());
        prop.put("mail.smtp.port", smtp.getPort());

        if (StringUtils.isNotEmpty(password)) {
            prop.put("mail.smtp.auth", "true");
        }

        String trustedServer = smtp.getTrust();
        if (StringUtils.isNotEmpty(trustedServer)) {
            prop.put("mail.smtp.ssl.trust", trustedServer);
        } else {
            prop.put("mail.smtp.ssl.trust", "*");
        }

        /** smtp는 tls가 기본 */
        prop.put("mail.smtp.ssl.enable", "false");

        // jdk11 부터 TLSv1.2이 disable 되어 있다.
        // java.security 에서 jdk.tls.disabledAlgorithms 에서 TLSv1.2는 제외시켜준다.
        // 예) java.security 파알 예.
        // usr/lib/jvm/java-11-openjdk-adm64/conf/security/java.security

        // "TLSv1.2" 이상이어야 함
        String protocols = smtp.getProtocols();
        if (StringUtils.isNotEmpty(protocols)) {
            prop.put("mail.smtp.ssl.protocols", protocols);
        }
        prop.put("mail.smtp.starttls.enable", "true"); // TLS

        Session tempsession = null;
        if (StringUtils.isNotEmpty(password)) {
            tempsession = Session.getInstance(prop, new javax.mail.Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(username, password);
                }
            });
        } else {
            tempsession = Session.getInstance(prop);
        }

        final Session session = tempsession;

        mails.forEach(mail -> {
            int tryCnt = mail.getTryCnt();
            try {
                Message message = getMessage(session, mail);
                if (message != null) {
                    try {
                        Transport.send(message);

                        mail.setTryCnt(tryCnt + 1);
                        mail.setStatus("2");
                        mailService.updateProcessMail(mail);

                    } catch (MessagingException e) {
                        log.severe("Error sending mail");

                        if (tryCnt >= 3) {
                            mail.setStatus("999");
                        }

                        mail.setErrCause(e.getMessage());
                        mail.setTryCnt(tryCnt + 1);
                        mailService.updateProcessMail(mail);
                    }
                } else {
                    mail.setStatus("999");
                    mail.setErrCause("Cannot send mail. Invalid reciever or Invalid sender");
                    mail.setTryCnt(tryCnt + 1);
                    mailService.updateProcessMail(mail);
                }
            } catch (Exception e) {
                log.severe(e.getMessage());

                mail.setStatus("999");
                mail.setErrCause(e.getMessage());
                mail.setTryCnt(tryCnt + 1);
                mailService.updateProcessMail(mail);
            }
        });
    }

    @Autowired
    ServletContext context;
    private static final String PATH_SEPARATOR = "/";

    private String[] toMailImageFile(String type, String data) {
        Mailing mailing = applicationProperties.getService().getMailing();
        Smtp smtp = mailing.getSmtp();
        if (smtp == null) {
            return null;
        }

        final String baseUrl = smtp.getImagerooturl();

        final ApplicationProperties.Service.File fileProps = applicationProperties.getService().getFile();
        String externalPath = fileProps.getExternalPath();
        String imagePath = externalPath + fileProps.getName() + PATH_SEPARATOR + fileProps.getCategory().getTemporary();

        String rootPath = imagePath;
        String uuid = getUuid();
        String today = getTodayDate();

        String fileExt = type.split("/")[1];
        String filename = uuid + "." + fileExt;
        String srcUrl = baseUrl + "/externalimage" + PATH_SEPARATOR + today + PATH_SEPARATOR + filename;
        String absolutePath = rootPath + PATH_SEPARATOR + today;
        String absoluteFilePath = absolutePath + PATH_SEPARATOR + filename;

        File fileDir = new File(absolutePath);

        if (!(fileDir.exists() || fileDir.mkdirs())) {
            return null;
        }

        byte[] imageBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(data);

        try (FileOutputStream out = new FileOutputStream(absoluteFilePath)) {
            out.write(imageBytes);
        } catch (IOException e) {
            log.severe("Error writing image file : " + e.getMessage());
            srcUrl = null;
        }

        String[] ret = new String[2];
        ret[0] = srcUrl;
        ret[1] = absoluteFilePath;

        return ret;
    }

    private String getContentType(String prefix) {
        if (prefix.isEmpty() || prefix == null) {
            return null;
        }

        String ret = prefix.replace("data:", "");
        ret = ret.replace(",", "");
        ret = ret.replace("base64", "");
        ret = ret.replace(";", "");

        return ret;
    }

    private String getUuid() {
        return UUID.randomUUID().toString();
    }

    private String getTodayDate() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    }

    /**
     * Embeded Image인 경우 메일 Client에서 block 되는 경우가 있다.
     * 이미지를 link를 바꾸어 주든지 아니면 attach 한 후 CID를
     * data:image/png;base64,
     */
    private String preProcessContent(String content, List<MimeBodyPart> list) {
        String pContent = content;
        Document doc = Jsoup.parse(content);
        Elements images = doc.select("img");
        if (images.isEmpty()) {
            return pContent;
        }
        else {
            boolean embededImage = false;
            for (int i = 0; i < images.size(); i++) {
                Element el = images.get(i);
                String srcString = el.attr("src");
                // embeded image
                String[] srcStringArr = srcString.split(",");
                if (srcStringArr.length == 2) {
                    String ctype = getContentType(srcStringArr[0]);
                    String base64Image = srcStringArr[1];

                    if (ctype != null && ctype.startsWith("image")) {
                        try {
                            String[] imageUrl = toMailImageFile(ctype, base64Image);

                            MimeBodyPart atchImagePart = new MimeBodyPart();
                            String cid = getUuid();
                            atchImagePart.setHeader("Content-ID", cid);
                            atchImagePart.setDisposition(MimeBodyPart.INLINE);
                            atchImagePart.attachFile(imageUrl[1]);
                            el.attr("src", "cid:" + cid);
                            list.add(atchImagePart);

                            // el.attr("src", imageUrl[0]);
                            embededImage = true;

                        } catch (Exception e) {
                            log.severe("Error processing embedded image : " + e.getMessage());
                        }
                    }
                }
            }
            if (embededImage) {
                pContent = doc.html();
            }
        }
        return pContent;
    }

    private Message getMessage(Session session, Mail mail) {
        try {
            Message message = new MimeMessage(session);

            List<MailReciever> recievers = mail.getRecievers();
            if (recievers == null || recievers.isEmpty()) {
                return null;
            }

            List<InternetAddress> toList = new ArrayList<>();
            List<InternetAddress> ccList = new ArrayList<>();

            recievers.forEach(reciever -> {
                try {
                    InternetAddress address = new InternetAddress(reciever.getEmail());
                    if ("T".equals(reciever.getRecieverTp())) {
                        toList.add(address);
                    } else if ("C".equals(reciever.getRecieverTp())) {
                        ccList.add(address);
                    }
                } catch (Exception e) {
                    log.severe("Invalid email address: " + reciever.getEmail());
                }
            });

            if (toList.isEmpty()) {
                return null;
            }

            message.setFrom(new InternetAddress(mail.getSender()));
            message.setRecipients(Message.RecipientType.TO, toList.toArray(new InternetAddress[0]));

            if (!ccList.isEmpty()) {
                message.setRecipients(Message.RecipientType.CC, ccList.toArray(new InternetAddress[0]));
            }

            message.setSubject(mail.getTitle());

            List<MimeBodyPart> embeddedImages = new ArrayList<>();
            String processedContent = preProcessContent(mail.getContent(), embeddedImages);

            List<MailFile> files = mail.getFiles();
            if ((files != null && !files.isEmpty()) || !embeddedImages.isEmpty()) {
                Multipart multipart = new MimeMultipart();
                BodyPart messageBodyPart = new MimeBodyPart();

                if ("html".equalsIgnoreCase(mail.getContentTp())) {
                    messageBodyPart.setContent(processedContent, "text/html;charset=UTF-8");
                } else {
                    messageBodyPart.setText(processedContent);
                }

                multipart.addBodyPart(messageBodyPart);

                files.forEach(file -> {
                    try {
                        BodyPart atchFilePart = new MimeBodyPart();
                        String filename = fileStorageService.getAbsoluteFilePath(file.getFileStorageId());
                        DataSource source = new FileDataSource(filename);
                        atchFilePart.setDataHandler(new DataHandler(source));
                        atchFilePart.setFileName(filename);
                        multipart.addBodyPart(atchFilePart);
                    } catch (Exception e) {
                        log.severe("Error attaching file : " + e.getMessage());
                    }
                });

                embeddedImages.forEach(image -> {
                    try {
                        multipart.addBodyPart(image);
                    } catch (Exception e) {
                        log.severe("Error adding embedded image : " + e.getMessage());
                    }
                });
                message.setContent(multipart);
            } else {
                if ("html".equalsIgnoreCase(mail.getContentTp())) {
                    message.setContent(processedContent, "text/html;charset=UTF-8");
                } else {
                    message.setText(processedContent);
                }
            }
            return message;
        } catch (MessagingException e) {
            log.severe("Error creating email message : " + e.getMessage());
        }
        return null;
    }

    @Scheduled(fixedRateString = "${app.service.mailing.polling-rate}")
    public void processMail() {
        internalProcessMail(true);
    }

    public void internalProcessMail(boolean agent) {
        synchronized (this) {
            if (!agent || isMailAgent()) {
                List<Mail> mailList = mailService.getProcessingMails();
                if (mailList != null && mailList.size() > 0) {
                    sendMail(mailList);
                }
            }
        }
    }

    @Async
    @EventListener
    public void sendPush(MailEvent event) throws InterruptedException {
        internalProcessMail(false);
    }

    private boolean isMailAgent() {
        if (mailAgentCheck) {
            return useThisMailAgent;
        }

        Mailing mailing = applicationProperties.getService().getMailing();
        Smtp smtp = mailing.getSmtp();
        String mailServerIp = smtp.getMailagentip();

        if (StringUtils.isEmpty(mailServerIp)) {
            return false;
        }

        if (mailServerIp.equalsIgnoreCase("localhost")) {
            mailAgentCheck = true;
            useThisMailAgent = true;
            return true;
        }

        try {
            NetworkInterface.getNetworkInterfaces().asIterator()
                    .forEachRemaining(n -> n.getInetAddresses().asIterator()
                            .forEachRemaining(i -> {
                                if (i.getHostAddress().equalsIgnoreCase(mailServerIp)) {
                                    useThisMailAgent = true;
                                    mailAgentCheck = true;
                                }
                            }));
        } catch (SocketException e) {
            log.severe("Error checking network interfaces : " + e.getMessage());

            mailAgentCheck = false;
            useThisMailAgent = false;
            return false;
        }

        mailAgentCheck = true;
        useThisMailAgent = false;
        return false;
    }

}
