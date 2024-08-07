package com.zionex.t3series.web.domain.util.issue;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IssueCommentService {

    private final IssueCommentRepository issueCommentRepository;

    public Page<IssueComment> getIssueComments(String issueId, int page, int size) {
        return issueCommentRepository.findByIssueIdOrderByCreateDttmDesc(issueId, PageRequest.of(page, size));
    }

    public void saveIssueComments(List<IssueComment> issueComments) {
        issueCommentRepository.saveAll(issueComments);
    }

    public void deleteIssueComment(String id) {
        issueCommentRepository.deleteById(id);
    }

    public void deleteIssueCommentsByIssue(List<String> issueIds) {
        issueCommentRepository.deleteByIssueIdIn(issueIds);
    }

}
