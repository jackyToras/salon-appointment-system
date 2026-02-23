package com.utkarshhh.service.Impl;

import com.utkarshhh.dto.ServiceDTO;
import com.utkarshhh.mapper.ServiceMapper;
import com.utkarshhh.model.ServiceOffering;
import com.utkarshhh.repository.ServiceOfferingRepository;
import com.utkarshhh.service.ServiceOfferingService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ServiceOfferingServiceImpl implements ServiceOfferingService {

    private final ServiceOfferingRepository serviceOfferingRepository;

    @Override
    public ServiceDTO getServiceById(String serviceId) throws Exception {
        ServiceOffering serviceOffering = serviceOfferingRepository.findById(serviceId)
                .orElseThrow(() -> new Exception("Service not found with id: " + serviceId));
        return ServiceMapper.toDTO(serviceOffering);
    }
}