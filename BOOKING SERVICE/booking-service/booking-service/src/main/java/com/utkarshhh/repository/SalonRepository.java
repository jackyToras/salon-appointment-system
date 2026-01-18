package com.utkarshhh.repository;

import com.utkarshhh.model.Salon;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SalonRepository extends MongoRepository<Salon, String> {
}