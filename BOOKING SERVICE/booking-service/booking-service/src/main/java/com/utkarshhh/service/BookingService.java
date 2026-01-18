package com.utkarshhh.service;

import com.utkarshhh.domain.BookingStatus;
import com.utkarshhh.dto.BookingDTO;
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

    List<Booking> getBookingsByCustomer(String customerId);

    List<Booking> getBookingBySalon(String salonId);

    Booking getBookingById(String id) throws Exception;

    Booking updateBooking(String bookingId, BookingStatus status) throws Exception;

    BookingDTO updateBookingStatus(String bookingId, BookingStatus bookingStatus);

    List<Booking> getBookingByDate(LocalDateTime date, String salonId);

    SalonReport getSalonReport(String salonId);

}