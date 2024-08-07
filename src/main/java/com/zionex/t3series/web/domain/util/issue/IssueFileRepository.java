package com.zionex.t3series.web.domain.util.issue;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface IssueFileRepository extends JpaRepository<IssueFile, String> {

    List<IssueFile> findByIssueId(String issueId);

    @Transactional
    List<IssueFile> deleteByIssueIdIn(List<String> issueIds);

}
