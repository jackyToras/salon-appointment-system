package com.utkarshhh.service.Impl;

import com.utkarshhh.dto.CategoryDTO;
import com.utkarshhh.dto.SalonDTO;
import com.utkarshhh.dto.ServiceDTO;
import com.utkarshhh.model.ServiceOffering;
import com.utkarshhh.repository.ServiceOfferingRepository;
import com.utkarshhh.service.ServiceOfferingService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceOfferingServiceImpl implements ServiceOfferingService {

    private final ServiceOfferingRepository serviceOfferingRepository;

    @Override
    public ServiceOffering createService(
            SalonDTO salonDTO,
            ServiceDTO serviceDTO,
            CategoryDTO categoryDTO
    ) {
        ServiceOffering serviceOffering = new ServiceOffering();
        serviceOffering.setName(serviceDTO.getName());
        serviceOffering.setDescription(serviceDTO.getDescription());
        serviceOffering.setPrice(serviceDTO.getPrice());
        serviceOffering.setDuration(serviceDTO.getDuration());
        serviceOffering.setImage(serviceDTO.getImage());
        serviceOffering.setSalonId(salonDTO.getId());
        serviceOffering.setCategoryId(categoryDTO.getId());

        return serviceOfferingRepository.save(serviceOffering);
    }

    @Override
    public ServiceOffering updateService(
            ObjectId serviceId,
            ServiceOffering input
    ) throws Exception {

        ServiceOffering existing =
                serviceOfferingRepository.findById(serviceId)
                        .orElseThrow(() ->
                                new Exception("Service not exist with id " + serviceId));

        existing.setName(input.getName());
        existing.setDescription(input.getDescription());
        existing.setPrice(input.getPrice());
        existing.setDuration(input.getDuration());
        existing.setImage(input.getImage());

        return serviceOfferingRepository.save(existing);
    }

    @Override
    public Set<ServiceOffering> getAllServiceBySalon(
            ObjectId salonId,
            ObjectId categoryId
    ) {
        Set<ServiceOffering> services =
                serviceOfferingRepository.findBySalonId(salonId);

        if (categoryId != null) {
            services = services.stream()
                    .filter(s -> categoryId.equals(s.getCategoryId()))
                    .collect(Collectors.toSet());
        }
        return services;
    }

    @Override
    public List<ServiceOffering> getServicesByIds(Set<ObjectId> ids) {
        return serviceOfferingRepository.findAllById(ids);
    }

    @Override
    public ServiceOffering getServiceById(ObjectId id) throws Exception {
        return serviceOfferingRepository.findById(id)
                .orElseThrow(() ->
                        new Exception("Service not exist with id " + id));
    }
}
