package com.utkarshhh.model;

import com.utkarshhh.domain.BookingStatus;
import com.utkarshhh.domain.PaymentStatus;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Document(collection = "booking")
public class Booking {
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