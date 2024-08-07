package com.zionex.t3series.web.domain.util.issue;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IssueAssignService {

    private final IssueAssignRepository issueAssignRepository;

    public List<IssueAssign> getIssueAssignees(String issueId) {
        return issueAssignRepository.findByIssueId(issueId);
    }

    public void saveIssueAssignee(IssueAssign issueAssign) {
        issueAssignRepository.save(issueAssign);
    }

    public void deleteIssueAssignees(List<String> issueIds) {
        issueAssignRepository.deleteByIssueIdIn(issueIds);
    }

}
