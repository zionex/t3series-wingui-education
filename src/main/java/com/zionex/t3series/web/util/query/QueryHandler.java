package com.zionex.t3series.web.util.query;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.BatchUpdateException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.Query;
import javax.persistence.StoredProcedureQuery;

import org.apache.commons.collections4.map.CaseInsensitiveMap;
import org.apache.commons.lang3.time.StopWatch;
import org.hibernate.Session;
import org.hibernate.exception.GenericJDBCException;
import org.hibernate.exception.SQLGrammarException;
import org.hibernate.jdbc.AbstractReturningWork;
import org.hibernate.procedure.internal.ProcedureOutputsImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zionex.t3series.util.ObjectUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import oracle.jdbc.OracleCallableStatement;
import oracle.jdbc.OracleTypes;

@Log
@Service
@RequiredArgsConstructor
public class QueryHandler {

    private final EntityManager entityManager;
    private final QueryLogService queryLogService;

    private static final String ORACLE = "ORACLE";
    private static final int BATCH_PARAM_CNT = 10000; // 원본 복사 Slot 크기
    private static final int BATCH_CNT = 30; // Commit 단위 Count

    @Value("${spring.config.activate.on-profile}")
    private String databaseType;

    /**
     * 1. Native Query
     */
    public List<?> getNativeQueryData(String sqlString) throws Exception {
        return this.getNativeQueryData(sqlString, null);
    }

    public List<?> getNativeQueryData(String sqlString, Class<?> resultClass) throws Exception {
        try {
            Query query;
            if (resultClass == null) {
                query = entityManager.createNativeQuery(sqlString);
            } else {
                query = entityManager.createNativeQuery(sqlString, resultClass);
            }

            return query.getResultList();
        } catch (Exception e) {
            log.warning(String.format("Exception occurs when query. (sql = %s) ", sqlString) + e.getMessage());
            throw e;
        }
    }

    public List<?> getNativeQueryData(String sqlString, Class<?> resultClass, Map<String, Object> params)
            throws Exception {
        try {
            Query query;
            if (resultClass == null) {
                query = entityManager.createNativeQuery(sqlString);
            } else {
                query = entityManager.createNativeQuery(sqlString, resultClass);
            }

            if (params != null) {
                params.forEach((parameterName, paramValue) -> {
                    query.setParameter(parameterName, paramValue);
                });
            }

            return query.getResultList();
        } catch (Exception e) {
            log.warning(String.format("Exception occurs when query. (sql = %s) ", sqlString) + e.getMessage());
            throw e;
        }
    }

    /**
     * 2. Procedure Call
     */
    public List<?> getProcedureData(String procedureName) throws Exception {
        return this.getProcedureData(procedureName, null, null);
    }

    public List<?> getProcedureData(String procedureName, Class<?> resultClass) throws Exception {
        return this.getProcedureData(procedureName, resultClass, null);
    }

    public static String getStackTrace(final Throwable throwable) {
        final StringWriter sw = new StringWriter();
        final PrintWriter pw = new PrintWriter(sw, true);
        throwable.printStackTrace(pw);
        return sw.getBuffer().toString();
    }

    public List<?> getProcedureData(String procedureName, Class<?> resultClass, Map<String, Object> params)
            throws Exception {

        if (resultClass != null)
            return getProcedureData(procedureName, resultClass, params);

        StoredProcedureQuery spq = entityManager.createStoredProcedureQuery(procedureName);
        try {
            CaseInsensitiveMap<String, Object> caseIgnoreInputParams = new CaseInsensitiveMap<>();
            if (params != null) {
                caseIgnoreInputParams.putAll(params);
            }

            List<Map<String, Object>> procParams = selectProcParams(procedureName);
            queryLogService.traceQuery(procedureName, caseIgnoreInputParams, procParams);

            List<String> outParamNames = new ArrayList<>();

            if (params != null) {
                params.forEach((parameterName, parameterInfo) -> {
                    Object[] info = (Object[]) parameterInfo;
                    Object paramValue = info[0];
                    Class<?> paramType = (Class<?>) info[1];
                    ParameterMode paramMode = (ParameterMode) info[2];

                    spq.registerStoredProcedureParameter(parameterName, paramType, paramMode);

                    if (paramMode.equals(ParameterMode.IN)) {
                        spq.setParameter(parameterName, paramValue);
                    } else if (paramMode.equals(ParameterMode.OUT)) {
                        outParamNames.add(parameterName);
                    }
                });
            }

            spq.execute();

            if (!outParamNames.isEmpty()) {
                Map<String, Object> outResult = new HashMap<>();
                outParamNames.forEach(key -> outResult.put(key, spq.getOutputParameterValue(key)));
                return new ArrayList<>(Collections.singletonList(outResult));
            }

            return spq.getResultList();
        } catch (SQLException se) {
            // se.printStackTrace();
            throw se;
        } catch (SQLGrammarException ge) {
            // ge.printStackTrace();
            SQLException se = ge.getSQLException();
            throw new Exception(se.getMessage());
        } catch (Exception e) {
            log.warning(String.format("Exception occurs when procedure. (procedureName = %s) ", procedureName)
                    + e.getMessage());
            throw e;
        } finally {
            if (spq != null) {
                spq.unwrap(ProcedureOutputsImpl.class).release();
            }
        }
    }

