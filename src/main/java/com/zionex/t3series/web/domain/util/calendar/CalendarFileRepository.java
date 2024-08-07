package com.zionex.t3series.web.domain.util.calendar;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface CalendarFileRepository extends JpaRepository<CalendarFile, String> {

    @Transactional
    List<CalendarFile> findBySchId(String schId);

    @Transactional
    void deleteBySchId(String schId);

}
