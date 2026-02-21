package com.WTFCapestone.Capestone.service;


import com.WTFCapestone.Capestone.entity.StoredFile;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    StoredFile store(MultipartFile file);

    StoredFile getFile(Long id);

//    String uploadImage(MultipartFile file);
//
//    void deleteFile(String fileUrl);
//
//    /* ===== CHANGE: support document uploads ===== */
//    String uploadDocument(MultipartFile file);
//    void validateImage(MultipartFile file);

}
