package com.utkarshhh.model;

import lombok.Data;
import org.bson.types.ObjectId;

@Data
public class SalonReport {
    private String salonId;
    private String salonName;
    private double totalEarnings;
    private Integer totalBooking;
    private Integer cancelledBooking;
    private double totalRefund;
}