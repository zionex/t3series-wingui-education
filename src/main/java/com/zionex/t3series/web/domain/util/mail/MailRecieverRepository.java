package com.zionex.t3series.web.domain.util.mail;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MailRecieverRepository extends JpaRepository<MailReciever, MailRecieverPK> {

    List<MailReciever> findByMailId(String mailId);

}
