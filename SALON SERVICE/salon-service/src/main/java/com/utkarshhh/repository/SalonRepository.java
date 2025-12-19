package com.utkarshhh.repository;

import com.utkarshhh.modal.Salon;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface SalonRepository extends MongoRepository<Salon, ObjectId> {

    Salon findByOwnerId(Long ownerId);

    @Query("{ '$or': [ " +
            " { 'city': { $regex: ?0, $options: 'i' } }, " +
            " { 'name': { $regex: ?0, $options: 'i' } }, " +
            " { 'address': { $regex: ?0, $options: 'i' } } " +
            "] }")
    List<Salon> searchSalons(String keyword);
}
