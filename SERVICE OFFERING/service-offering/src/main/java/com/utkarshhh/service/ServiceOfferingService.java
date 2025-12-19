package com.utkarshhh.service;

import com.utkarshhh.dto.CategoryDTO;
import com.utkarshhh.dto.SalonDTO;
import com.utkarshhh.dto.ServiceDTO;
import com.utkarshhh.model.ServiceOffering;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Set;

public interface ServiceOfferingService {

    ServiceOffering createService(
            SalonDTO salonDTO,
            ServiceDTO serviceDTO,
            CategoryDTO categoryDTO
    );

    ServiceOffering updateService(
            ObjectId serviceId,
            ServiceOffering serviceOffering
    ) throws Exception;

    Set<ServiceOffering> getAllServiceBySalon(
            ObjectId salonId,
            ObjectId categoryId
    );

    List<ServiceOffering> getServicesByIds(Set<ObjectId> ids);

    ServiceOffering getServiceById(ObjectId id) throws Exception;
}
