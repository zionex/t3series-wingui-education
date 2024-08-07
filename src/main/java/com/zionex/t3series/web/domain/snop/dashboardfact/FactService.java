package com.zionex.t3series.web.domain.snop.dashboardfact;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.zionex.t3series.web.util.query.QueryHandler;

import lombok.RequiredArgsConstructor;
import net.sf.jsqlparser.expression.Alias;
import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.statement.select.*;

@Service
@RequiredArgsConstructor
public class FactService {
    private final AggrMstRepository aggrMstRepository;
    private final FactQueryRepository factqueryrepository;
    private final FactFieldDescRepository factFieldDescRepository;
    private final QueryHandler queryHandler;

    public List<FactFieldDesc> getFactColumns(String aggrId) throws Exception {
        return factqueryrepository.getFieldDesc(aggrId);
    }

    public List<Map<String, Object>> getFactData(String aggrId, String whereStr) throws Exception {
        List<Map<String, Object>> resultList = new ArrayList<>();
        List<FactFieldDesc> fieldDescs = factqueryrepository.getFieldDesc(aggrId);

        List<String> selectField = new ArrayList<>();
        fieldDescs.forEach(data -> {
            selectField.add(data.getField());
        });

        String convertSelectField = String.join(", ", selectField);
        List<Object[]> factList = factqueryrepository.getFactList(aggrId, convertSelectField, whereStr);
        factList.forEach(data -> {
            Map<String, Object> object = new HashMap<>();
            for (int i = 0; i < selectField.size(); i++) {
                object.put(selectField.get(i), data[i]);
            }
            resultList.add(object);
        });

        return resultList;
    }

    public List<AggrMst> getAggMstList(String aggrId, String aggrName, String id) throws Exception {
        return factqueryrepository.getAggrMst(aggrId, aggrName, id);
    }

    // procedure읽어서 컬럼 정의
    public List<Map<String, Object>> getColumnDef(String procNm) throws Exception {
        List<Map<String, Object>> resultList = new ArrayList<>();

        // 주석으로 select문 찾기
        String procSelect = factqueryrepository.getProcSelect(procNm);

        List<Map<String, Object>> procParams = queryHandler.selectProcParams(procNm);

        List<String> params = new ArrayList<>();
        procParams.forEach(data -> {
            params.add((String) data.get("COLUMN_NAME"));
        });

        // Parse the SQL query
        Statement statement = CCJSqlParserUtil.parse(procSelect);

        if (statement instanceof Select) {
            Select selectStatement = (Select) statement;
            PlainSelect plainSelect = (PlainSelect) selectStatement.getSelectBody();

            for (SelectItem item : plainSelect.getSelectItems()) {
                if (!item.toString().startsWith("CREATE_") && !item.toString().startsWith("MODIFY_")) {
                    Alias alias = ((SelectExpressionItem) item).getAlias();
                    Map<String, Object> map = new HashMap<>();

                    if(alias != null){
                        map.put("field", alias.getName().replaceAll("'",""));
                    }else{
                        map.put("field", item.toString());
                    }
                    
                    for (int i = 0; i < params.size(); i++) {
                        if(item.toString().indexOf(params.get(i).replace("P_", "")) > -1 ){
                            map.put("conditionParam", params.get(i));
                        }
                    }

                    resultList.add(map);
                }
            }
        }
        return resultList;
    }

    // Aggr_Mst 저장
    public void saveAggrMst(AggrMst aggrMst) {
        aggrMstRepository.save(aggrMst);
    }

    // Aggr_Mst 삭제
    public void deleteAggrMst(List<AggrMst> aggrMst) {
        for (int i = 0; i < aggrMst.size(); i++) {
            String aggrId = aggrMst.get(i).getAggrId();
            // Field_Desc 삭제
            factFieldDescRepository.deleteByAggrId(aggrId);
        }
        aggrMstRepository.deleteAll(aggrMst);
    }

    // Field_Desc 저장
    public void saveFieldDesc(List<FactFieldDesc> factFieldDesc) {
        factFieldDescRepository.saveAll(factFieldDesc);
    }

    // Field_Desc 삭제
    public void deleteFieldDesc(List<FactFieldDesc> factFieldDesc) {
        factFieldDescRepository.deleteAll(factFieldDesc);
    }
}
