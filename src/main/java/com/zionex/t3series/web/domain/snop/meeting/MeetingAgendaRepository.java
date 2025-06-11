package com.zionex.t3series.web.domain.snop.meeting;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingAgendaRepository extends JpaRepository<MeetingAgenda, String> {

    List<MeetingAgenda> findByMeetId(String meetId);
    
    MeetingAgenda findByMeetIdAndId(String meetId, String id);

    MeetingAgenda findByMeetIdAndAgendaTitle(String meetId, String agendaTitle);

    void deleteByMeetId(String meetId);

}
