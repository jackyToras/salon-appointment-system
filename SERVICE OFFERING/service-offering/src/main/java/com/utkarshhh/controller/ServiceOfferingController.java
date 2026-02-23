package com.utkarshhh.controller;

import com.utkarshhh.model.ServiceOffering;
import com.utkarshhh.service.ServiceOfferingService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/service-offering")
public class ServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;

    @GetMapping("/salon/{salonId}")
    public ResponseEntity<Set<ServiceOffering>> getServicesBySalonId(
            @PathVariable String salonId,
            @RequestParam(required = false) ObjectId categoryId
    ) {
        return ResponseEntity.ok(
                serviceOfferingService.getAllServiceBySalon(salonId, String.valueOf(categoryId))
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceOffering> getServiceById(
            @PathVariable ObjectId id
    ) throws Exception {
        return ResponseEntity.ok(serviceOfferingService.getServiceById(String.valueOf(id)));
    }

    @GetMapping("/ids")
    public ResponseEntity<List<ServiceOffering>> getServicesByIds(
            @RequestParam Set<String> ids
    ) {
        return ResponseEntity.ok(serviceOfferingService.getServicesByIds(ids));
    }
}
