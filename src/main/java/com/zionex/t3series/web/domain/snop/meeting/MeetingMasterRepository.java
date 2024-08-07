package com.zionex.t3series.web.domain.snop.meeting;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface MeetingMasterRepository extends JpaRepository<MeetingMaster, String> {

    MeetingMaster findByIdAndDelYn(String id, String delYn);

    MeetingMaster findTopByMeetStartDttmAndDelYnOrderByMeetStartDttm(Timestamp date, String delYn);

    List<MeetingMaster> findByDelYnOrderByMeetStartDttmAsc(String delYn);

    List<MeetingMaster> findByMeetStartDttmOrderByMeetStartDttmAsc(Timestamp date);

    List<MeetingMaster> findByMeetStartDttmGreaterThanEqualOrderByMeetStartDttmAsc(Timestamp date);

    @Transactional
    void deleteById(String id);

}
