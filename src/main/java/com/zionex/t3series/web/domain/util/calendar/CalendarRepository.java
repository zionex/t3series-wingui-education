package com.zionex.t3series.web.domain.util.calendar;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface CalendarRepository extends JpaRepository<Calendar, String> {

    @Transactional
    void deleteByUserIdAndCategoryIdAndSchId(String userId, String categoryId, String schId);

    @Transactional
    void deleteByUserIdAndCategoryIdAndSchIdAndId(String userId, String categoryId, String schId, String id);

    @Transactional
    void deleteByUserIdAndCategoryId(String userId, String categoryId);

    Calendar findByUserIdAndCategoryIdAndSchIdAndId(String userId, String categoryId, String schId, String id);

    Calendar findBymeetId(String meetId);

    List<Calendar> findByUserIdAndSchId(String userId, String schId);

    List<Calendar> findBySchId(String schId);

    @Transactional
    void deleteByMeetId(String meetId);

}
