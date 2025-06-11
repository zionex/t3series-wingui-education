package com.zionex.t3series.web.domain.util.bulkinsert;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zionex.t3series.web.domain.util.exception.NoContentException;

import lombok.Builder;
import lombok.Data;

@Slf4j
@Service
public class ImportSchemaService {

    private static final String FILE_PATH = "tables/";
    private static final String MODULES_FILE_PATH = FILE_PATH + "MODULES.json";
    private static final String MODULE_CD = "#MODULE_CD";
    private static final String MODULES_TABLE_FILE_PATH = FILE_PATH + "PROCESS_" + MODULE_CD +".json";
    private static final String SCHEMA_FILE_PATH = "tables/import_schema.json";

    private static final String TYPE_VALIDATION = "VALIDATION";
    private static final String TYPE_TABLE = "TABLE";

    @Autowired
    DataSource dataSource;

    @Autowired
    ImportJobRepository importJobRepository;

    public List<String> getImportModules() {
        try {
            ModuleJson moduleJson = readFromModuleFile();
            return moduleJson.getModules().stream()
                    .map(ModuleJson.Module::getModuleCd)
                    .distinct()
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("An unexpected error occurred while retrieving import modules : {}", e.getMessage());
        }
        return Collections.emptyList();
    }

    private ModuleJson readFromModuleFile() throws  IOException {
        File file = new ClassPathResource(MODULES_FILE_PATH).getFile();
        String jsonData = FileUtils.readFileToString(file, StandardCharsets.UTF_8);

        return mappingModuleJson(jsonData);
    }

    private ModuleJson mappingModuleJson(String jsonData) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(jsonData, new TypeReference<ModuleJson>() {});
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    public ModuleJson.Module getImportTables(String module) {
        try {
            ModuleJson moduleJson = readFromModuleFile();
            ModuleJson.Module moduleLevel =  moduleJson.getModules().stream()
                    .filter(it -> it.getModuleCd().equals(module.toUpperCase()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException());

            ProcessJson processJson = readFromProcessFile(module);
            ImportSchemaService.DBQuery dbQuery = getDbQueryHandle().active();
            List<ProcessJson.Table> moduleTables = processJson.getTables();
            moduleTables.forEach(table -> {
                if (table.getType() == null || table.getType().toUpperCase().equals(TYPE_TABLE)) {
                    table.setDataCount(dbQuery.count(table.getTable()));
                }
            });
            dbQuery.finish();

            moduleLevel.getLevels().forEach(level -> {
                level.setTables(moduleTables.stream()
                        .filter(table -> table.getLevel() == level.getLevel())
                        .collect(Collectors.toList())
                );
            });

            return moduleLevel;
        } catch (IllegalArgumentException e) {
            log.error("Invalid argument provided: {}", e.getMessage());
        } catch (Exception e) {
            log.error("An unexpected error occurred while retrieving import tables for module: {}, {}", module, e.getMessage());
        }
        return null;
    }

    private ProcessJson readFromProcessFile(String module) {
        try {
            File file = new ClassPathResource(MODULES_TABLE_FILE_PATH.replace(MODULE_CD, module.toUpperCase())).getFile();
            String jsonData = FileUtils.readFileToString(file, StandardCharsets.UTF_8);

            return mappingProcessJson(jsonData);
        }  catch (Exception e) {
            log.error("Failed to read process file for module: {}, {}", module, e.getMessage());
        }
        return null;
    }

    private ProcessJson mappingProcessJson(String jsonData) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(jsonData, new TypeReference<ProcessJson>() {});
        } catch (JsonProcessingException jpe) {
            log.error("JSON processing error while loading module data: {}", jpe.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while loading module data: {}", e.getMessage());
        }
        return null;
    }

