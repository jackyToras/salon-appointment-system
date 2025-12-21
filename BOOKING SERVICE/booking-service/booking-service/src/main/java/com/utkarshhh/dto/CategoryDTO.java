package com.utkarshhh.dto;

import lombok.Data;
import org.bson.types.ObjectId;

@Data
public class CategoryDTO {
    private ObjectId id;
    private String name;
    private String image;
}