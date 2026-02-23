package com.utkarshhh.client;

import com.utkarshhh.dto.SalonDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "SALON-SERVICE")
public interface SalonClient {

    @GetMapping("/api/salons/{id}")
    SalonDTO getSalon(@PathVariable("id") String id);
}