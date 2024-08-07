package com.zionex.t3series.web.domain.util.issue;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zionex.t3series.web.util.audit.BaseEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(callSuper = false)
@Table(name = "TB_UT_ISSUE_FILE")
@Entity
public class IssueFile extends BaseEntity {

    @Id
    @Column(name = "ISSUE_ID")
    private String issueId;

    @Column(name = "FILE_STORAGE_ID")
    private int fileStorageId;

}
