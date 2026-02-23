package com.utkarshhh.client;


import com.utkarshhh.dto.BookingDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "BOOKING-SERVICE")
public interface BookingClient {

    @GetMapping("/api/bookings/{id}")
    BookingDTO getBooking(@PathVariable("id") String id);

    @PutMapping("/api/bookings/{bookingId}/payment")
    BookingDTO updatePaymentStatus(@PathVariable("bookingId") String bookingId,
                                   @RequestParam("paymentStatus") String paymentStatus);
}
