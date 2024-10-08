package com.zionex.t3series.web.domain.util.bulkinsert;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ImportJobRepository extends JpaRepository<ImportJobEntity, Integer> {

    /* Select ImportJob by JOB_TABLE and COMPLETE_YN */
    List<ImportJobEntity> findAllByJobTableAndCompleteYn(String jobTable, String completeYn);

    @Query("select j from ImportJobEntity j where j.jobModule like %?1 and j.jobTable like %?2 and j.completeYn like %?3 order by j.startDttm desc")
    Optional<List<ImportJobEntity>> getImportJobHistory(String jobModule, String jobTable, String completeYn);

    /* Table Is Running by JOB_TABLE and COMPLETE_YN = 'N' */
    Boolean existsByJobTableAndCompleteYn(String jobTable, String completeYn);

}
