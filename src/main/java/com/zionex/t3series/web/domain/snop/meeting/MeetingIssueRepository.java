package com.zionex.t3series.web.domain.snop.meeting;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface MeetingIssueRepository extends JpaRepository<MeetingIssue, String> {

    @Transactional
    void deleteByIssueIdIn(List<String> issueIds);

}
