package com.utkarshhh.mapper;

import com.utkarshhh.dto.BookingDTO;
import com.utkarshhh.model.Booking;

public class BookingMapper {

    public static BookingDTO toDTO(Booking booking) {
        if (booking == null) {
            return null;
        }

        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setId(booking.getId());
        bookingDTO.setSalonId(booking.getSalonId());
        bookingDTO.setCustomerId(booking.getCustomerId());
        bookingDTO.setCustomerName(booking.getCustomerName());
        bookingDTO.setCustomerEmail(booking.getCustomerEmail());
        bookingDTO.setStartTime(booking.getStartTime());
        bookingDTO.setEndTime(booking.getEndTime());
        bookingDTO.setServiceIds(booking.getServiceIds());
        bookingDTO.setStatus(booking.getStatus());
        bookingDTO.setPaymentStatus(booking.getPaymentStatus());
        bookingDTO.setPaymentMethod(booking.getPaymentMethod());
        bookingDTO.setTotalPrice(booking.getTotalPrice());

        return bookingDTO;
    }

    public static Booking toEntity(BookingDTO bookingDTO) {
        if (bookingDTO == null) {
            return null;
        }

        Booking booking = new Booking();
        booking.setId(bookingDTO.getId());
        booking.setSalonId(bookingDTO.getSalonId());
        booking.setCustomerId(bookingDTO.getCustomerId());
        booking.setCustomerName(bookingDTO.getCustomerName());
        booking.setCustomerEmail(bookingDTO.getCustomerEmail());
        booking.setStartTime(bookingDTO.getStartTime());
        booking.setEndTime(bookingDTO.getEndTime());
        booking.setServiceIds(bookingDTO.getServiceIds());
        booking.setStatus(bookingDTO.getStatus());
        booking.setPaymentStatus(bookingDTO.getPaymentStatus());
        booking.setPaymentMethod(bookingDTO.getPaymentMethod());
        booking.setTotalPrice(bookingDTO.getTotalPrice());

        return booking;
    }

}