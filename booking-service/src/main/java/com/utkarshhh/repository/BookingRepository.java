package com.utkarshhh.repository;

import com.utkarshhh.model.Booking;
import com.utkarshhh.model.SalonReport;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByCustomerId(String customerId);
    List<Booking> findBySalonId(String salonId);
}