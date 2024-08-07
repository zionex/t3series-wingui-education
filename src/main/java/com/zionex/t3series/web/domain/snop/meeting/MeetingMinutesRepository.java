package com.zionex.t3series.web.domain.snop.meeting;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingMinutesRepository extends JpaRepository<MeetingMinutes, String> {

    List<MeetingMinutes> findByMeetId(String meetId);

    void deleteByMeetId(String meetId);
}
