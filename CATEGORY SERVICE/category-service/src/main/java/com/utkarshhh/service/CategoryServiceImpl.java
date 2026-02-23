package com.utkarshhh.service;

import com.utkarshhh.model.Category;
import com.utkarshhh.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getCategoriesBySalonId(String salonId) {
        return categoryRepository.findBySalonId(salonId);
    }

    @Override
    public Category getCategoryById(String categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Override
    public void deleteCategory(String categoryId, String salonId) {
        Category category = categoryRepository
                .findByIdAndSalonId(categoryId, salonId)
                .orElseThrow(() -> new RuntimeException("Category not found or unauthorized"));

        categoryRepository.delete(category);
    }
}
