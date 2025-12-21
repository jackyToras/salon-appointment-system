package com.utkarshhh.dto;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

@Data
public class ServiceDTO {
    @Id
    private ObjectId id;
    private String name;
    private String description;
    private int price;
    private int duration;
    private ObjectId salonId;
    private ObjectId categoryId;
    private String image;
}