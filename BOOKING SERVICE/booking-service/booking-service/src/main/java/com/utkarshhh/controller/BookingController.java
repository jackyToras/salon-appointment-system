package com.utkarshhh.controller;

import com.utkarshhh.domain.BookingStatus;
import com.utkarshhh.domain.PaymentStatus;
import com.utkarshhh.dto.BookingRequest;
import com.utkarshhh.dto.SalonDTO;
import com.utkarshhh.dto.ServiceDTO;
import com.utkarshhh.dto.UserDTO;
import com.utkarshhh.model.Booking;
import com.utkarshhh.model.SalonReport;
import com.utkarshhh.repository.BookingRepository;
import com.utkarshhh.service.BookingService;
import com.utkarshhh.service.SalonService;
import com.utkarshhh.service.ServiceOfferingService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final SalonService salonService;
    private final ServiceOfferingService serviceOfferingService;
    private final BookingRepository bookingRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody BookingRequest bookingRequest,
            @RequestHeader("User-Id") String userId,
            @RequestHeader("User-Name") String userName,
            @RequestHeader("User-Email") String userEmail) {

        try {

            UserDTO userDTO = new UserDTO();
            userDTO.setId(new ObjectId(userId));   // critical change
            userDTO.setFullName(userName);
            userDTO.setEmail(userEmail);

            SalonDTO salonDTO = salonService.getSalonById(bookingRequest.getSalonId());

            Set<ServiceDTO> serviceDTOSet = new HashSet<>();
            for (ObjectId serviceId : bookingRequest.getServiceIds()) {
                ServiceDTO serviceDTO = serviceOfferingService.getServiceById(serviceId);
                serviceDTOSet.add(serviceDTO);
            }

            Booking booking = new Booking();
            booking.setStartTime(bookingRequest.getStartTime());
            booking.setPaymentMethod(bookingRequest.getPaymentMethod());


            Booking createdBooking = bookingService.createBooking(booking, userDTO, salonDTO, serviceDTOSet);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/customer")
    public ResponseEntity<?> getBookingsByCustomer(@RequestParam String customerId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByCustomer(new ObjectId(customerId));
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/salon")
    public ResponseEntity<?> getBookingsBySalon(@RequestParam String salonId) {
        try {
            List<Booking> bookings = bookingService.getBookingBySalon(new ObjectId(salonId));
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/report")
    public ResponseEntity<?> getSalonReport(@RequestParam String salonId) {
        try {
            SalonReport report = bookingService.getSalonReport(new ObjectId(salonId));
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/slots/salon/{salonId}/date/{date}")
    public ResponseEntity<?> getBookingsByDate(
            @PathVariable String salonId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        try {
            List<Booking> bookings = bookingService.getBookingByDate(date, new ObjectId(salonId));
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingById(@PathVariable String bookingId) {
        try {
            Booking booking = bookingService.getBookingById(new ObjectId(bookingId));
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable String bookingId,
            @RequestParam BookingStatus status) {
        try {
            Booking updatedBooking = bookingService.updateBooking(new ObjectId(bookingId), status);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{bookingId}/payment")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable String bookingId,
            @RequestParam PaymentStatus paymentStatus) {
        try {
            Booking booking = bookingService.getBookingById(new ObjectId(bookingId));
            booking.setPaymentStatus(paymentStatus);

            if (paymentStatus == PaymentStatus.PAID) {
                booking.setStatus(BookingStatus.CONFIRM);
            } else if (paymentStatus == PaymentStatus.FAILED) {
                booking.setStatus(BookingStatus.CANCELLED);
            }

            Booking updatedBooking = bookingRepository.save(booking);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
