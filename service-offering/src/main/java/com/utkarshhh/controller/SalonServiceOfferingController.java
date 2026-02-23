package com.utkarshhh.controller;

import com.utkarshhh.dto.CategoryDTO;
import com.utkarshhh.dto.SalonDTO;
import com.utkarshhh.dto.ServiceDTO;
import com.utkarshhh.model.ServiceOffering;
import com.utkarshhh.service.ServiceOfferingService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/service-offering/salon-owner")
public class SalonServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;

    @PostMapping
    public ResponseEntity<Set<ServiceOffering>> createService(
            @RequestBody ServiceDTO serviceDTO
    ) {

        SalonDTO salonDTO = new SalonDTO();
        salonDTO.setId(serviceDTO.getSalonId());

        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setId(serviceDTO.getCategoryId());

        ServiceOffering serviceOffering =
                serviceOfferingService.createService(salonDTO, serviceDTO, categoryDTO);

        return ResponseEntity.ok(Collections.singleton(serviceOffering));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Set<ServiceOffering>> updateService(
            @PathVariable ObjectId id,
            @RequestBody ServiceOffering serviceOffering
    ) throws Exception {

        ServiceOffering updated =
                serviceOfferingService.updateService(String.valueOf(id), serviceOffering);

        return ResponseEntity.ok(Collections.singleton(updated));
    }
}
