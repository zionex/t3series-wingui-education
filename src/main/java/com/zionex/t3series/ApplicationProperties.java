package com.zionex.t3series;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "app")
public class ApplicationProperties {

    private String corporation;
    private List<String> languages;
    private Authentication authentication;
    private Service service;
    private Map<String, Server> server;
    private Cache cache;
    private Session session;
    private KafkaInfo kafkaInfo;
    private String offset;

    @Autowired
    private Servlet servlet;

    public String getContextRealPath() {
        return servlet.getContextRealPath();
    }

    public String getContextRealPath(String path) {
        return servlet.getContextRealPath(path);
    }

    @Data
    public static class Authentication {

        private String defaultUrl;
        private String loginUrl;
        private List<String> corsAllowUrl;
        private List<String> corsAllowPath;
        private PasswordPolicy passwordPolicy;
        private LoginPolicy loginPolicy;
        private Account account;
        private String initialPassword;

        @Data
        public static class PasswordPolicy {

            private boolean usableUsername;
            private int minLength;
            private int maxRepeat;
            private int lcredit;
            private int ucredit;
            private int dcredit;
            private int ocredit;
            private int maxReusePrevention;

        }

        @Data
        public static class LoginPolicy {

            private int maxFailureCount;
            private int longTermUnvisitedDays;
            private int maxPasswordDays;

        }

        @Data
        public static class Account {

            private List<String> systemAdmins;

        }

    }

    @Data
    public static class Service {

        @JsonIgnore
        private File file;
        private Mailing mailing;

        @Data
        public static class File {

            private String externalPath;
            private String name;
            private Category category;

            public List<String> getCategoryList() {
                return Arrays.asList(category.getSystem(), category.getNoticeboard(), category.getTemporary(),
                        category.getIssue(), category.getCalendar(), category.getMeeting());
            }

            @Data
            public static class Category {

                private String system;
                private String noticeboard;
                private String temporary;
                private String excel;
                private String issue;
                private String calendar;
                private String meeting;

            }

        }

        @Data
        public static class Mailing {

            private Smtp smtp;

            @Data
            public static class Smtp {

                private String host;
                private int port;
                private String username;
                private String password;
                private String encoding;
                private String mailagentip;
                private String imagerooturl;
                private String trust;
                private String protocols;

            }

        }

    }

    @Data
    public static class Server {

        public static String getLocalHostAddress() {
            try {
                return InetAddress.getLocalHost().getHostAddress();
            } catch (UnknownHostException e) {
                return "localhost";
            }
        }

        private String scheme;
        private String id;
        private String host;
        private int port;

        public String getScheme() {
            return scheme == null ? "http" : scheme;
        }

        public int getPort() {
            if (port > 0) {
                return port;
            }

            switch (id) {
                case "T3SeriesBF":
                    return 9120;
                case "T3SeriesDP":
                    return 8037;
                case "T3SeriesMP":
                    return 8047;
                case "T3SeriesFP":
                    return 8079;
            }

            return 8080;
        }

        public String createUrl() {
            String host = getHost();
            if (host == null) {
                host = getLocalHostAddress();
            }
            return getScheme() + "://" + host + ":" + getPort();
        }

    }

    @Data
    public static class Cache {

        private boolean enable;

    }

    @Data
    public static class Session {

        private int timeout;
        private int tokenValidTimeout;

    }

    @Data
    @ConfigurationProperties(prefix = "kafka-info")
    public static class KafkaInfo {

        private boolean enable;
        private List<String> bootstrapServer;

    }

}

@Component
class Servlet {

    private String contextRealPath;

    public Servlet(ServletContext servletContext, @Value("${server.servlet.context-real-path}") String contextRealPath) {
        if (contextRealPath != null && !contextRealPath.isEmpty()) {
            this.contextRealPath = contextRealPath;
        } else {
            this.contextRealPath = servletContext.getRealPath("/");
        }

        this.contextRealPath = this.contextRealPath.replace("\\", "/");
        if (!this.contextRealPath.endsWith("/")) {
            this.contextRealPath += "/";
        }
    }

    public String getContextRealPath() {
        return contextRealPath;
    }

    public String getContextRealPath(String path) {
        path = path.replace("\\", "/");
        if (path.startsWith("/")) {
            path = path.substring(1);
        }

        return getContextRealPath() + path;
    }

}
