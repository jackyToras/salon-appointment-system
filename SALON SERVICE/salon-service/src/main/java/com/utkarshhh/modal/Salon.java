package com.utkarshhh.modal;


import com.mongodb.lang.NonNull;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Document(collection = "salon")
@Data
public class Salon {

    @Id
    private ObjectId id;
    @NonNull
    private String name;

    private List<String> images;

    @NonNull
    private String address;

    @NonNull
    private String phoneNumber;

    @NonNull
    private String email;

    @NonNull
    private String city;

    private Long ownerId;
    @NonNull
    private LocalTime openTime;
    @NonNull
    private LocalTime closeTime;

    public Salon() {

    }
}
