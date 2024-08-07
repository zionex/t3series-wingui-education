package com.zionex.t3series.web.domain.util.issue;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface IssueCommentRepository extends JpaRepository<IssueComment, String> {

    Page<IssueComment> findByIssueIdOrderByCreateDttmDesc(String issueId, Pageable pageable);

    @Transactional
    void deleteByIssueIdIn(List<String> issueIds);

}
