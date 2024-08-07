package com.zionex.t3series.web.domain.admin.log;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class LogTask {

    private final ViewExecutionService viewExecutionService;

    @Async
    @EventListener
    public void viewExecutionSaveEvent(ViewExecutionEvent event) throws InterruptedException {
        ViewExecution viewExecution = event.getViewExecution();
        if (viewExecution != null) {
            viewExecutionService.saveViewExecutionLog(viewExecution);
        }
    }

}
