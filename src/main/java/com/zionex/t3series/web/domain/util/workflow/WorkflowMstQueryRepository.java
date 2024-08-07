package com.zionex.t3series.web.domain.util.workflow;

import static com.zionex.t3series.web.domain.util.workflow.QWorkflowMst.workflowMst;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class WorkflowMstQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;

    public List<WorkflowMst> getWorkflowMsts(String username, boolean isAdmin) {
        BooleanBuilder builder = new BooleanBuilder();

        if (!isAdmin) {
        //     builder.and((workflowMst.createBy.eq(username)).or(workflowMst.createBy.eq("admin")));
        }

        List<WorkflowMst> list = jpaQueryFactory
                                .select(Projections.fields(WorkflowMst.class,
                                        workflowMst.id,
                                        workflowMst.workflowNm,
                                        workflowMst.descTxt,
                                        workflowMst.createBy,
                                        workflowMst.createDttm,
                                        workflowMst.modifyBy,
                                        workflowMst.modifyDttm
                                        ))
                                .from(workflowMst)
                                .where(builder)
                                .orderBy(workflowMst.modifyDttm.coalesce(workflowMst.createDttm).desc())
                                .fetch();

        return list;
    }

}
