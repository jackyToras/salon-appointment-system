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
    @Id
    private ObjectId id;
    private ObjectId salonId;
    private ObjectId customerId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Set<ObjectId> serviceIds;
    private BookingStatus status = BookingStatus.PENDING;
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    private String paymentMethod;
    private int totalPrice;
}