package com.zionex.t3series.web.domain.snop.meeting;

import lombok.Data;

@Data
public class MeetingFileInfo {

    public String id; // meetingFile.id,
    public String meetId; // meetingFile.meetId,
    public String agendaId; // meetingFile.agendaId,
    public int fileStorageId; // meetingFile.fileStorageId,
    public String fileName; // fileStorage.fileName,
    public Long fileSize; // fileStorage.fileSize,
    public String fileType; // fileStorage.fileType

    public MeetingFileInfo() {

    }
}
