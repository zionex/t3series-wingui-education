package com.zionex.t3series.web.domain.util.issue;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueRepository extends JpaRepository<Issue, String> {

    // /* Select Board By title And content And deleteYn AND noticeYn */
    // Page<Issue>
    // findByTitleContainingAndContentContainingAndDeleteYnAndCommentYnOrderByCreateDttmDesc(String
    // title, String content, String deleteFlag, String commentYn, Pageable
    // pageable);

    // /* Select Board By title Or content And deleteYn AND noticeYn */
    // Page<Issue>
    // findByTitleContainingAndDeleteYnAndCommentYnOrContentContainingAndDeleteYnAndCommentYnOrderByCreateDttmDesc(
    // String title, String deleteFlag1, String commentYn, String content, String
    // deleteFlag2, String commentYn2, Pageable pageble);

    // Page<Issue>
    // findByViewIdAndCommentYnAndDeleteYnAndCreateDttmAfterAndStatusOrderByCreateDttmDesc(
    // String viewId, String commentYn, String deleteFlag, LocalDateTime day, String
    // status, Pageable pageable);

    // /** 위젯에서 호출 */
    // Page<Issue>
    // findByCommentYnAndDeleteYnAndCreateDttmAfterAndStatusOrderByCreateDttmDesc(String
    // commentYn, String deleteFlag, LocalDateTime day, String status, Pageable
    // pageable);

    // Page<Issue> findByIssueIdAndCommentYnAndDeleteYn(String issueId, String
    // commentYn, String deleteFlag, Pageable pageable);

    // Page<Issue> findByParentIdAndCommentYnAndDeleteYn(String issueId, String
    // commentYn, String deleteFlag, Pageable pageable);

    // List<Issue> findByCommentYnAndDeleteYnOrderByCreateDttmDesc(String commentYn,
    // String deleteFlag);

    // List<Issue> findByDeleteYnAndCreateDttmAfter(String deleteFlag, LocalDateTime
    // baseDttm);

    // List<Issue> findByDeleteYnOrderByCreateDttmDesc(String deleteFlag);

    // Issue findByIssueIdAndDeleteYn(String id, String deleteFlag);

    // int countByViewIdAndDeleteYnAndStatusAndCommentYnAndCreateDttmAfter(String
    // viewId, String deleteYn, String status, String commentYn, LocalDateTime
    // baseDttm);

    Page<Issue> findById(String id, Pageable pageable);

    List<Issue> findByCreateDttmAfter(LocalDateTime baseDttm);

}
