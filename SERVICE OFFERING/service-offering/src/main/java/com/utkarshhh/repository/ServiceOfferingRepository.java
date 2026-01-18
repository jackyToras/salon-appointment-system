package com.utkarshhh.repository;

import com.utkarshhh.model.ServiceOffering;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;
@Repository
public interface ServiceOfferingRepository extends MongoRepository<ServiceOffering, String > {
    Set<ServiceOffering> findBySalonId(String  salonId);
}
