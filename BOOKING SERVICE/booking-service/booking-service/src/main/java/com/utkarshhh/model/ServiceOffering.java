package com.utkarshhh.model;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "offering")
public class ServiceOffering {

    private String id;
    private String name;
    private String description;
    private int price;
    private int duration;
    private String salonId;
    private String categoryId;
    private String image;
}