package com.zionex.t3series.web.domain.util.widget;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface WidgetRepository extends JpaRepository<Widget, String> {

    boolean existsByWidgetCd(String widgetCd);

    Optional<Widget> findByWidgetCd(String widgetCd);

    List<Widget> findByUseYnTrue();

    @Transactional
    void deleteByWidgetCdIn(List<String> widgetCds);

}
