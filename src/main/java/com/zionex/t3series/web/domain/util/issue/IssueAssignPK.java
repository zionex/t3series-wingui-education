package com.zionex.t3series.web.domain.util.issue;

import java.io.Serializable;

import javax.persistence.Column;

import lombok.Data;

@Data
public class IssueAssignPK implements Serializable {

    private static final long serialVersionUID = 534095963105935831L;

    @Column(name = "ISSUE_ID")
    private String issueId;

    @Column(name = "SEQ")
    private int seq;

}
