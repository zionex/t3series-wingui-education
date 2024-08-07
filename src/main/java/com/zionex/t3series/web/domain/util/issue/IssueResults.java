package com.zionex.t3series.web.domain.util.issue;

import org.springframework.data.domain.Page;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IssueResults {

    private Page<Issue> pageContent;
    private Page<IssueComment> pageComment;

}
