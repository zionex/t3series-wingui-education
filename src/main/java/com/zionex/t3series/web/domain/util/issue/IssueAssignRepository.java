package com.zionex.t3series.web.domain.util.issue;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface IssueAssignRepository extends JpaRepository<IssueAssign, IssueAssignPK> {

    List<IssueAssign> findByIssueId(String issueId);

    Boolean existsByIssueIdAndAssignee(String issueId, String assignee);

    @Transactional
    void deleteByIssueIdIn(List<String> issueIds);

}
