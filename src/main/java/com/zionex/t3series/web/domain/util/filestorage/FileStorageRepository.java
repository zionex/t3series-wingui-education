package com.zionex.t3series.web.domain.util.filestorage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface FileStorageRepository extends JpaRepository<FileStorage, Integer> {

    @Transactional
    void deleteById(Integer id);

}
