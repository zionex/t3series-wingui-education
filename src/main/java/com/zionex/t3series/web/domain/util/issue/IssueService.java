package com.zionex.t3series.web.domain.util.issue;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zionex.t3series.web.domain.admin.user.User;
import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.domain.admin.user.group.GroupUserResult;
import com.zionex.t3series.web.domain.admin.user.group.UserGroupService;
import com.zionex.t3series.web.domain.util.mail.MailUtil;
import com.zionex.t3series.web.domain.snop.meeting.MeetingIssue;
import com.zionex.t3series.web.domain.snop.meeting.MeetingIssueRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;

@Log
@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;
    private final IssueQueryRepository issueQueryRepository;

    private final IssueAssignService issueAssignService; 
    private final IssueCommentService issueCommentService;
    private final IssueFileService issueFileService;

    private final MeetingIssueRepository meetingIssueRepository;

    private final UserService userService;
    private final UserGroupService userGroupService;

    private final MailUtil mailUtil;

    private void buildIssue(Issue issue) {
        User user = userService.getUser(issue.getCreateBy());

        String displayName = user.getDisplayName();
        if (displayName == null) {
            issue.setCreateByDisplayName(issue.getCreateBy());
        } else {
            issue.setCreateByDisplayName(displayName);
        }

        List<IssueAssign> issueAssignees = issueAssignService.getIssueAssignees(issue.getId());
        List<String> assignees = issueAssignees.stream().map(IssueAssign::getAssignee).collect(Collectors.toList());
        issue.setAssignees(assignees);
    }

    public IssueResults getIssues(String search, int option, String menuCd, Boolean isAssigned, String status, String after15days,
                                  String username, String issueType, int page, int size) {
        boolean isAdmin = userService.checkAdmin(username);

        Page<Issue> pageContent = issueQueryRepository.getIssues(option, search, menuCd, isAssigned, status,
                after15days, username, isAdmin, issueType, PageRequest.of(page, size));

        pageContent.forEach(issue -> {
            buildIssue(issue);
        });

        return IssueResults.builder().pageComment(null).pageContent(pageContent).build();
    }

    public IssueResults getIssuesMeet(String search, int option, String menuCd, Boolean isAssigned, String status, String after15days, String meetId,
                                  String username, String issueType, int page, int size) {
        boolean isAdmin = userService.checkAdmin(username);

        Page<Issue> pageContent = issueQueryRepository.getIssuesMeet(option, search, menuCd, isAssigned, status,
                after15days, meetId, username, isAdmin, issueType, PageRequest.of(page, size));

        pageContent.forEach(issue -> {
            buildIssue(issue);
        });

        return IssueResults.builder().pageComment(null).pageContent(pageContent).build();
    }

    public IssueResults getIssuesByUser(String menuCd, String username, int page, int size) {
        Page<Issue> pageContent = issueQueryRepository.getIssuesByUser(menuCd, username, PageRequest.of(page, size));
        pageContent.forEach(issue -> {
            buildIssue(issue);
        });

        return IssueResults.builder().pageComment(null).pageContent(pageContent).build();
    }

    public int getIssueCount(String menuCd, String username) {
        Long cnt = issueQueryRepository.getIssueCount(menuCd, username);
        return cnt.intValue();
    }

    public IssueResults getIssueListCertain(int page, int size) {
        Page<Issue> pageContent = issueQueryRepository.getIssueCertainList(PageRequest.of(page, size));
        pageContent.forEach(issue -> {
            buildIssue(issue);
        });

        return IssueResults.builder().pageComment(null).pageContent(pageContent).build();
    }

    public IssueResults getIssueDetail(String issueId, int page, int size) {
        Page<IssueComment> issueComments = issueCommentService.getIssueComments(issueId, page, size);
        Page<Issue> issue = issueRepository.findById(issueId, PageRequest.of(0, 10));
        buildIssue(issue.getContent().get(0));

        return IssueResults.builder().pageComment(issueComments).pageContent(issue).build();
    }

    public Issue getIssue(String issueId) {
        return issueRepository.findById(issueId).orElse(null);
    }

    @Transactional
    public void saveIssue(Issue issue) {
        if (!isValidUpdate(issue)) {
            return;
        }

        issue.setContent(cleanXss(issue.getContent()));
        String issueId = issueRepository.save(issue).getId();

        if (issue.getFiles() != null) {
            issue.getFiles().forEach(fileId -> {
                IssueFile issueFile = new IssueFile();
                issueFile.setIssueId(issueId);
                issueFile.setFileStorageId(fileId);

                issueFileService.saveIssueFile(issueFile);
            });
        }

        // meeting issue 저장 일때
        if (issue.getIssueType().equals("S") && issue.getMeetId() != null) {
            MeetingIssue meetingIssue = new MeetingIssue();
            meetingIssue.setIssueId(issueId);  
            meetingIssue.setMeetId(issue.getMeetId()); 
            
            // MeetingIssue 저장
            meetingIssueRepository.save(meetingIssue);
        }

        List<String> originAssignees = issueAssignService.getIssueAssignees(issueId)
                .stream()
                .map(IssueAssign::getAssignee)
                .collect(Collectors.toList());
                
        AtomicInteger cnt = new AtomicInteger(0);
        List<String> assignees = issue.getAssignees();
        
        if (CollectionUtils.isEqualCollection(originAssignees, assignees)) {
            return;
        }

        issueAssignService.deleteIssueAssignees(issueId);
                
        if (assignees != null && !assignees.isEmpty()) {
            Boolean isGroupIssue = issue.getGrpAssignYn();
            List<String> groupUsers = new ArrayList<>();
            assignees.forEach(assignee -> {
                    IssueAssign issueAssign = new IssueAssign();
                    issueAssign.setIssueId(issueId);
                    issueAssign.setSeq(cnt.getAndIncrement());
                    issueAssign.setAssignee(assignee);
                    issueAssign.setGrpYn(isGroupIssue);

                    issueAssignService.saveIssueAssignee(issueAssign);
            });

            if (isGroupIssue) {
                List<GroupUserResult> groupUserResults = userGroupService.getGroupUsers(assignees.get(0));
                groupUserResults.forEach(user -> groupUsers.add(user.getUsername()));
                assignees = groupUsers;
            }

            if (issue.getMailYn().equals("Y")) {
                mailUtil.sendMailWithId(issue.getTitle(), issue.getCreateBy(), assignees, null, issue.getContent(), issue.getFiles());
            }
        }

        
    }

    private boolean isValidUpdate(Issue issue) {
        String issueId = issue.getId();
        if (issueId == null) {
            return true;
        }

        Issue originIssue = issueRepository.findById(issueId).orElse(null);
        if (originIssue == null) {
            log.info(String.format("Invalid issue id (%s)", issueId));
            return false;
        }

        String username = userService.getUserDetails().getUsername();
        String owner = originIssue.getCreateBy();
        if (username.equals(owner)) {
            return true;
        } else {
            List<String> assignees = issueAssignService.getIssueAssignees(issueId)
                    .stream()
                    .map(IssueAssign::getAssignee)
                    .collect(Collectors.toList());

            if (assignees.isEmpty()) {
                return false;
            }

            Boolean isGroupIssue = issue.getGrpAssignYn();
            if (isGroupIssue) {
                List<String> groupUsers = new ArrayList<>();
                assignees.forEach(assignee -> {
                    List<GroupUserResult> groupUserResults = userGroupService.getGroupUsers(assignee);
                    groupUserResults.forEach(user -> groupUsers.add(user.getUsername()));
                });
                return groupUsers.contains(username);
            } else {
                return assignees.contains(username);
            }
        }
    }

    private String cleanXss(String value) {
        if (value == null || value.trim() == "") {
            return value;
        }

        String cleanedValue = value;
        cleanedValue = cleanedValue.replaceAll("(?i)javascript", "x-javascript");
        cleanedValue = cleanedValue.replaceAll("(?i)script", "x-script");
        cleanedValue = cleanedValue.replaceAll("(?i)iframe", "x-iframe");
        cleanedValue = cleanedValue.replaceAll("(?i)document", "x-document");
        cleanedValue = cleanedValue.replaceAll("(?i)vbscript", "x-vbscript");
        cleanedValue = cleanedValue.replaceAll("(?i)applet", "x-applet");
        cleanedValue = cleanedValue.replaceAll("(?i)embed", "x-embed");
        cleanedValue = cleanedValue.replaceAll("(?i)object", "x-object");
        cleanedValue = cleanedValue.replaceAll("(?i)frame", "x-frame");
        cleanedValue = cleanedValue.replaceAll("(?i)grameset", "x-grameset");
        cleanedValue = cleanedValue.replaceAll("(?i)layer", "x-layer");
        cleanedValue = cleanedValue.replaceAll("(?i)bgsound", "x-bgsound");
        cleanedValue = cleanedValue.replaceAll("(?i)alert", "x-alert");
        cleanedValue = cleanedValue.replaceAll("(?i)onblur", "x-onblur");
        cleanedValue = cleanedValue.replaceAll("(?i)onchange", "x-onchange");
        cleanedValue = cleanedValue.replaceAll("(?i)onclick", "x-onclick");
        cleanedValue = cleanedValue.replaceAll("(?i)ondblclick", "x-ondblclick");
        cleanedValue = cleanedValue.replaceAll("(?i)onerror", "x-onerror");
        cleanedValue = cleanedValue.replaceAll("(?i)onfocus", "x-onfocus");
        cleanedValue = cleanedValue.replaceAll("(?i)onload", "x-onload");
        cleanedValue = cleanedValue.replaceAll("(?i)onmouse", "x-onmouse");
        cleanedValue = cleanedValue.replaceAll("(?i)onscroll", "x-onscroll");
        cleanedValue = cleanedValue.replaceAll("(?i)onsubmit", "x-onsubmit");
        cleanedValue = cleanedValue.replaceAll("(?i)onunload", "x-onunload");
        return cleanedValue;
    }

    public void closeIssue(String issueId) {
        Issue issue = getIssue(issueId);
        issue.setStatus("C");

        issueRepository.save(issue);
    }

    @Transactional
    public void deleteIssue(List<String> issueIds) {
        if (!userService.checkAdmin()) {
            log.info("User does not have permission to delete.");
            return;
        }

        issueRepository.deleteAllById(issueIds);

        issueAssignService.deleteIssueAssignees(issueIds);
        issueCommentService.deleteIssueCommentsByIssue(issueIds);
        issueFileService.deleteIssueFiles(issueIds);

        meetingIssueRepository.deleteByIssueIdIn(issueIds);
    }

}
