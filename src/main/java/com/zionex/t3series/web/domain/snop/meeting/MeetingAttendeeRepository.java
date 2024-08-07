package com.zionex.t3series.web.domain.snop.meeting;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingAttendeeRepository extends JpaRepository<MeetingAttendee, String> {

    List<MeetingAttendee> findByMeetId(String meetId);

    void deleteByMeetId(String meetId);
}
