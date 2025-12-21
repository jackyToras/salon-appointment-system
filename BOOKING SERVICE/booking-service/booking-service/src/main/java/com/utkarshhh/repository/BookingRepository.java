package com.utkarshhh.repository;

import com.utkarshhh.model.Booking;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, ObjectId> {
    List<Booking> findByCustomerId(ObjectId customerId);
    List<Booking> findBySalonId(ObjectId salonId);
}