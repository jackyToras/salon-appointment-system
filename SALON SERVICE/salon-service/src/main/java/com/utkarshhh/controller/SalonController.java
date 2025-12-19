package com.utkarshhh.controller;

import com.utkarshhh.mapper.SalonMapper;
import com.utkarshhh.modal.Salon;
import com.utkarshhh.payload.dto.SalonDTO;
import com.utkarshhh.payload.dto.UserDTO;
import com.utkarshhh.service.SalonService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/salons")
@RequiredArgsConstructor
public class SalonController {

    private final SalonService salonService;

    @PostMapping
    public ResponseEntity<SalonDTO> createSalon(@RequestBody SalonDTO salonDTO) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);

        Salon salon = salonService.createSalon(salonDTO, userDTO);
        return ResponseEntity.ok(SalonMapper.mapToDTO(salon));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SalonDTO> updateSalon(
            @PathVariable ObjectId id,
            @RequestBody SalonDTO salonDTO) throws Exception {

        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);

        Salon salon = salonService.updateSalon(salonDTO, userDTO, id);
        return ResponseEntity.ok(SalonMapper.mapToDTO(salon));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalonDTO> getSalonById(@PathVariable ObjectId id) throws Exception {
        Salon salon = salonService.getSalonById(id);
        return ResponseEntity.ok(SalonMapper.mapToDTO(salon));
    }

    @GetMapping
    public ResponseEntity<List<SalonDTO>> getAllSalons() {
        List<SalonDTO> salons = salonService.getAllSalons()
                .stream()
                .map(SalonMapper::mapToDTO)
                .toList();

        return ResponseEntity.ok(salons);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SalonDTO>> searchSalons(
            @RequestParam String keyword
    ) {
        List<SalonDTO> salons = salonService.searchSalons(keyword)
                .stream()
                .map(SalonMapper::mapToDTO)
                .toList();

        return ResponseEntity.ok(salons);
    }


    @GetMapping("/owner")
    public ResponseEntity<SalonDTO> getSalonByOwner() {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);

        Salon salon = salonService.getSalonByOwnerId(userDTO.getId());
        return ResponseEntity.ok(SalonMapper.mapToDTO(salon));
    }
}
