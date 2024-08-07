package com.zionex.t3series.web.domain.util.task;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> getTask(LocalDate date) {
        LocalDate monthStartDate = LocalDate.of(date.getYear(), date.getMonthValue(), 1);
        LocalDate monthEndDate = LocalDate.of(date.getYear(), date.getMonthValue(), date.lengthOfMonth());

        return taskRepository.findByStartDateBetweenOrEndDateBetweenOrderByStartDateAsc(monthStartDate, monthEndDate, monthStartDate, monthEndDate);
    }

    public void saveTask(Task task) {
        taskRepository.save(task);
    }

    public void deleteTask(Task task) {
        taskRepository.delete(task);
    }

}