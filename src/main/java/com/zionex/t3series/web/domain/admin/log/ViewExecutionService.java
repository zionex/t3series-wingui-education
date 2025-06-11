package com.zionex.t3series.web.domain.admin.log;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ViewExecutionService {

    private final ViewExecutionRepository viewExecutionRepository;
    private final ViewExecutionQueryRepository viewExecutionQueryRepository;

    public Page<ViewExecution> getViewExecutionLog(int size, int page, LocalDate startDate, LocalDate endDate, String menuCd, String menuNm, String username) {
        Pageable pageable = PageRequest.of(page, size);

        LocalDateTime startDateTime = LocalDateTime.of(startDate, LocalTime.MIN);
        LocalDateTime endDateTime = LocalDateTime.of(endDate, LocalTime.MAX);

        return viewExecutionQueryRepository.getViewExecutionLog(startDateTime, endDateTime, menuCd, menuNm, username, pageable);
    }

    public ViewExecution saveViewExecutionLog(ViewExecution viewExecution) {
        ViewExecutionPK viewExecutionPK = new ViewExecutionPK();
        viewExecutionPK.setId(viewExecution.getId());
        viewExecutionPK.setViewCd(viewExecution.getViewCd());

        Optional<ViewExecution> existsViewExecution = viewExecutionRepository.findById(viewExecutionPK);
        if (existsViewExecution.isPresent()) {
            viewExecution.setExecutionDttm(existsViewExecution.get().getExecutionDttm());
        }

        return viewExecutionRepository.save(viewExecution);
    }

}
