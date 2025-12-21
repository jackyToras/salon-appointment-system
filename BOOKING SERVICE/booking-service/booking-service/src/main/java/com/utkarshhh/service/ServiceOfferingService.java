package com.utkarshhh.service;

import com.utkarshhh.dto.ServiceDTO;
import org.bson.types.ObjectId;

public interface ServiceOfferingService {
    ServiceDTO getServiceById(ObjectId serviceId) throws Exception;
}