    public List<?> getProcedureData2(String procedureName, Class<?> resultClass, Map<String, Object> params)
            throws Exception {

        StoredProcedureQuery spq = entityManager.createStoredProcedureQuery(procedureName, resultClass);
        try {
            CaseInsensitiveMap<String, Object> caseIgnoreInputParams = new CaseInsensitiveMap<>();
            if (params != null) {
                caseIgnoreInputParams.putAll(params);
            }

            List<Map<String, Object>> procParams = selectProcParams(procedureName);
            queryLogService.traceQuery(procedureName, caseIgnoreInputParams, procParams);

            List<String> outParamNames = new ArrayList<>();

            if (params != null) {
                params.forEach((parameterName, parameterInfo) -> {
                    Object[] info = (Object[]) parameterInfo;
                    Object paramValue = info[0];
                    Class<?> paramType = (Class<?>) info[1];
                    ParameterMode paramMode = (ParameterMode) info[2];

                    spq.registerStoredProcedureParameter(parameterName, paramType, paramMode);

                    if (paramMode.equals(ParameterMode.IN)) {
                        spq.setParameter(parameterName, paramValue);
                    } else if (paramMode.equals(ParameterMode.OUT)) {
                        outParamNames.add(parameterName);
                    }
                });
            }

            spq.execute();

            if (!outParamNames.isEmpty()) {
                Map<String, Object> outResult = new HashMap<>();
                outParamNames.forEach(key -> outResult.put(key, spq.getOutputParameterValue(key)));
                return new ArrayList<>(Collections.singletonList(outResult));
            }

            return spq.getResultList();
        } catch (SQLException se) {
            // se.printStackTrace();
            throw se;
        } catch (SQLGrammarException ge) {
            // ge.printStackTrace();
            SQLException se = ge.getSQLException();
            throw new Exception(se.getMessage());
        } catch (Exception e) {
            log.warning(String.format("Exception occurs when procedure. (procedureName = %s) ", procedureName)
                    + e.getMessage());
            throw e;
        } finally {
            if (spq != null) {
                spq.unwrap(ProcedureOutputsImpl.class).release();
            }
        }
    }

