
package com.zionex.t3series.web.domain.util.bulkinsert;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProcessJson {

    @JsonProperty("TABLES")
    List<Table> tables;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Table {

        String module;
        int level;
        int step;

        String type;
        String table;
        String langKey;

        String multiple;
        String essential;
        String importable;
        String lowLevelDeleteInclude;
        String url;

        int dataCount;

    }

}
