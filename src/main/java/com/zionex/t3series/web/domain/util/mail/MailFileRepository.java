package com.zionex.t3series.web.domain.util.mail;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MailFileRepository extends JpaRepository<MailFile, MailFile> {

    List<MailFile> findByMailId(String mailId);

    void deleteByMailId(String mailId);

}
