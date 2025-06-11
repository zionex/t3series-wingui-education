package com.zionex.t3series.web.domain.util.task;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zionex.t3series.web.util.data.ResponseMessage;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/task")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<Task> getTask(@RequestParam("date") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        return taskService.getTask(date);
    }

    @PostMapping
    public ResponseEntity<ResponseMessage> saveTask(@RequestBody Task task) {
        taskService.saveTask(task);
        return new ResponseEntity<ResponseMessage>(new ResponseMessage(HttpStatus.OK.value(), "Inserted task entity"), HttpStatus.OK);
    }

    @PostMapping("/delete")
    public ResponseEntity<ResponseMessage> deleteTask(@RequestBody Task task) {
        taskService.deleteTask(task);
        return new ResponseEntity<ResponseMessage>(new ResponseMessage(HttpStatus.OK.value(), "Deleted task entity"), HttpStatus.OK);
    }
    
}