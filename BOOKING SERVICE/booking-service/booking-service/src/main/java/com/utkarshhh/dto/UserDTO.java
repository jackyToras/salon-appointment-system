package com.utkarshhh.dto;

import lombok.Data;
import org.bson.types.ObjectId;

@Data
public class UserDTO {
    private ObjectId id;
    private String fullName;
    private String email;
}