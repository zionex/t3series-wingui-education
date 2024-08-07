package com.zionex.t3series.web.domain.util.calendar;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface CalendarCategoryRepository extends JpaRepository<CalendarCategory, String> {

    @Transactional
    void deleteByUserIdAndId(String userId, String categoryId);

}
