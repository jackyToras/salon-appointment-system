package com.utkarshhh.service;

import com.utkarshhh.model.Category;
import org.bson.types.ObjectId;

import java.util.List;

public interface CategoryService {

    Category saveCategory(Category category);

    List<Category> getCategoriesBySalonId(String salonId);

    Category getCategoryById(String categoryId);

    void deleteCategory(String categoryId, String salonId);
}
