package com.zionex.t3series.web.domain.snop.meeting;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface MeetingFileRepository extends JpaRepository<MeetingFile, String> {

    List<MeetingFile> findByAgendaId(String agendaId);

    List<MeetingFile> findByMeetId(String meetId);

    List<MeetingFile> findByMeetIdAndAgendaId(String meetId, String agendaId);

    @Transactional
    void deleteByAgendaId(String agendaId);

    void deleteByMeetId(String meetId);

}
