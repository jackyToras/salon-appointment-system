package com.utkarshhh.service.Impl;

import com.utkarshhh.dto.SalonDTO;
import com.utkarshhh.mapper.SalonMapper;
import com.utkarshhh.model.Salon;
import com.utkarshhh.repository.SalonRepository;
import com.utkarshhh.service.SalonService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SalonServiceImpl implements SalonService {

    private final SalonRepository salonRepository;

    @Override
    public SalonDTO getSalonById(String salonId) throws Exception {
        Salon salon = salonRepository.findById(salonId)
                .orElseThrow(() -> new Exception("Salon not found with id: " + salonId));
        return SalonMapper.toDTO(salon);
    }
}