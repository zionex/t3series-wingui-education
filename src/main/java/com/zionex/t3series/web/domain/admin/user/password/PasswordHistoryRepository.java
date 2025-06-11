package com.zionex.t3series.web.domain.admin.user.password;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordHistoryRepository extends JpaRepository<PasswordHistory, String> {

}