    public String getHelpString(String tableName) {
        try {
            String fileName = FILE_PATH + tableName.toUpperCase() + ".md";
            File file = new ClassPathResource(fileName).getFile();
            return FileUtils.readFileToString(file, StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.error("Failed to read the file: {} {}", tableName, e.getMessage());
        } catch (Exception e) {
            log.error("An unexpected error occurred while retrieving the help string for table: {} {}", tableName, e.getMessage());
        }
        return "";
    }

    public List<String> getDeleteTables(List<String> deletes, String table) {
        List<String> finds = getDeletesFromJson(table);
        deletes.add(table);

        for (String find : finds) {
            if (!deletes.contains(find)) {
                getDeleteTables(deletes, find);
            }
        }

        return deletes;
    }

    public List<String> getLowerLevelTables(String module, String table) throws IOException {
        ProcessJson schema = readFromJsonFile();

        // The SchemaItem
        ProcessJson.Table schemaItem = Optional.ofNullable(
                        schema.getTables().parallelStream()
                                .filter(it -> it.getModule().equals(module) && it.getTable().equals(table))
                                .findFirst()
                                .orElseThrow(NoContentException::new))
                .orElse(null);

        // Lower-level tables
        List<String> result = schema.getTables().parallelStream()
                .filter(it -> it.getModule().equals(schemaItem.getModule()) &&
                        it.getLevel() > schemaItem.getLevel() &&
                        it.getLowLevelDeleteInclude().equals("Y")
                )
                .map(ProcessJson.Table::getTable)
                .collect(Collectors.toList());

//        if (result.size() == 0) {
//            throw new NoContentException();
//        }

        return result;
    }

    /* Read schema from json file */
    private ProcessJson readFromJsonFile() throws IOException {
        File file = new ClassPathResource(SCHEMA_FILE_PATH).getFile();
        String jsonData = FileUtils.readFileToString(file, StandardCharsets.UTF_8);

        return mappingProcessJson(jsonData);
    }

    private List<String> getDeletesFromJson(String tableName) {
        List<String> results = new ArrayList<>();

        try {
            String tableJSONFileName = FILE_PATH + tableName.toUpperCase() + ".json";
            File file = new ClassPathResource(tableJSONFileName).getFile();
            String tableJSONString = FileUtils.readFileToString(file, StandardCharsets.UTF_8);

            JSONObject tableJSONObject = new JSONObject(tableJSONString);
            if (tableJSONObject.get("deletes") != null) {
                JSONArray deleteArray = tableJSONObject.getJSONArray("deletes");

                for (int i=0; i < deleteArray.length(); i++) {
                    results.add(deleteArray.getString(i));
                }
            }
        } catch (IOException e) {
            log.error("Failed to read the JSON file: {}", e.getMessage());
        } catch (JSONException e) {
            log.error("Failed to parse JSON content: {}", e.getMessage());
        } catch (Exception e) {
            log.error("An unexpected error occurred: {}", e.getMessage());
        }

        return results;
    }


    /* Convert json to object */

    /* Get database query handle */
    private ImportSchemaService.DBQuery getDbQueryHandle() {
        return ImportSchemaService.DBQuery.builder().iDataSource(dataSource).build();
    }

    /* Pre check common table condition */
//    private boolean preCheckCommonCondition(ImportSchemaService.DBQuery dbQuery, ProcessJson schema) {
//        return dbQuery.select(schema.getCommon().parallelStream()
//                .collect(Collectors.toList()));
//    }

    /* Pre check parent level table condition */
    private boolean preCheckLevelCondition(ImportSchemaService.DBQuery dbQuery, ProcessJson schema, ProcessJson.Table schemaItem) {
        // Upper level tables
        List<String> upLevelTables = schema.getTables().parallelStream()
                .filter(it -> it.getModule().equals(schemaItem.getModule()) &&
                        it.getEssential().equals("Y") &&
                        it.getLevel() < schemaItem.getLevel()
                )
                .map(ProcessJson.Table::getTable)
                .collect(Collectors.toList());

        if (upLevelTables.size() > 0) {
            return dbQuery.select(upLevelTables) && preCheckTableJobStatus(upLevelTables);
        }

        return true;
    }

    /* Pre check table import job status */
    private boolean preCheckTableJobStatus(String table) {
        return importJobRepository.findAllByJobTableAndCompleteYn(table, "N").size() <= 0;
    }

    /* Pre check table import job status */
    private boolean preCheckTableJobStatus(List<String> tables) {
        AtomicBoolean result = new AtomicBoolean(true);
        tables.forEach(it -> {
            if (importJobRepository.findAllByJobTableAndCompleteYn(it, "N").size() > 0) {
                result.set(false);
            }
        });

        return result.get();
    }

    /**
     * Database query handle
     */
    @Builder
    @Data
    public static class DBQuery {
        DataSource iDataSource;
        Connection iConnection;

        public boolean select(List<String> tables) {
            Statement statement = null;
            ResultSet resultSet = null;

            try {
                for (String table : tables) {
                    statement = iConnection.createStatement();
                    resultSet = statement.executeQuery(makeSelectStatement(table));
                    resultSet.next();

                    int count = resultSet.getInt("count");
                    if (count == 0) return false;
                }
            } catch (SQLException e) {
                throw new BulkImportException(e.getMessage());
            } finally {
                try {
                    if (statement != null) {
                        statement.close();
                    }
                    if (resultSet != null) {
                        resultSet.close();
                    }
                } catch (SQLException e) {
                    log.error("Failed to close the Statement or ResultSet. \n {}", e.getMessage());
                }
            }

            return true;
        }

        public int count(String table) {
            Statement statement = null;
            ResultSet resultSet = null;

            try {
                statement = iConnection.createStatement();
                resultSet = statement.executeQuery(makeSelectStatement(StringUtils.replace(table, "'", "''")));
                resultSet.next();
                return resultSet.getInt("count");

            } catch (SQLException e) {
                throw new NoContentException();
            } finally {
                try {
                    if (statement != null) {
                        statement.close();
                    }
                    if (resultSet != null) {
                        resultSet.close();
                    }
                } catch (SQLException e) {
                    log.error("Failed to close the Statement or ResultSet. \n {}", e.getMessage());
                }
            }
        }

        public void insert() {
        }

        public void update() {
        }

        public void delete() {
        }

        public ImportSchemaService.DBQuery active() {
            if (iConnection == null) {
                try {
                    iConnection = iDataSource.getConnection();
                } catch (SQLException e) {
                    throw new NoContentException();
                }
            }

            return this;
        }

        public void finish() {
            try {
                iConnection.close();
            } catch (SQLException e) {
                log.error("Failed to close the Connection. \n {}", e.getMessage());
            }
        }

        private String makeSelectStatement(String table) {
            return "select count(*) as count from " + table;
        }
    }

    @Builder
    @Data
    public static class ResultTableItem {
        String table;
        int level;
        int step;
        boolean multiple;
        boolean essential;
        boolean imported;
        boolean enable;
        boolean importable;
        boolean lowLevelDeleteInclude;
        int dataCount;
    }

    @Builder
    @Data
    public static class ResultTableStatus {
        int count;
        boolean enable;
    }

    @Builder
    @Data
    public static class Table {
        String module;
        int level;
        int step;
        String table;
        String description;
        String langKey;
        boolean multiple;
        boolean essential;
        boolean imported;
        boolean enable;
        boolean importable;
        boolean lowLevelDeleteInclude;
        int dataCount;
    }

}
