package com.utkarshhh.repository;

import com.utkarshhh.model.ServiceOffering;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ServiceOfferingRepository extends MongoRepository<ServiceOffering, ObjectId> {
}