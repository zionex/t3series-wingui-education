package com.zionex.t3series.web.domain.snop.dashboardfact;

import static com.zionex.t3series.web.domain.snop.dashboardfact.QFactFieldDesc.factFieldDesc;
import static com.zionex.t3series.web.domain.snop.dashboardfact.QAggrMst.aggrMst;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;

import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class FactQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;
    private final QueryHandler queryHandler;

    public List<FactFieldDesc> getFieldDesc(String aggrId) {
        return jpaQueryFactory
                .select(Projections.fields(FactFieldDesc.class,
                        factFieldDesc.id,
                        factFieldDesc.aggrId,
                        factFieldDesc.seq,
                        factFieldDesc.field,
                        factFieldDesc.descrip,
                        factFieldDesc.headerText,
                        factFieldDesc.groupText,
                        factFieldDesc.columnType,
                        factFieldDesc.dataType,
                        factFieldDesc.dataWidth,
                        factFieldDesc.dataAlign,
                        factFieldDesc.dataFormat,
                        factFieldDesc.dataVisible,
                        factFieldDesc.dataSuffix,
                        factFieldDesc.dataPreFix,
                        factFieldDesc.conditionYn,
                        factFieldDesc.conditionType,
                        factFieldDesc.conditionFormat,
                        factFieldDesc.conditionItem,
                        factFieldDesc.conditionOprt,
                        factFieldDesc.conditionParam,
                        factFieldDesc.conditionDefault,
                        factFieldDesc.chartType,
                        factFieldDesc.chartColor))
                .from(factFieldDesc)
                .where(factFieldDesc.aggrId.eq(aggrId))
                .orderBy(factFieldDesc.seq.asc()) 
                .fetch();
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> getFactList(String aggrId, String selectField, String whereStr) throws Exception {
        String query = "SELECT " + selectField + "\n";
        query += "FROM TB_SA_AGGR \n";
        query += "WHERE AGGR_ID='" + aggrId + "'\n";
        query += "AND CUTOFF_DATE = ( SELECT MAX(CUTOFF_DATE) \n";
        query += "                    FROM TB_SA_AGGR \n";
        query += "                    WHERE AGGR_ID = '" + aggrId + "'\n";
        query += "                   )\n";
        if(whereStr.length() > 0){ 
            query += whereStr + "\n";
        }
        query += "ORDER BY SEQ";

        List<Object[]> result = (List<Object[]>) queryHandler.getNativeQueryData(query);
        return result;
    }

    public List<AggrMst> getAggrMst(String aggrId, String aggrName, String id) {
        return jpaQueryFactory
                .select(Projections.fields(AggrMst.class,
                        aggrMst.id,
                        aggrMst.seq,
                        aggrMst.aggrId,
                        aggrMst.aggrName,
                        aggrMst.aggrLvl1,
                        aggrMst.aggrLvl2,
                        aggrMst.aggrSql1,
                        aggrMst.aggrSql2))
                .from(aggrMst)
                .where(aggrMst.aggrId.contains(aggrId)
                        .and(aggrMst.aggrName.contains(aggrName))
                        .and(aggrMst.id.contains(id)))
                .orderBy(aggrMst.seq.asc())
                .fetch();
    }

    @SuppressWarnings("unchecked")
    public String getProcSelect(String procNm) throws Exception {
        String query = "SELECT [dbo].[FN_G_AGGR_SQL]('" + procNm + "');";
        List<Object[]> result = (List<Object[]>) queryHandler.getNativeQueryData(query);

        String resultStr = String.valueOf(result.get(0));

        return resultStr;
    }

}