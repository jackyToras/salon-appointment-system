package com.utkarshhh.dto;

import lombok.Data;
import org.bson.types.ObjectId;

@Data
public class CategoryDTO {
    private String  id;
    private String name;
    private String image;
}
