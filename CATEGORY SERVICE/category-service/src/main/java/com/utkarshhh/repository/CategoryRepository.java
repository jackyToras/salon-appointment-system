package com.utkarshhh.repository;

import com.utkarshhh.model.Category;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends MongoRepository<Category, String> {

    List<Category> findBySalonId(String salonId);

    Optional<Category> findByIdAndSalonId(String id, String salonId);
}
