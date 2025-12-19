package com.utkarshhh.service;

import com.utkarshhh.modal.Salon;
import com.utkarshhh.payload.dto.SalonDTO;
import com.utkarshhh.payload.dto.UserDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface SalonService {

    Salon createSalon(SalonDTO salonDTO, UserDTO userDTO);

    Salon updateSalon(SalonDTO salonDTO, UserDTO userDTO, ObjectId salonId) throws Exception;

    List<Salon> getAllSalons();

    Salon getSalonById(ObjectId salonId) throws Exception;

    Salon getSalonByOwnerId(Long ownerId);

    List<Salon> searchSalons(String keyword);
}
