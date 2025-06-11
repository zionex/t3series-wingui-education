package com.zionex.t3series.web.domain.admin.log;

public class ViewExecutionEvent {

    ViewExecution viewExecution;

    public ViewExecutionEvent(ViewExecution ve) {
        this.viewExecution = ve;
    }

    public ViewExecution getViewExecution() {
        return this.viewExecution;
    }

}
