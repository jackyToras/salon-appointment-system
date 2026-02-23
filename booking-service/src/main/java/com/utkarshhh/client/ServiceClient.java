package com.utkarshhh.client;

import com.utkarshhh.dto.ServiceDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import java.util.Set;
import org.bson.types.ObjectId;

@FeignClient(name = "SERVICE-OFFERING")
public interface ServiceClient {

    @GetMapping("/api/service-offering/{id}")
    ServiceDTO getService(@PathVariable("id") String id);

    @GetMapping("/api/service-offering/salon/{salonId}")
    Set<ServiceDTO> getServicesBySalon(@PathVariable("salonId") String salonId,
                                       @RequestParam(required = false) String categoryId);

    @GetMapping("/api/service-offering/ids")
    List<ServiceDTO> getServicesByIds(@RequestParam Set<String> ids);
}