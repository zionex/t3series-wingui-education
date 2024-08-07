package com.zionex.t3series.web.domain.util.task;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends CrudRepository<Task, String> {

    List<Task> findByStartDateBetweenOrEndDateBetweenOrderByStartDateAsc(LocalDate monthStartDate1, LocalDate monthEndDate1, LocalDate monthStartDate2, LocalDate monthEndDate2);

}