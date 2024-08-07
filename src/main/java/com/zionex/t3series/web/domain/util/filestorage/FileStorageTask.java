package com.zionex.t3series.web.domain.util.filestorage;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.zionex.t3series.ApplicationProperties;

@Component
public class FileStorageTask {

    private final ApplicationProperties.Service.File fileProps;

    public FileStorageTask(ApplicationProperties applicationProperties) {
        this.fileProps = applicationProperties.getService().getFile();
    }

    @Scheduled(fixedRateString = "${app.service.file.temporary-clean-fixed-rate}")
    public void cleanTemporaryCategory() throws IOException {
        final String rootPath = fileProps.getExternalPath();

        File temporaryLocation = new File(rootPath + fileProps.getCategory().getTemporary());

        if (temporaryLocation.exists())
            FileUtils.cleanDirectory(temporaryLocation);
    }

}
