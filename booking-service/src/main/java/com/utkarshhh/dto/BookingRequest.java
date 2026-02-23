package com.utkarshhh.dto;
import lombok.Data;
import org.bson.types.ObjectId;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class BookingRequest {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Set<String> serviceIds;
    private String paymentMethod;
    private String salonId;
}