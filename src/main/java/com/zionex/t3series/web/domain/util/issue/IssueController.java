package com.zionex.t3series.web.domain.util.issue;

import static com.zionex.t3series.web.constant.ServiceConstants.PARAMETER_KEY_DATA;
import static com.zionex.t3series.web.constant.ServiceConstants.PARAMETER_KEY_MENU_CD;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3series.web.constant.ServiceConstants;
import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.domain.util.filestorage.FileStorage;
import com.zionex.t3series.web.util.interceptor.ExecPermission;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class IssueController {

    private static final String SEARCH = "search";
    private static final String OPTION = "option";
    private static final String PAGE = "page";
    private static final String SIZE = "size";
    private static final String ISSUE_ID = "issue-id";

    private final IssueService issueService;
    private final IssueAssignService issueAssignService;
    private final IssueCommentService issueCommentService;
    private final IssueFileService issueFileService;

    private final UserService userService;
    private final ObjectMapper objectMapper;

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("/issue")
    public IssueResults getIssues(@RequestParam(SEARCH) String search,
            @RequestParam(OPTION) int option,
            @RequestParam("view-cd") String menuCd,
            @RequestParam(value = "is-assigned", required = false) Boolean isAssigned,
            @RequestParam(value = "issue-type", required = false) String issueType,
            @RequestParam("status") String status,
            @RequestParam("after15days") String after15days,
            @RequestParam(PAGE) int page, @RequestParam(SIZE) int size) {

        UserDetails userDetail = userService.getUserDetails();
        String username = (userDetail == null) ? "" : userDetail.getUsername();

        return issueService.getIssues(search, option, menuCd, isAssigned, status, after15days, username, issueType, page, size);
    }

    @ExecPermission(type = ServiceConstants.PERMISSION_TYPE_READ)
    @GetMapping("/issue/meet")
    public IssueResults getIssuesMeet(@RequestParam(SEARCH) String search,
            @RequestParam(OPTION) int option,
            @RequestParam("view-cd") String menuCd,
            @RequestParam(value = "is-assigned", required = false) Boolean isAssigned,
            @RequestParam(value = "issue-type", required = false) String issueType,
            @RequestParam("status") String status,
            @RequestParam("after15days") String after15days,
            @RequestParam("meetId") String meetId,
            @RequestParam(PAGE) int page, @RequestParam(SIZE) int size) {

        UserDetails userDetail = userService.getUserDetails();
        String username = (userDetail == null) ? "" : userDetail.getUsername();

        return issueService.getIssuesMeet(search, option, menuCd, isAssigned, status, after15days, meetId, username, issueType, page, size);
    }

    @GetMapping("/issue/my")
    public IssueResults getMyIssues(@RequestParam(PARAMETER_KEY_MENU_CD) String menuCd, @RequestParam(PAGE) int page, @RequestParam(SIZE) int size) {
        UserDetails userDetail = userService.getUserDetails();
        String username = (userDetail == null) ? "" : userDetail.getUsername();

        return issueService.getIssuesByUser(menuCd, username, page, size);
    }

    @GetMapping("/issue/count")
    public int getIssueCount(@RequestParam(PARAMETER_KEY_MENU_CD) String menuCd) {
        UserDetails userDetail = userService.getUserDetails();
        String username = (userDetail == null) ? "" : userDetail.getUsername();

        return issueService.getIssueCount(menuCd, username);
    }

    @GetMapping("/issue-certain")
    public IssueResults getIssueCertain() {
        return issueService.getIssueListCertain(0, 100);
    }

    @GetMapping("/issue/detail")
    public Issue getIssueDetail(@RequestParam(ISSUE_ID) String issueId) {
        return issueService.getIssue(issueId);
    }

    @GetMapping("/issue/comment")
    public Page<IssueComment> getIssueComments(@RequestParam(ISSUE_ID) String issueId, @RequestParam(PAGE) int page, @RequestParam(SIZE) int size) {
        return issueCommentService.getIssueComments(issueId, page, size);
    }

    @PostMapping("/issue/comment")
    public void saveIssueComments(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final List<IssueComment> issueComment = objectMapper.readValue(request.getParameter(PARAMETER_KEY_DATA), new TypeReference<List<IssueComment>>() {});
        issueCommentService.saveIssueComments(issueComment);
    }

    @PostMapping("/issue/comment/delete")
    public void deleteIssueComment(@RequestParam("comment-id") String commentId) {
        issueCommentService.deleteIssueComment(commentId);
    }

    @PostMapping("/issue")
    public void saveIssue(HttpServletRequest request) throws JsonMappingException, JsonProcessingException {
        final Issue issue = objectMapper.readValue(request.getParameter(PARAMETER_KEY_DATA), new TypeReference<Issue>() {});
        issueService.saveIssue(issue);
    }

    @PostMapping("/issue/close")
    public void closeIssue(@RequestParam(ISSUE_ID) String issueId) {
        issueService.closeIssue(issueId);
    }

    @PostMapping("/issue/delete")
    public void deleteIssue(@RequestBody List<String> issueIds) {
        issueService.deleteIssue(issueIds);
    }

    @GetMapping("/issue/assignee")
    public List<IssueAssign> getIssueAssignees(@RequestParam(ISSUE_ID) String issueId) {
        return issueAssignService.getIssueAssignees(issueId);
    }

    @GetMapping("/issue-atch")
    public List<FileStorage> getIssueFiles(@RequestParam("issue-id") String issueId) {
        return issueFileService.getIssueFiles(issueId);
    }

}
