// src/main/java/com/rs/www/service/CPService.java
package com.rs.www.service;

import com.rs.www.dto.CPDto;
import com.rs.www.model.CPModel;
import com.rs.www.repo.CPRepo;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CPService {

    @Autowired
    private CPRepo repo;

    // Load the upload directory and base URL from properties (with defaults)
    @Value("${app.upload.dir:${user.dir}/uploads}")
    private String uploadDir;

    @Value("${app.image.base.url:http://localhost:9096/uploads/}")
    private String imageBaseUrl;

    public ResponseEntity<String> check() {
         return ResponseEntity.status(HttpStatus.OK).body("API is working!");
    }

    public List<CPModel> getAllProfiles() {
         return repo.findAll();
    }

    // Helper method: store the file with a unique name and return that name.
    private String storeFile(MultipartFile file) throws IOException {
         Files.createDirectories(Paths.get(uploadDir));
         String fileExtension = "";
         String originalFilename = file.getOriginalFilename();
         if (originalFilename != null && originalFilename.contains(".")) {
              fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
         }
         String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
         String filePath = uploadDir + File.separator + uniqueFileName;
         file.transferTo(new File(filePath));
         return uniqueFileName;
    }

    public ResponseEntity<String> save(CPDto dto) {
         CPModel model = new CPModel();
         model.setCounterName(dto.getCounterName());
         model.setOwner(dto.getOwner());
         model.setEmail(dto.getEmail());
         model.setMobileNumber(dto.getMobileNumber());

         MultipartFile file = dto.getImage();
         if (file != null && !file.isEmpty()) {
              try {
                  String uniqueFileName = storeFile(file);
                  model.setImage(uniqueFileName);
              } catch (IOException e) {
                  return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error saving image: " + e.getMessage());
              }
         }
         repo.save(model);
         return ResponseEntity.status(HttpStatus.CREATED).body("Data saved successfully");
    }

    public ResponseEntity<?> findById(long id) {
         Optional<CPModel> optional = repo.findById(id);
         if (optional.isEmpty()) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Data not present");
         } else {
             CPModel existing = optional.get();
             CPDto dto = new CPDto();
             dto.setId(existing.getId());
             dto.setCounterName(existing.getCounterName());
             dto.setOwner(existing.getOwner());
             dto.setEmail(existing.getEmail());
             dto.setMobileNumber(existing.getMobileNumber());
             if (existing.getImage() != null) {
                  dto.setImageUrl(imageBaseUrl + existing.getImage());
             }
             return ResponseEntity.status(HttpStatus.OK).body(dto);
         }
    }

    public ResponseEntity<String> update(CPDto dto) {
         Optional<CPModel> optional = repo.findById(dto.getId());
         if (optional.isEmpty()) {
              return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
         }
         CPModel model = optional.get();
         model.setCounterName(dto.getCounterName());
         model.setOwner(dto.getOwner());
         model.setEmail(dto.getEmail());
         model.setMobileNumber(dto.getMobileNumber());
         
         MultipartFile file = dto.getImage();
         if (file != null && !file.isEmpty()) {
            try {
               String uniqueFileName = storeFile(file);
               model.setImage(uniqueFileName);
            } catch (IOException e) {
               return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                      .body("Error updating image: " + e.getMessage());
            }
         }
         repo.save(model);
         return ResponseEntity.status(HttpStatus.OK).body("Profile updated successfully");
    }

    public ResponseEntity<String> delete(Long id) {
         Optional<CPModel> optional = repo.findById(id);
         if (optional.isEmpty()) {
              return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
         }
         CPModel model = optional.get();
         // Delete the image file from disk if it exists.
         if (model.getImage() != null) {
              String imagePath = uploadDir + File.separator + model.getImage();
              File file = new File(imagePath);
              if (file.exists()) {
                 file.delete();
              }
         }
         repo.delete(model);
         return ResponseEntity.status(HttpStatus.OK).body("Profile deleted successfully");
    }
}
