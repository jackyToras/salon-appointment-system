package com.utkarshhh.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDTO {
    private String id;
    private String name;
    private String description;
    private int price;
    private int duration;
    private String salonId;
    private String categoryId;
    private String image;
}