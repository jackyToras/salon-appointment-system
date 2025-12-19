package com.utkarshhh.model;

import com.mongodb.lang.NonNull;
import jakarta.websocket.OnClose;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "offering")
@Data
public class ServiceOffering {

    @Id
    private ObjectId id;

    @NonNull
    private String name;

    @NonNull
    private String description;

    @NonNull
    private int price;

    @NonNull
    private int duration;

    @NonNull
    private ObjectId salonId;

    @NonNull
    private ObjectId categoryId;

    private String image;

    public ServiceOffering() {

    }
}
