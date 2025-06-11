package com.zionex.t3series.web.domain.snop.meeting;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface MeetingMasterRepository extends JpaRepository<MeetingMaster, String> {

    MeetingMaster findByIdAndDelYn(String id, String delYn);

    MeetingMaster findTopByMeetStartDttmAndDelYnOrderByMeetStartDttm(Timestamp date, String delYn);

    List<MeetingMaster> findByDelYnOrderByMeetStartDttmAsc(String delYn);

    // List<MeetingMaster> findByMeetStartDttmOrderByMeetStartDttmAsc(Timestamp date);
    // MeetingMaster findById(String cpMeetId);

    // List<MeetingMaster> findByMeetStartDttmGreaterThanEqualOrderByMeetStartDttmAsc(Timestamp date);
    List<MeetingMaster> findByMeetSubjectAndMeetStartDttmGreaterThanEqualOrderByMeetStartDttmAsc(String meetSbjt, Timestamp date);
    
    @Transactional
    void deleteById(String id);

}
