package com.zionex.t3series.web.domain.admin.user.password;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordHistoryService {

    private final PasswordHistoryRepository passwordHistoryRepository;
    private final PasswordHistoryQueryRepository passwordHistoryQueryRepository;
    
    public List<String> getPreviousPasswords(String username, int count) {
        return passwordHistoryQueryRepository.findByUsernameAndCount(username, count);
    }

    public void savePasswordHistory(String userId, String password) {
        PasswordHistory passwordHistory = new PasswordHistory();
        passwordHistory.setUserId(userId);
        passwordHistory.setPassword(password);

        passwordHistoryRepository.save(passwordHistory);
    }

}
