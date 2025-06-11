package com.zionex.t3series.web.domain.util.issue;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueRepository extends JpaRepository<Issue, String> {

    Page<Issue> findById(String id, Pageable pageable);

    List<Issue> findByCreateDttmAfter(LocalDateTime baseDttm);

}
