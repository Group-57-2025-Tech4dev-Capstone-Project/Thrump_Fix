package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.entity.StoredFile;
import com.WTFCapestone.Capestone.exception.BadRequestException;
import com.WTFCapestone.Capestone.exception.ResourceNotFoundException;
import com.WTFCapestone.Capestone.repository.StoredFileRepository;
import com.WTFCapestone.Capestone.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Autowired
    private StoredFileRepository repository;

//    public FileStorageServiceImpl(StoredFileRepository repository) {
//        this.repository = repository;
//    }

    @Override
    public StoredFile store(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File must not be empty");
        }

        try {
            StoredFile storedFile = StoredFile.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .data(file.getBytes())
                    .build();

            return repository.save(storedFile);

        } catch (Exception e) {
            throw new BadRequestException("Failed to store file");
        }
    }

    @Override
    public StoredFile getFile(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));
    }
}
