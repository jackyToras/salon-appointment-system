package com.utkarshhh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private String id;
    private String customerId;
    private String salonId;
    private String customerName;
    private String customerEmail;
    private List<String> serviceIds;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int totalPrice;
    private String status;
    private String paymentStatus;
}