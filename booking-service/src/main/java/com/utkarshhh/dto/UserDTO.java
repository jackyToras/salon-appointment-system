package com.utkarshhh.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

@Data
public class UserDTO {
    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private String id;
    private String fullName;
    private String email;
}