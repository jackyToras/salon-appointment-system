package com.utkarshhh.mapper;

import com.utkarshhh.dto.SalonDTO;
import com.utkarshhh.model.Salon;

import java.util.Collections;

public class SalonMapper {

    public static SalonDTO toDTO(Salon salon) {
        if (salon == null) {
            return null;
        }

        SalonDTO salonDTO = new SalonDTO();
        salonDTO.setId(salon.getId());
        salonDTO.setName(salon.getName());
        salonDTO.setImages(Collections.singletonList(String.valueOf(salon.getImages())));
        salonDTO.setAddress(salon.getAddress());
        salonDTO.setPhoneNumber(salon.getPhoneNumber());
        salonDTO.setEmail(salon.getEmail());
        salonDTO.setCity(salon.getCity());
        salonDTO.setOpenTime(salon.getOpenTime());
        salonDTO.setCloseTime(salon.getCloseTime());

        return salonDTO;
    }

    public static Salon toEntity(SalonDTO salonDTO) {
        if (salonDTO == null) {
            return null;
        }

        Salon salon = new Salon();
        salon.setId(salonDTO.getId());
        salon.setName(salonDTO.getName());
        salon.setImages(Collections.singletonList(String.valueOf(salonDTO.getImages())));
        salon.setAddress(salonDTO.getAddress());
        salon.setPhoneNumber(salonDTO.getPhoneNumber());
        salon.setEmail(salonDTO.getEmail());
        salon.setCity(salonDTO.getCity());
        salon.setOpenTime(salonDTO.getOpenTime());
        salon.setCloseTime(salonDTO.getCloseTime());

        return salon;
    }
}