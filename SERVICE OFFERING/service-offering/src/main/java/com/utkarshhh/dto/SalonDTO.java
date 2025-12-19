package com.utkarshhh.dto;

import lombok.Data;
import org.bson.types.ObjectId;

import java.time.LocalTime;
import java.util.List;
@Data
public class SalonDTO {

    private ObjectId id;

    private String name;

    private List<String> images;

    private String address;

    private String phoneNumber;

    private String email;

    private String city;

    private Long ownerId;

    private LocalTime openTime;

    private LocalTime closeTime;
}
