package com.utkarshhh.controller;

import com.utkarshhh.model.Category;
import com.utkarshhh.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/category/salon-owner")
@RequiredArgsConstructor
public class SalonCategoryController {

    private final CategoryService categoryService;

    @PostMapping("/{salonId}")
    public ResponseEntity<Category> createCategory(
            @PathVariable String salonId,
            @RequestBody Category category
    ) {
        category.setSalonId(salonId);
        return ResponseEntity.ok(categoryService.saveCategory(category));
    }

    @DeleteMapping("/{salonId}/{categoryId}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable String salonId,
            @PathVariable String categoryId
    ) {
        categoryService.deleteCategory(
                categoryId,salonId);
        return ResponseEntity.ok("Category deleted successfully");
    }
}