    /**
     * Procedure 파라메터의 메타 정보를 리턴
     *
     * @param procName
     */
    public List<Map<String, Object>> selectProcParams(String procName) throws Exception {
        final List<Map<String, Object>> result = new ArrayList<>();
        final List<Map<String, Object>> resultSet = new ArrayList<>();

        try {
            Session hibernateSession = entityManager.unwrap(Session.class);
            hibernateSession.doReturningWork(new AbstractReturningWork<Integer>() {

                public Integer execute(Connection connection) throws SQLException {
                    ResultSet rs = null;
                    try {
                        DatabaseMetaData dbmd = connection.getMetaData();
                        String schema = null;
                        if (databaseType.equalsIgnoreCase(ORACLE)) {
                            schema = dbmd.getUserName();
                        }
                        rs = dbmd.getProcedureColumns(null, schema, procName, null);

                        boolean setNoCount = true;
                        String productName = dbmd.getDatabaseProductName();

                        while (rs.next()) {
                            Map<String, Object> param = new HashMap<>();
                            int ColType = rs.getInt("COLUMN_TYPE");

                            // SET NOCOUNT ON 처리
                            if (ColType == DatabaseMetaData.procedureColumnReturn && setNoCount) {
                                setNoCount = false;
                                continue;
                            }

                            String colName = rs.getString("COLUMN_NAME");
                            if (productName.contains("Microsoft")) {
                                colName = colName.replace("@", "");
                            }

                            param.put("COLUMN_NAME", colName);
                            param.put("PROCEDURE_SCHEM", rs.getString("PROCEDURE_SCHEM"));
                            param.put("PROCEDURE_NAME", rs.getString("PROCEDURE_NAME"));

                            param.put("COLUMN_TYPE", rs.getInt("COLUMN_TYPE"));
                            param.put("DATA_TYPE", rs.getInt("DATA_TYPE"));
                            param.put("TYPE_NAME", rs.getString("TYPE_NAME"));
                            param.put("PRECISION", rs.getInt("PRECISION"));
                            param.put("LENGTH", rs.getInt("LENGTH"));

                            param.put("SCALE", rs.getInt("SCALE"));
                            param.put("RADIX", rs.getShort("RADIX"));
                            param.put("NULLABLE", rs.getShort("NULLABLE"));
                            param.put("REMARKS", rs.getString("REMARKS"));
                            param.put("COLUMN_DEF", rs.getString("COLUMN_DEF"));
                            param.put("ORDINAL_POSITION", rs.getInt("ORDINAL_POSITION"));
                            param.put("IS_NULLABLE", rs.getString("IS_NULLABLE"));

                            if (ColType == DatabaseMetaData.procedureColumnIn
                                    || ColType == DatabaseMetaData.procedureColumnInOut
                                    || ColType == DatabaseMetaData.procedureColumnOut) {
                                if (!result.contains(param)) {
                                    result.add(param);
                                }
                            } else if (ColType == DatabaseMetaData.procedureColumnResult) {
                                resultSet.add(param);
                            }
                        }
                    } finally {
                        try {
                            if (rs != null) {
                                rs.close();
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                    return 0;
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
        return result;
    }

    /*
     * 이 함수의 목적은 프로시져 호출을 유연하게 하기 위한 것.
     * 파라메터 변경이나 결과값의 변경이 일어나더라도 backend 소스는 수정할 필요없이
     * frontend와 DB 프로시져 수정만 하면 된다.
     *
     * JDBC를 직접 이용하는 방법.
     *
     * procParams Map 구조:
     * "COLUMN_NAME" :
     * "PARAM_VALUE" :
     * "DATA_TYPE" : java.sql.Types.xxx
     * "COLUMN_TYPE":
     * DatabaseMetaData.procedureColumnOut/DatabaseMetaData.procedureColumnIn/
     * DatabaseMetaData.procedureColumnInOut
     * 오라클인 경우 프로시져 COLUMN_TYPE type이 procedureColumnInOut 이고 REF_CURSOR이면..
     * DATA_TYPE: java.sql.Types.OTHER 로 넘어온다.
     */
    public List<Map<String, Object>> getList(String procName, Map<String, Object> inputParams) throws Exception {

        CaseInsensitiveMap<String, Object> caseIgnoreInputParams = new CaseInsensitiveMap<>();
        if (inputParams != null) {
            caseIgnoreInputParams.putAll(inputParams);
        }

        List<Map<String, Object>> procParams = selectProcParams(procName);
        queryLogService.traceQuery(procName, caseIgnoreInputParams, procParams);

        if (procParams != null) {
            for (Map<String, Object> procParam : procParams) {
                if (procParam != null) {
                    String parameterName = (String) procParam.get("COLUMN_NAME");
                    int columnType = (int) procParam.get("COLUMN_TYPE");

                    if (columnType == DatabaseMetaData.procedureColumnIn
                            || columnType == DatabaseMetaData.procedureColumnInOut) {
                        Object paramValue = caseIgnoreInputParams.get(parameterName);
                        procParam.put("PARAM_VALUE", paramValue);
                    }
                }
            }
        }

        return getProcedureDataMapList(procName, procParams);
    }

    public List<Map<String, Object>> getProcedureDataMapList(String procedureName,
            List<Map<String, Object>> procParams) throws Exception {
        final List<Map<String, Object>> result = new ArrayList<>();
        Session hibernateSession = null;
        try {
            hibernateSession = entityManager.unwrap(Session.class);

            hibernateSession.doReturningWork(new AbstractReturningWork<Integer>() {

                public Integer execute(Connection connection) throws SQLException {
                    DatabaseMetaData dbmd = connection.getMetaData();
                    String productName = dbmd.getDatabaseProductName();

                    if (productName.contains("Microsoft")) {
                        getProcedureMapDataListMssql(connection, procedureName, procParams, result);
                    } else {
                        getProcedureMapDataListOracle(connection, procedureName, procParams, result);
                    }

                    return 0;
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        } finally {
            if (hibernateSession != null)
                hibernateSession.close();
        }
        return result;
    }

    public void getProcedureMapDataListMssql(Connection connection, String procedureName,
            List<Map<String, Object>> procParams, List<Map<String, Object>> result) throws SQLException {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("{ call ");
        sqlBuilder.append(procedureName);

        if (procParams != null) {
            sqlBuilder.append("(");

            for (int i = 0; i < procParams.size(); i++) {
                if (i != 0) {
                    sqlBuilder.append(",");
                }
                sqlBuilder.append("?");
            }
            sqlBuilder.append(")");
        }
        sqlBuilder.append(" }");
        System.out.println(sqlBuilder);

        CallableStatement cstmt = null;
        try {
            cstmt = connection.prepareCall(sqlBuilder.toString());

            if (procParams != null) {
                for (Map<String, Object> procParam : procParams) {
                    String parameterName = (String) procParam.get("COLUMN_NAME");
                    Object paramValue = procParam.get("PARAM_VALUE");
                    int sqlDataType = (int) procParam.get("DATA_TYPE");
                    int columnType = (int) procParam.get("COLUMN_TYPE");

                    try {
                        if (columnType == DatabaseMetaData.procedureColumnOut) {
                            if (sqlDataType == java.sql.Types.OTHER) {
                                cstmt.registerOutParameter(parameterName, OracleTypes.CURSOR);
                            } else {
                                cstmt.registerOutParameter(parameterName, sqlDataType);
                            }
                        } else if (columnType == DatabaseMetaData.procedureColumnInOut
                                || columnType == DatabaseMetaData.procedureColumnIn) {
                            switch (sqlDataType) {
                                case java.sql.Types.DECIMAL:
                                case java.sql.Types.NUMERIC:
                                    cstmt.setBigDecimal(parameterName, getBigDecimal(paramValue));
                                    break;
                                case java.sql.Types.BINARY:
                                case java.sql.Types.ARRAY:
                                case java.sql.Types.BLOB:
                                case java.sql.Types.VARBINARY:
                                    cstmt.setBytes(parameterName, (byte[]) paramValue);
                                    break;
                                case java.sql.Types.BIGINT:
                                    cstmt.setLong(parameterName, (long) paramValue);
                                    break;
                                case java.sql.Types.BOOLEAN:
                                    cstmt.setBoolean(parameterName, (boolean) paramValue);
                                    break;
                                case java.sql.Types.DATE:
                                    cstmt.setDate(parameterName, getDate(paramValue));
                                    break;
                                case java.sql.Types.TIME:
                                case java.sql.Types.TIMESTAMP:
                                    cstmt.setTimestamp(parameterName, getTimestamp(paramValue));
                                    break;
                                case java.sql.Types.REAL:
                                case java.sql.Types.DOUBLE:
                                    cstmt.setDouble(parameterName, (double) paramValue);
                                    break;
                                case java.sql.Types.INTEGER:
                                    cstmt.setInt(parameterName, (int) paramValue);
                                    break;
                                case java.sql.Types.FLOAT:
                                    cstmt.setFloat(parameterName, (float) paramValue);
                                    break;
                                case java.sql.Types.BIT:
                                case java.sql.Types.SMALLINT:
                                case java.sql.Types.TINYINT:
                                    cstmt.setShort(parameterName, (short) paramValue);
                                    break;
                                case java.sql.Types.NVARCHAR:
                                case java.sql.Types.CHAR:
                                case java.sql.Types.VARCHAR:
                                case java.sql.Types.NCHAR:
                                case java.sql.Types.CLOB:
                                case java.sql.Types.LONGNVARCHAR:
                                case java.sql.Types.LONGVARCHAR:
                                default:
                                    cstmt.setString(parameterName, (String) paramValue);
                                    break;
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        throw e;
                    }
                }
            }

            ResultSet rs = cstmt.executeQuery();

            ResultSetMetaData rsmd = rs.getMetaData();
            int colCnt = rsmd.getColumnCount();
            String[] aliases = new String[colCnt];

            for (int i = 1; i <= colCnt; i++) {
                aliases[i - 1] = rsmd.getColumnName(i);
            }

            while (rs.next()) {
                Map<String, Object> data = new HashMap<>();
                Arrays.asList(aliases).forEach(k -> {
                    try {
                        data.put(k, rs.getObject(k));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });
                result.add(data);
            }

            rs.close();
        } finally {
            if (cstmt != null)
                cstmt.close();
        }
    }

    public void getProcedureMapDataListOracle(Connection connection, String procedureName,
            List<Map<String, Object>> procParams, List<Map<String, Object>> result) throws SQLException {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("{ call ");
        sqlBuilder.append(procedureName);

        if (procParams != null) {
            sqlBuilder.append("(");

            for (int i = 0; i < procParams.size(); i++) {
                if (i != 0) {
                    sqlBuilder.append(",");
                }
                sqlBuilder.append("?");
            }
            sqlBuilder.append(")");
        }
        sqlBuilder.append(" }");
        System.out.println(sqlBuilder);

        CallableStatement cstmt = null;
        OracleCallableStatement ocstmt = null;

        try {
            cstmt = connection.prepareCall(sqlBuilder.toString());
            ocstmt = cstmt.unwrap(OracleCallableStatement.class);

            int cursoridx = -1;
            if (procParams != null) {
                for (Map<String, Object> procParam : procParams) {
                    Object paramValue = procParam.get("PARAM_VALUE");
                    int sqlDataType = (int) procParam.get("DATA_TYPE");
                    int columnType = (int) procParam.get("COLUMN_TYPE");
                    int columnPosition = (int) procParam.get("ORDINAL_POSITION");
                    columnPosition++;
                    try {
                        if (columnType == DatabaseMetaData.procedureColumnOut) {
                            if (sqlDataType == java.sql.Types.OTHER) {
                                ocstmt.registerOutParameter(columnPosition, OracleTypes.CURSOR);
                                cursoridx = columnPosition;
                            } else {
                                ocstmt.registerOutParameter(columnPosition, sqlDataType);
                            }
                        } else if (columnType == DatabaseMetaData.procedureColumnInOut
                                || columnType == DatabaseMetaData.procedureColumnIn) {
                            switch (sqlDataType) {
                                case java.sql.Types.DECIMAL:
                                case java.sql.Types.NUMERIC:
                                    ocstmt.setBigDecimal(columnPosition, getBigDecimal(paramValue));
                                    break;
                                case java.sql.Types.BINARY:
                                case java.sql.Types.ARRAY:
                                case java.sql.Types.BLOB:
                                case java.sql.Types.VARBINARY:
                                    ocstmt.setBytes(columnPosition, (byte[]) paramValue);
                                    break;
                                case java.sql.Types.BIGINT:
                                    ocstmt.setLong(columnPosition, (long) paramValue);
                                    break;
                                case java.sql.Types.BOOLEAN:
                                    ocstmt.setBoolean(columnPosition, (boolean) paramValue);
                                    break;
                                case java.sql.Types.DATE:
                                    cstmt.setDate(columnPosition, getDate(paramValue));
                                    break;
                                case java.sql.Types.TIME:
                                case java.sql.Types.TIMESTAMP:
                                    ocstmt.setTimestamp(columnPosition, getTimestamp(paramValue));
                                    break;
                                case java.sql.Types.REAL:
                                case java.sql.Types.DOUBLE:
                                    ocstmt.setDouble(columnPosition, (double) paramValue);
                                    break;
                                case java.sql.Types.INTEGER:
                                    ocstmt.setInt(columnPosition, (int) paramValue);
                                    break;
                                case java.sql.Types.FLOAT:
                                    ocstmt.setFloat(columnPosition, (float) paramValue);
                                    break;
                                case java.sql.Types.BIT:
                                case java.sql.Types.SMALLINT:
                                case java.sql.Types.TINYINT:
                                    ocstmt.setShort(columnPosition, (short) paramValue);
                                    break;
                                case java.sql.Types.NVARCHAR:
                                case java.sql.Types.CHAR:
                                case java.sql.Types.VARCHAR:
                                case java.sql.Types.NCHAR:
                                case java.sql.Types.CLOB:
                                case java.sql.Types.LONGNVARCHAR:
                                case java.sql.Types.LONGVARCHAR:
                                default:
                                    ocstmt.setString(columnPosition, (String) paramValue);
                                    break;
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        throw e;
                    }
                }
            }

            ocstmt.execute();

            ResultSet rs = ocstmt.getCursor(cursoridx);
            if (rs != null) {
                ResultSetMetaData rsmd = rs.getMetaData();
                int colCnt = rsmd.getColumnCount();
                String[] aliases = new String[colCnt];

                for (int i = 1; i <= colCnt; i++) {
                    aliases[i - 1] = rsmd.getColumnName(i);
                }

                while (rs.next()) {
                    Map<String, Object> data = new HashMap<>();
                    Arrays.asList(aliases).forEach(k -> {
                        try {
                            Object object = rs.getObject(k);
                            data.put(k, convertOracleData(object));
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
                    result.add(data);
                }
                rs.close();
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        } finally {
            if (ocstmt != null)
                ocstmt.close();
            if (cstmt != null)
                cstmt.close();
        }
    }

    @Transactional
    @SuppressWarnings("unchecked")
    public Map<String, Object> save(String procName, Map<String, Object> params) throws Exception {
        params.put("P_RT_ROLLBACK_FLAG", new Object[] { null, String.class, ParameterMode.OUT });
        params.put("P_RT_MSG", new Object[] { null, String.class, ParameterMode.OUT });

        Map<String, Object> resultMap = new HashMap<>();
        Map<String, Object> result = checkResultFlag(
                (List<Map<String, Object>>) getProcedureData(procName, null, params));

        if (!ObjectUtils.toBoolean(result.get("success"))) {
            resultMap.putAll(result);
        } else {
            resultMap.putAll(result);
        }

        return resultMap;
    }

    public Map<String, Object> checkResultFlag(List<Map<String, Object>> result) {
        Map<String, Object> rt = new HashMap<>();

        if (result.isEmpty()) {
            rt.put("success", false);
            rt.put("message", "MSG_0004");
        } else {
            Map<String, Object> resultMap = result.get(0);
            rt.put("success", ObjectUtils.toString(resultMap.get("P_RT_ROLLBACK_FLAG")));
            rt.put("message", ObjectUtils.toString(resultMap.get("P_RT_MSG")));
        }

        return rt;
    }

    public static BigDecimal getBigDecimal(Object value) {
        BigDecimal ret = null;
        if (value != null) {
            if (value instanceof BigDecimal) {
                ret = (BigDecimal) value;
            } else if (value instanceof String) {
                ret = new BigDecimal((String) value);
            } else if (value instanceof BigInteger) {
                ret = new BigDecimal((BigInteger) value);
            } else if (value instanceof Integer) {
                ret = new BigDecimal((Integer) value);
            } else if (value instanceof Long) {
                ret = new BigDecimal((Long) value);
            } else if (value instanceof Number) {
                ret = new BigDecimal(((Number) value).doubleValue());
            } else {
                throw new ClassCastException("Not possible to coerce [" + value + "] from class " + value.getClass()
                        + " into a BigDecimal.");
            }
        }
        return ret;
    }

    public static Date getDate(Object value) {
        Date ret = null;
        if (value != null) {
            if (value instanceof Date) {
                ret = (Date) value;
            } else if (value instanceof java.util.Date) {
                ret = new Date(((java.util.Date) value).getTime());
            } else if (value instanceof String) {
                String strDate = (String) value;
                if (strDate.indexOf("T") >= 0) {
                    java.util.Calendar cal = javax.xml.bind.DatatypeConverter.parseDateTime((String) value);
                    ret = new java.sql.Date(cal.getTime().getTime());
                } else {
                    ret = Date.valueOf((String) value);
                }
            } else if (value instanceof BigInteger) {
                ret = new Date(((BigInteger) value).longValue());
            } else if (value instanceof Integer) {
                ret = new Date((Integer) value);
            } else if (value instanceof Long) {
                ret = new Date((Long) value);
            } else if (value instanceof Number) {
                ret = new Date(((Number) value).longValue());
            } else {
                throw new ClassCastException("Not possible to coerce [" + value + "] from class " + value.getClass()
                        + " into a BigDecimal.");
            }
        }
        return ret;
    }

    public static Timestamp getTimestamp(Object value) {
        Timestamp ret = null;
        if (value != null) {
            if (value instanceof Timestamp) {
                ret = (Timestamp) value;
            } else if (value instanceof java.util.Date) {
                ret = new Timestamp(((java.util.Date) value).getTime());
            } else if (value instanceof String) {
                String strDate = (String) value;
                if (strDate.indexOf("T") >= 0) {
                    java.util.Calendar cal = javax.xml.bind.DatatypeConverter.parseDateTime((String) value);
                    ret = new Timestamp(cal.getTime().getTime());
                } else
                    ret = Timestamp.valueOf((String) value);
            } else if (value instanceof BigInteger) {
                ret = new Timestamp(((BigInteger) value).longValue());
            } else if (value instanceof Integer) {
                ret = new Timestamp((Integer) value);
            } else if (value instanceof Long) {
                ret = new Timestamp((Long) value);
            } else if (value instanceof Number) {
                ret = new Timestamp(((Number) value).longValue());
            } else {
                throw new ClassCastException("Not possible to coerce [" + value + "] from class " + value.getClass()
                        + " into a BigDecimal.");
            }
        }
        return ret;
    }

    List<Map<String, Object>> copyParams(List<Map<String, Object>> procParams) {
        List<Map<String, Object>> ret = new ArrayList<>();

        for (Map<String, Object> procParam : procParams) {
            Map<String, Object> copy = new HashMap<>(procParam);
            ret.add(copy);
        }
        return ret;
    }

    /**
     * Oracle Timestamp type -> Java Timestamp
     */
    public Object convertOracleData(Object data) throws SQLException {
        if (data instanceof oracle.sql.TIMESTAMP) {
            data = ((oracle.sql.TIMESTAMP) data).timestampValue();
        }
        return data;
    }

    /**
     * batch procedure JDBC버전
     *
     * @param procName
     * @param inputParams key: value 형태의 Map(한개 프로시져에 대한 호출파라메터) List
     * @return
     */
    public Map<String, Object> executeBulk(String procName, List<Map<String, Object>> batchParamList) throws Exception {

        Map<String, Object> resultMap = new HashMap<>();

        List<Map<String, Object>> procParams = selectProcParams(procName);

        StopWatch watch = new StopWatch();
        watch.start();

        int totalCnt = batchParamList.size();
        int totalExecuteCnt = 0;
        ArrayList<List<Map<String, Object>>> lastParamList = new ArrayList<>();

        ArrayList<List<Map<String, Object>>> paramArray = new ArrayList<>();
        try {
            for (int i = 0; i < batchParamList.size(); i++) {
                Map<String, Object> inputParams = batchParamList.get(i);
                List<Map<String, Object>> elemParams = copyParams(procParams);

                CaseInsensitiveMap<String, Object> caseIgnoreInputParams = new CaseInsensitiveMap<>();
                if (inputParams != null) {
                    caseIgnoreInputParams.putAll(inputParams);
                }

                for (Map<String, Object> procParam : elemParams) {
                    if (procParam != null) {
                        String parameterName = (String) procParam.get("COLUMN_NAME");
                        int columnType = (int) procParam.get("COLUMN_TYPE");

                        if (columnType == DatabaseMetaData.procedureColumnIn
                                || columnType == DatabaseMetaData.procedureColumnInOut) {
                            Object paramValue = caseIgnoreInputParams.get(parameterName);
                            procParam.put("PARAM_VALUE", paramValue);
                        }
                    }
                }
                paramArray.add(elemParams);
                /**
                 * BATCH_PARAM_CNT개 단위로 배치실행하고 전체 복사하면 heap메모리를 너무 많이 쓰게 된다.
                 */
                if (i % BATCH_PARAM_CNT == 0) {
                    lastParamList.clear();
                    lastParamList.addAll(paramArray);

                    executeBatchProcedure(procName, paramArray);
                    totalExecuteCnt += paramArray.size();
                    paramArray.clear();
                }
            }

            lastParamList.clear();
            lastParamList.addAll(paramArray);

            executeBatchProcedure(procName, paramArray);
            totalExecuteCnt += paramArray.size();
            paramArray = null;

        } catch (SQLGrammarException se) {
            SQLException realSe = se.getSQLException();
            se.printStackTrace();
            resultMap.put("success", false);
            resultMap.put("message",
                    "TOTAL:" + totalCnt + ", COMPLETE:" + totalExecuteCnt + ", EXCEPTION: " + realSe.getMessage());
        } catch (SQLException se) {
            se.printStackTrace();
            resultMap.put("success", false);
            resultMap.put("message",
                    "TOTAL:" + totalCnt + ", COMPLETE:" + totalExecuteCnt + ", EXCEPTION: " + se.getMessage());
        } catch (GenericJDBCException ge) {
            ge.printStackTrace();
            SQLException see = ge.getSQLException();
            resultMap.put("success", false);
            resultMap.put("message",
                    "TOTAL:" + totalCnt + ", COMPLETE:" + totalExecuteCnt + ", EXCEPTION: " + see.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            resultMap.put("success", false);
            resultMap.put("message",
                    "TOTAL:" + totalCnt + ", COMPLETE:" + totalExecuteCnt + ", EXCEPTION: " + e.getMessage());
        }
        watch.stop();
        System.out.println("executeBulk:(" + procName + ") 수행시간: " + watch.getTime());
        return resultMap;
    }

    ArrayList<List<Map<String, Object>>> getPartList(ArrayList<List<Map<String, Object>>> lst, int startIdx, int count,
            ArrayList<List<Map<String, Object>>> partParamList) {
        partParamList.clear();

        int lastIdx = Math.min(lst.size(), startIdx + count);

        int idx = 0;
        for (int i = startIdx; i < lastIdx; i++) {
            partParamList.add(idx, lst.get(startIdx + idx));
            idx++;
        }
        return partParamList;
    }

    /**
     * 프로시져 배치 실행, IF등 처리를 위해
     * JPA를 사용하면 너무 느려서 허용 불가
     *
     * @param procedureName
     * @param procParams
     * @return
     */

    public void executeBatchProcedure(String procedureName, ArrayList<List<Map<String, Object>>> procParams)
            throws Exception, SQLException {

        Session hibernateSession = entityManager.unwrap(Session.class);
        try {

            hibernateSession.doReturningWork(new AbstractReturningWork<Integer>() {

                public Integer execute(Connection connection) throws SQLException {
                    DatabaseMetaData dbmd = connection.getMetaData();
                    String productName = dbmd.getDatabaseProductName();

                    ArrayList<List<Map<String, Object>>> partBucket = new ArrayList<List<Map<String, Object>>>();
                    // 파라메터를 BATCH_CNT 개씩 쪼개서 커밋처리
                    int idx = 0;
                    ArrayList<List<Map<String, Object>>> partParamList = getPartList(procParams, idx, BATCH_CNT,
                            partBucket);
                    while (partParamList.size() > 0) {
                        connection.setAutoCommit(false);

                        if (productName.contains("Microsoft")) {
                            executeBatchProcedureMssql(connection, procedureName, partParamList);
                        } else {
                            executeBatchProcedureOracle(connection, procedureName, partParamList);
                        }
                        connection.commit();

                        idx = idx + partParamList.size();
                        partParamList = getPartList(procParams, idx, BATCH_CNT, partBucket);
                    }
                    partBucket = null;

                    return partParamList.size();
                }
            });
        } finally {
            if (hibernateSession != null)
                hibernateSession.close();
        }
    }

    public void executeBatchProcedureMssql(Connection connection, String procedureName,
            List<List<Map<String, Object>>> procParamsList) throws SQLException {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("{ call ");
        sqlBuilder.append(procedureName);

        if (procParamsList.size() == 0) {
            return;
        }

        List<Map<String, Object>> orderedParams = procParamsList.get(0);
        if (orderedParams != null) {
            sqlBuilder.append("(");

            for (int i = 0; i < orderedParams.size(); i++) {
                if (i != 0) {
                    sqlBuilder.append(",");
                }
                sqlBuilder.append("?");
            }
            sqlBuilder.append(")");
        }
        sqlBuilder.append(" }");

        CallableStatement cstmt = null;

        try {
            cstmt = connection.prepareCall(sqlBuilder.toString());

            for (int i = 0; i < procParamsList.size(); i++) {
                List<Map<String, Object>> procParams = procParamsList.get(i);

                if (procParams != null) {
                    for (Map<String, Object> procParam : procParams) {
                        String parameterName = (String) procParam.get("COLUMN_NAME");
                        Object paramValue = procParam.get("PARAM_VALUE");

                        int sqlDataType = (int) procParam.get("DATA_TYPE");
                        int columnType = (int) procParam.get("COLUMN_TYPE");

                        try {
                            // 배치 프로시져 수행해서는 output 파라메터가 허용되지 않음.
                            if (columnType == DatabaseMetaData.procedureColumnIn) {
                                switch (sqlDataType) {
                                    case java.sql.Types.DECIMAL:
                                    case java.sql.Types.NUMERIC:
                                        cstmt.setBigDecimal(parameterName, getBigDecimal(paramValue));
                                        break;
                                    case java.sql.Types.BINARY:
                                    case java.sql.Types.ARRAY:
                                    case java.sql.Types.BLOB:
                                    case java.sql.Types.VARBINARY:
                                        cstmt.setBytes(parameterName, (byte[]) paramValue);
                                        break;
                                    case java.sql.Types.BIGINT:
                                        cstmt.setLong(parameterName, (long) paramValue);
                                        break;
                                    case java.sql.Types.BOOLEAN:
                                        cstmt.setBoolean(parameterName, (boolean) paramValue);
                                        break;
                                    case java.sql.Types.DATE:
                                        cstmt.setDate(parameterName, getDate(paramValue));
                                        break;
                                    case java.sql.Types.TIME:
                                    case java.sql.Types.TIMESTAMP:
                                        cstmt.setTimestamp(parameterName, getTimestamp(paramValue));
                                        break;
                                    case java.sql.Types.REAL:
                                    case java.sql.Types.DOUBLE:
                                        cstmt.setDouble(parameterName, (double) paramValue);
                                        break;
                                    case java.sql.Types.INTEGER:
                                        cstmt.setInt(parameterName, (int) paramValue);
                                        break;
                                    case java.sql.Types.FLOAT:
                                        cstmt.setFloat(parameterName, (float) paramValue);
                                        break;
                                    case java.sql.Types.BIT:
                                    case java.sql.Types.SMALLINT:
                                    case java.sql.Types.TINYINT:
                                        cstmt.setShort(parameterName, (short) paramValue);
                                        break;
                                    case java.sql.Types.NVARCHAR:
                                    case java.sql.Types.CHAR:
                                    case java.sql.Types.VARCHAR:
                                    case java.sql.Types.NCHAR:
                                    case java.sql.Types.CLOB:
                                    case java.sql.Types.LONGNVARCHAR:
                                    case java.sql.Types.LONGVARCHAR:
                                    default:
                                        cstmt.setString(parameterName, (String) paramValue);
                                        break;
                                }
                            }

                        } catch (Exception e) {
                            e.printStackTrace();
                            throw e;
                        }
                    }
                    cstmt.addBatch();
                }
            }
            cstmt.executeBatch();
        } catch (BatchUpdateException e) {
            // e.printStackTrace();
            throw new SQLException(e);
        } finally {
            if (cstmt != null)
                cstmt.close();
        }
    }

    public void executeBatchProcedureOracle(Connection connection, String procedureName,
            List<List<Map<String, Object>>> procParamsList) throws SQLException {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("{ call ");
        sqlBuilder.append(procedureName);

        if (procParamsList.size() == 0) {
            return;
        }

        List<Map<String, Object>> orderedParams = procParamsList.get(0);
        if (orderedParams != null) {
            sqlBuilder.append("(");

            for (int i = 0; i < orderedParams.size(); i++) {
                if (i != 0) {
                    sqlBuilder.append(",");
                }
                sqlBuilder.append("?");
            }
            sqlBuilder.append(")");
        }
        sqlBuilder.append(" }");
        System.out.println(sqlBuilder);

        CallableStatement cstmt = null;
        OracleCallableStatement ocstmt = null;

        try {
            cstmt = connection.prepareCall(sqlBuilder.toString());
            ocstmt = cstmt.unwrap(OracleCallableStatement.class);

            for (int i = 0; i < procParamsList.size(); i++) {
                List<Map<String, Object>> procParams = procParamsList.get(i);
                if (procParams != null) {
                    for (Map<String, Object> procParam : procParams) {
                        Object paramValue = procParam.get("PARAM_VALUE");
                        int sqlDataType = (int) procParam.get("DATA_TYPE");
                        int columnType = (int) procParam.get("COLUMN_TYPE");
                        int columnPosition = (int) procParam.get("ORDINAL_POSITION");
                        columnPosition++;
                        try {
                            // 배치 프로시져 수행해서는 output 파라메터가 허용되지 않음.
                            if (columnType == DatabaseMetaData.procedureColumnIn) {
                                switch (sqlDataType) {
                                    case java.sql.Types.DECIMAL:
                                    case java.sql.Types.NUMERIC:
                                        ocstmt.setBigDecimal(columnPosition, getBigDecimal(paramValue));
                                        break;
                                    case java.sql.Types.BINARY:
                                    case java.sql.Types.ARRAY:
                                    case java.sql.Types.BLOB:
                                    case java.sql.Types.VARBINARY:
                                        ocstmt.setBytes(columnPosition, (byte[]) paramValue);
                                        break;
                                    case java.sql.Types.BIGINT:
                                        ocstmt.setLong(columnPosition, (long) paramValue);
                                        break;
                                    case java.sql.Types.BOOLEAN:
                                        ocstmt.setBoolean(columnPosition, (boolean) paramValue);
                                        break;
                                    case java.sql.Types.DATE:
                                        cstmt.setDate(columnPosition, getDate(paramValue));
                                        break;
                                    case java.sql.Types.TIME:
                                    case java.sql.Types.TIMESTAMP:
                                        ocstmt.setTimestamp(columnPosition, getTimestamp(paramValue));
                                        break;
                                    case java.sql.Types.REAL:
                                    case java.sql.Types.DOUBLE:
                                        ocstmt.setDouble(columnPosition, (double) paramValue);
                                        break;
                                    case java.sql.Types.INTEGER:
                                        ocstmt.setInt(columnPosition, (int) paramValue);
                                        break;
                                    case java.sql.Types.FLOAT:
                                        ocstmt.setFloat(columnPosition, (float) paramValue);
                                        break;
                                    case java.sql.Types.BIT:
                                    case java.sql.Types.SMALLINT:
                                    case java.sql.Types.TINYINT:
                                        ocstmt.setShort(columnPosition, (short) paramValue);
                                        break;
                                    case java.sql.Types.NVARCHAR:
                                    case java.sql.Types.CHAR:
                                    case java.sql.Types.VARCHAR:
                                    case java.sql.Types.NCHAR:
                                    case java.sql.Types.CLOB:
                                    case java.sql.Types.LONGNVARCHAR:
                                    case java.sql.Types.LONGVARCHAR:
                                    default:
                                        ocstmt.setString(columnPosition, (String) paramValue);
                                        break;
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            throw e;
                        }
                    }
                }
                cstmt.addBatch();
            }
            ocstmt.executeBatch();
        } catch (BatchUpdateException e) {
            // e.printStackTrace();
            throw new SQLException(e);
        } finally {
            if (ocstmt != null)
                ocstmt.close();
            if (cstmt != null)
                cstmt.close();
        }
    }
}