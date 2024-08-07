package com.zionex.t3series.web.domain.util.mail;

import static com.zionex.t3series.web.domain.util.mail.QMail.mail;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MailQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public Page<Mail> getMailList(String userId, String search, String searchOpt, Pageable pageable) {
        List<Mail> list = jpaQueryFactory
                .select(Projections.fields(Mail.class,
                        mail.mailId,
                        mail.title,
                        mail.content,
                        mail.contentTp,
                        mail.sender,
                        mail.tryCnt,
                        mail.errCause,
                        mail.createBy,
                        mail.status,
                        mail.createDttm,
                        mail.modifyBy,
                        mail.modifyDttm))
                .from(mail)
                .where(mail.status.eq("N")
                        .and(mail.sender.eq("userId")))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long count = jpaQueryFactory
                .select(mail.count())
                .from(mail)
                .where(mail.status.eq("N"))
                .fetchOne();

        return new PageImpl<>(list, pageable, count);
    }

    public List<Mail> getProcessingMailList() {
        List<Mail> list = jpaQueryFactory
                .select(Projections.fields(Mail.class,
                        mail.mailId,
                        mail.title,
                        mail.content,
                        mail.contentTp,
                        mail.sender,
                        mail.tryCnt,
                        mail.errCause,
                        mail.createBy,
                        mail.status,
                        mail.createDttm,
                        mail.modifyBy,
                        mail.modifyDttm))
                .from(mail)
                .where(mail.status.eq("0"))
                .fetch();

        return list;
    }

}
