package com.utkarshhh.mapper;

import com.utkarshhh.dto.UserDTO;

public class UserMapper {

    public static UserDTO toDTO(UserDTO user) {
        if (user == null) return null;
        
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        return dto;
    }

    public static UserDTO toEntity(UserDTO dto) {
        if (dto == null) return null;
        
        UserDTO user = new UserDTO();
        user.setId(dto.getId());
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        return user;
    }
}