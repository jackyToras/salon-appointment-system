package com.utkarshhh.controller;

import com.utkarshhh.model.Category;
import com.utkarshhh.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/salon/{salonId}")
    public ResponseEntity<List<Category>> getCategoriesBySalon(
            @PathVariable String salonId
    ) {
        return ResponseEntity.ok(
                categoryService.getCategoriesBySalonId(salonId)
        );
    }


    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(
            @PathVariable String categoryId
    ) {
        return ResponseEntity.ok(
                categoryService.getCategoryById(categoryId)
        );
    }
}
