package com.utkarshhh.mapper;

import com.utkarshhh.dto.ServiceDTO;
import com.utkarshhh.model.ServiceOffering;

public class ServiceMapper {

    public static ServiceDTO toDTO(ServiceOffering serviceOffering) {
        if (serviceOffering == null) {
            return null;
        }

        ServiceDTO serviceDTO = new ServiceDTO();
        serviceDTO.setId(serviceOffering.getId());
        serviceDTO.setName(serviceOffering.getName());
        serviceDTO.setDescription(serviceOffering.getDescription());
        serviceDTO.setPrice(serviceOffering.getPrice());
        serviceDTO.setDuration(serviceOffering.getDuration());
        serviceDTO.setSalonId(serviceOffering.getSalonId());
        serviceDTO.setCategoryId(serviceOffering.getCategoryId());
        serviceDTO.setImage(serviceOffering.getImage());

        return serviceDTO;
    }

    public static ServiceOffering toEntity(ServiceDTO serviceDTO) {
        if (serviceDTO == null) {
            return null;
        }

        ServiceOffering serviceOffering = new ServiceOffering();
        serviceOffering.setId(serviceDTO.getId());
        serviceOffering.setName(serviceDTO.getName());
        serviceOffering.setDescription(serviceDTO.getDescription());
        serviceOffering.setPrice(serviceDTO.getPrice());
        serviceOffering.setDuration(serviceDTO.getDuration());
        serviceOffering.setSalonId(serviceDTO.getSalonId());
        serviceOffering.setCategoryId(serviceDTO.getCategoryId());
        serviceOffering.setImage(serviceDTO.getImage());

        return serviceOffering;
    }
}