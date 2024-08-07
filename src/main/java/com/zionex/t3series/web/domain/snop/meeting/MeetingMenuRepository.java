package com.zionex.t3series.web.domain.snop.meeting;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface MeetingMenuRepository extends JpaRepository<MeetingMenu, String> {

    List<MeetingMenu> findByMeetIdAndAgendaId(String meetId, String agendaId);

    List<MeetingMenu> findByMeetId(String meetId);

    @Transactional
    void deleteByAgendaId(String agendaId);

    void deleteByMeetId(String meetId);

}
