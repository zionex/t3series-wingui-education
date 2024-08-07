
package com.zionex.t3series.web.domain.util.bulkinsert;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ModuleJson {

    @JsonProperty("MODULES")
    List<Module> modules;

    @Data
    public static class Module {

        int seq;
        String moduleCd;
        String langKey;
        List<Level> levels;

        @Data
        public static class Level {
            int level;
            String langKey;

            List<ProcessJson.Table> tables;
        }
    }

}
