package com.rs.www.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.rs.www.dto.CPDto;
import com.rs.www.dto.StatusDto;
import com.rs.www.dto.CategoryDTO;
import com.rs.www.model.CPModel;
import com.rs.www.model.Category;
import com.rs.www.model.Login;
import com.rs.www.model.Items;
import com.rs.www.service.CPService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/cp")
public class CPController {

    @Autowired
    private CPService service;

    @GetMapping("/check")
    public ResponseEntity<String> check() {
        return service.check();
    }

    @GetMapping("/all")
    public ResponseEntity<List<CPModel>> getAllProfiles() {
        List<CPModel> profiles = service.getAllProfiles();
        return ResponseEntity.ok(profiles);
    }

    @PostMapping("/save")
    public ResponseEntity<String> save(
            @RequestParam("counterName") String counterName,
            @RequestParam("owner") String owner,
            @RequestParam("mobileNumber") String mobileNumber,
            @RequestParam("email") String email,
            @RequestParam("image") MultipartFile image) {

        CPDto dto = new CPDto();
        dto.setCounterName(counterName);
        dto.setOwner(owner);
        dto.setMobileNumber(mobileNumber);
        dto.setEmail(email);
        dto.setImage(image);

        return service.save(dto);
    }

    @GetMapping("/fetchavailability")
    public List<StatusDto> counterStatus() {
        return service.counterStatus();
    }

    @PutMapping("/updateAvailability/{id}")
    public String updateAvailability(@PathVariable long id, @RequestParam String status) {
        return service.updateAvailability(id, status);
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<?> findById(@PathVariable long id) {
        return service.findById(id);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> update(
            @PathVariable Long id,
            @RequestParam("counterName") String counterName,
            @RequestParam("owner") String owner,
            @RequestParam("mobileNumber") String mobileNumber,
            @RequestParam("email") String email,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        CPDto dto = new CPDto();
        dto.setId(id);
        dto.setCounterName(counterName);
        dto.setOwner(owner);
        dto.setMobileNumber(mobileNumber);
        dto.setEmail(email);
        dto.setImage(image);

        return service.update(dto);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return service.delete(id);
    }

    @PostMapping("/login")
    public ResponseEntity<String> addlogin(@RequestBody Login login) {
        return service.addLogin(login);
    }

    @GetMapping("/login/{username}")
    public ResponseEntity<?> getlogin(@PathVariable String Username) {
        return service.getlogin(Username);
    }

    @GetMapping("/category")
    public ResponseEntity<?> getcategory() {
        return service.getcategory();
    }

    @PostMapping("/category/new")
    public ResponseEntity<Category> saveCategory(@RequestBody CategoryDTO categoryDTO) {
        Category savedCategory = service.saveCategory(categoryDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    @PutMapping("/category/edit/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody CategoryDTO categoryDTO) {
        Category updatedCategory = service.updateCategory(id, categoryDTO);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/category/delete/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        service.deleteCategory(id);
        return ResponseEntity.ok("Category deleted successfully");
    }

    @GetMapping("/counter/{counterId}")
    public ResponseEntity<List<Items>> getItemsByCounter(@PathVariable Long counterId) {
        List<Items> items = service.getItemsByCounter(counterId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<Items> getItemById(@PathVariable Long itemId) {
        Items item = service.getItemById(itemId);
        if (item == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(item);
    }

    @PostMapping("/item")
    public ResponseEntity<Items> saveItem(@RequestBody Items item) {
        Items savedItem = service.saveItem(item);
        return ResponseEntity.status(201).body(savedItem);
    }

    @PutMapping("/item/edit/{id}")
    public ResponseEntity<Items> updateItem(@PathVariable Long id, @RequestBody Items updatedItem) {
        Items item = service.updateItem(id, updatedItem);
        if (item == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(item);
    }
    @DeleteMapping("/item/delete/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Long id) {
        service.deleteItem(id);
        return ResponseEntity.ok("Item deleted successfully");
    }

}
