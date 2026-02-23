package com.utkarshhh.dto;

import java.io.Serializable;

public class BookingNotificationDTO implements Serializable {
    private String bookingId;
    private String customerEmail;
    private String customerName;
    private String salonName;
    private String serviceName;
    private String startTime;
    private Integer totalPrice;

    public BookingNotificationDTO() {
    }

    public BookingNotificationDTO(String bookingId, String customerEmail, String customerName,
                                  String salonName, String serviceName, String startTime,
                                  Integer totalPrice) {
        this.bookingId = bookingId;
        this.customerEmail = customerEmail;
        this.customerName = customerName;
        this.salonName = salonName;
        this.serviceName = serviceName;
        this.startTime = startTime;
        this.totalPrice = totalPrice;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getSalonName() {
        return salonName;
    }

    public void setSalonName(String salonName) {
        this.salonName = salonName;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public Integer getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Integer totalPrice) {
        this.totalPrice = totalPrice;
    }
}