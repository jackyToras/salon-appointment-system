package com.utkarshhh.dto;

import com.utkarshhh.domain.BookingStatus;
import com.utkarshhh.domain.PaymentStatus;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class BookingDTO {

    private String id;
    private String salonId;
    private String customerId;
    private String customerName;
    private String customerEmail;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Set<String> serviceIds;
    private BookingStatus status = BookingStatus.PENDING;
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    private String paymentMethod;
    private int totalPrice;
}