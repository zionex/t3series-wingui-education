package com.zionex.t3series.web.domain.util.issue;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
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
@IdClass(IssueFile.class)
public class IssueFile extends BaseEntity implements Serializable {

    @Id
    @Column(name = "FILE_STORAGE_ID")
    private int fileStorageId;

    @Id
    @Column(name = "ISSUE_ID")
    private String issueId;

}
