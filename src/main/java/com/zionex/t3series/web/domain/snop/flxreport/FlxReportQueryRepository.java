package com.zionex.t3series.web.domain.snop.flxreport;

import static com.zionex.t3series.web.domain.snop.flxreport.QFlxReportMst.flxReportMst;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class FlxReportQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;
    private final QueryHandler queryHandler;

    public List<FlxReportMst> getFlxReportList(String aggrId, String reportName, String type, String useYn) {
        return jpaQueryFactory
                .select(Projections.fields(FlxReportMst.class,
                        flxReportMst.id,
                        flxReportMst.aggrId,
                        flxReportMst.seq,
                        flxReportMst.type,
                        flxReportMst.name,
                        flxReportMst.descr,
                        flxReportMst.jsonTxt,
                        flxReportMst.pivotSettings,
                        flxReportMst.sql1,
                        flxReportMst.sql2,
                        flxReportMst.sql3,
                        flxReportMst.sql4,
                        flxReportMst.sql5,
                        flxReportMst.useYn))
                .from(flxReportMst)
                .where(flxReportMst.aggrId.contains(aggrId)
                        .and(flxReportMst.name.contains(reportName))
                        .and(flxReportMst.type.contains(type))
                        .and(flxReportMst.useYn.contains(useYn))
                        )
                .orderBy(flxReportMst.seq.asc())
                .fetch();
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> getConditionItems(String query) throws Exception {
        List<Object[]> result = (List<Object[]>) queryHandler.getNativeQueryData(query);
        return result;
    }

}
