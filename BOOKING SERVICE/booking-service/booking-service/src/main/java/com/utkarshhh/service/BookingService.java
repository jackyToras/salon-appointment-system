package com.utkarshhh.service;

import com.utkarshhh.domain.BookingStatus;
import com.utkarshhh.dto.SalonDTO;
import com.utkarshhh.dto.ServiceDTO;
import com.utkarshhh.dto.UserDTO;
import com.utkarshhh.model.Booking;
import com.utkarshhh.model.SalonReport;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public interface BookingService {

    Booking createBooking(Booking booking,
                          UserDTO userDTO,
                          SalonDTO salonDTO,
                          Set<ServiceDTO> serviceDTOSet) throws Exception;

    List<Booking> getBookingsByCustomer(ObjectId customerId);

    List<Booking> getBookingBySalon(ObjectId salonId);

    Booking getBookingById(ObjectId id) throws Exception;

    Booking updateBooking(ObjectId bookingId, BookingStatus status) throws Exception;

    List<Booking> getBookingByDate(LocalDateTime date, ObjectId salonId);

    SalonReport getSalonReport(ObjectId salonId);
}