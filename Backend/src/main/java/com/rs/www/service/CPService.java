package com.rs.www.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import com.rs.www.dto.CategoryDTO;
import com.rs.www.dto.CPDto;
import com.rs.www.dto.StatusDto;
import com.rs.www.model.Category;
import com.rs.www.model.CPModel;
import com.rs.www.model.Items;
import com.rs.www.model.Login;
import com.rs.www.repo.CategoryRepo;
import com.rs.www.repo.CPRepo;
import com.rs.www.repo.ItemsRepo;
import com.rs.www.repo.LoginRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CPService {

    @Autowired
    private CPRepo repo;

    @Autowired
    private LoginRepo loginrepo;

    @Autowired
    private CategoryRepo categoryrepo;

    @Autowired
    private ItemsRepo itemsRepo;

    @Value("${app.upload.dir:${user.dir}/uploads}")
    private String uploadDir;

    @Value("${app.image.base.url:http://localhost:9096/uploads/}")
    private String imageBaseUrl;

    public List<StatusDto> counterStatus() {
        List<CPModel> counters = repo.findAll();
        return counters.stream()
                .map(counter -> new StatusDto(counter.getCounterName(), counter.getStatus()))
                .collect(Collectors.toList());
    }

    public ResponseEntity<String> check() {
        return ResponseEntity.status(HttpStatus.OK).body("API is working!");
    }

    public List<CPModel> getAllProfiles() {
        return repo.findAll();
    }

    // Store file in uploads folder and return the unique generated filename
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

    public String updateAvailability(long id, String status) {
        Optional<CPModel> counter = repo.findById(id);
        if (counter.isPresent()) {
            CPModel counterDetails = counter.get();
            counterDetails.setStatus(status);
            repo.save(counterDetails);
            return "counter is " + status;
        }
        return "counter not found";
    }

    public ResponseEntity<String> addLogin(Login login) {
        Login log = loginrepo.findByUsername(login.getUsername());
        if (log != null) {
            if (log.getPassword().equals(login.getPassword())) {
                return ResponseEntity.status(200).body("Access Granted");
            } else {
                return ResponseEntity.status(403).body("Password not matched..!");
            }
        } else {
            return ResponseEntity.status(404).body("Wrong username or not registered");
        }
    }

    public ResponseEntity<?> getlogin(String username) {
        Login login = loginrepo.findByUsername(username);
        return ResponseEntity.status(200).body(login);
    }

    public ResponseEntity<?> getcategory() {
        List<Category> category = categoryrepo.findAll();
        return ResponseEntity.status(200).body(category);
    }

    public List<Items> getItemsByCounter(Long counterId) {
        return itemsRepo.findByCounterId(counterId);
    }

    public Items getItemById(Long itemId) {
        return itemsRepo.findById(itemId).orElse(null);
    }

    public Items saveItem(Items item) {
        return itemsRepo.save(item);
    }

    public Items updateItem(Long id, Items updatedItem) {
        Items existingItem = itemsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        existingItem.setName(updatedItem.getName());
        existingItem.setPrice(updatedItem.getPrice());
        existingItem.setStatus(updatedItem.getStatus());
        existingItem.setQuantity(updatedItem.getQuantity());
        existingItem.setCategory(updatedItem.getCategory());
        existingItem.setCounter(updatedItem.getCounter());
        return itemsRepo.save(existingItem);
    }


    public void deleteItem(Long id) {
        Items item = itemsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        itemsRepo.delete(item);
    }

    public Category saveCategory(CategoryDTO categoryDTO) {
        CPModel counter = repo.findById(categoryDTO.getCounterId())
                .orElseThrow(() -> new RuntimeException("Counter not found"));
        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setCounter(counter);
        return categoryrepo.save(category);
    }

    public Category updateCategory(Long id, CategoryDTO categoryDTO) {
        Category existingCategory = categoryrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        existingCategory.setName(categoryDTO.getName());
        if (categoryDTO.getCounterId() != null) {
            CPModel counter = repo.findById(categoryDTO.getCounterId())
                    .orElseThrow(() -> new RuntimeException("Counter not found"));
            existingCategory.setCounter(counter);
        }
        return categoryrepo.save(existingCategory);
    }

    public void deleteCategory(Long id) {
        Category category = categoryrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        List<Items> itemsInCategory = itemsRepo.findByCategoryId(category.getId());
        if (itemsInCategory != null && !itemsInCategory.isEmpty()) {
            throw new RuntimeException("Cannot delete category: Items associated with this category exist. Please remove them first.");
        }
        categoryrepo.delete(category);
    }
}
