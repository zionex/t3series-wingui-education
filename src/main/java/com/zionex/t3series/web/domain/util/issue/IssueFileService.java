package com.zionex.t3series.web.domain.util.issue;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zionex.t3series.web.domain.admin.user.UserService;
import com.zionex.t3series.web.domain.util.filestorage.FileStorage;
import com.zionex.t3series.web.domain.util.filestorage.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class IssueFileService {

    private final IssueFileRepository issueFileRepository;

    private final FileStorageService fileStorageService;
    private final UserService userService;

    public List<FileStorage> getIssueFiles(String issueId) {
        List<Integer> fileStorageIds = issueFileRepository.findByIssueId(issueId)
                .stream()
                .map(IssueFile::getFileStorageId)
                .collect(Collectors.toList());

        return fileStorageService.getFilesInfo(fileStorageIds);
    }

    public void saveIssueFile(IssueFile issueFile) {
        issueFileRepository.save(issueFile);
    }

    @Transactional
    public void deleteIssueFiles(List<String> issueIds) {
        List<IssueFile> issueFiles = issueFileRepository.deleteByIssueIdIn(issueIds);
        List<Integer> fileStorageIds = issueFiles
                .stream()
                .map(IssueFile::getFileStorageId)
                .collect(Collectors.toList());
        String username = userService.getUserDetails().getUsername();

        fileStorageService.deleteFile(fileStorageIds, username);
    }

}
