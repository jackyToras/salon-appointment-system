package com.utkarshhh.service;

import com.utkarshhh.dto.SalonDTO;
import org.bson.types.ObjectId;

public interface SalonService {
    SalonDTO getSalonById(String salonId) throws Exception;
}