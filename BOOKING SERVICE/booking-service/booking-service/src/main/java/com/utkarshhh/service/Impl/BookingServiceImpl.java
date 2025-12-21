package com.utkarshhh.service.Impl;

import com.utkarshhh.domain.BookingStatus;
import com.utkarshhh.domain.PaymentStatus;
import com.utkarshhh.dto.SalonDTO;
import com.utkarshhh.dto.ServiceDTO;
import com.utkarshhh.dto.UserDTO;
import com.utkarshhh.model.Booking;
import com.utkarshhh.model.SalonReport;
import com.utkarshhh.repository.BookingRepository;
import com.utkarshhh.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    @Override
    public Booking createBooking(Booking booking,
                                 UserDTO userDTO,
                                 SalonDTO salonDTO,
                                 Set<ServiceDTO> serviceDTOSet) throws Exception {


        int totalDuration = serviceDTOSet.stream()
                .mapToInt(ServiceDTO::getDuration)
                .sum();


        LocalDateTime bookingStartTime = booking.getStartTime();
        LocalDateTime bookingEndTime = bookingStartTime.plusMinutes(totalDuration);


        Boolean isSlotAvailable = isTimeSlotAvailable(salonDTO, bookingStartTime, bookingEndTime);


        int totalPrice = serviceDTOSet.stream()
                .mapToInt(ServiceDTO::getPrice)
                .sum();


        Set<ObjectId> idList = serviceDTOSet.stream()
                .map(ServiceDTO::getId)
                .collect(Collectors.toSet());


        booking.setSalonId(salonDTO.getId());
        booking.setServiceIds(idList);
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(booking.getPaymentStatus() != null ?
                booking.getPaymentStatus() : PaymentStatus.PENDING);
        booking.setStartTime(bookingStartTime);
        booking.setEndTime(bookingEndTime);
        booking.setTotalPrice(totalPrice);
        booking.setCustomerId(userDTO.getId());

        return bookingRepository.save(booking);
    }

    public Boolean isTimeSlotAvailable(SalonDTO salonDTO,
                                       LocalDateTime bookingStartTime,
                                       LocalDateTime bookingEndTime) throws Exception {
        List<Booking> existingBookings = getBookingBySalon(salonDTO.getId());

        LocalTime salonOpenTimeOnly = salonDTO.getOpenTime();
        LocalTime salonCloseTimeOnly = salonDTO.getCloseTime();


        LocalDateTime salonOpenTime = LocalDateTime.of(bookingStartTime.toLocalDate(), salonOpenTimeOnly);
        LocalDateTime salonCloseTime = LocalDateTime.of(bookingStartTime.toLocalDate(), salonCloseTimeOnly);

        if (salonCloseTimeOnly.isBefore(salonOpenTimeOnly)) {
            salonCloseTime = salonCloseTime.plusDays(1); // overnight shift
        }





        if (salonCloseTimeOnly.isBefore(salonOpenTimeOnly)) {
            salonCloseTime = salonCloseTime.plusDays(1);
        }


        if (bookingStartTime.isBefore(salonOpenTime) || bookingEndTime.isAfter(salonCloseTime)) {
            throw new Exception("Booking time must be within salon's working hours: "
                    + salonOpenTimeOnly + " - " + salonCloseTimeOnly);
        }


        for (Booking existingBooking : existingBookings) {
            if (existingBooking.getStatus() == BookingStatus.CANCELLED) {
                continue;
            }

            LocalDateTime existingBookingStartTime = existingBooking.getStartTime();
            LocalDateTime existingBookingEndTime = existingBooking.getEndTime();

            if (bookingStartTime.isBefore(existingBookingEndTime) && bookingEndTime.isAfter(existingBookingStartTime)) {
                throw new Exception("Slot not available. Please choose a different time.");
            }

            if (bookingStartTime.isEqual(existingBookingStartTime) || bookingEndTime.isEqual(existingBookingEndTime)) {
                throw new Exception("Slot not available. Please choose a different time.");
            }
        }

        return true;
    }

    @Override
    public List<Booking> getBookingsByCustomer(ObjectId customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Booking> getBookingBySalon(ObjectId salonId) {
        return bookingRepository.findBySalonId(salonId);
    }

    @Override
    public Booking getBookingById(ObjectId id) throws Exception {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null) {
            throw new Exception("Booking not found");
        }
        return booking;
    }

    @Override
    public Booking updateBooking(ObjectId bookingId, BookingStatus status) throws Exception {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getBookingByDate(LocalDateTime date, ObjectId salonId) {
        List<Booking> allBooking = getBookingBySalon(salonId);

        if (date == null) {
            return allBooking;
        }

        return allBooking.stream()
                .filter(booking -> isSameDate(booking.getStartTime(), date) ||
                        isSameDate(booking.getEndTime(), date))
                .collect(Collectors.toList());
    }

    private boolean isSameDate(LocalDateTime dateTime, LocalDateTime date) {
        return dateTime.toLocalDate().isEqual(date.toLocalDate());
    }

    @Override
    public SalonReport getSalonReport(ObjectId salonId) {
        List<Booking> bookings = getBookingBySalon(salonId);

        int totalEarnings = bookings.stream()
                .filter(booking -> booking.getStatus() == BookingStatus.CONFIRM)
                .mapToInt(Booking::getTotalPrice)
                .sum();

        Integer totalBooking = bookings.size();

        List<Booking> cancelledBookings = bookings.stream()
                .filter(booking -> booking.getStatus() == BookingStatus.CANCELLED)
                .collect(Collectors.toList());

        int totalRefund = cancelledBookings.stream()
                .mapToInt(Booking::getTotalPrice)
                .sum();

        SalonReport report = new SalonReport();
        report.setSalonId(salonId);
        report.setCancelledBooking(cancelledBookings.size());
        report.setTotalBooking(totalBooking);
        report.setTotalEarnings(totalEarnings);
        report.setTotalRefund(totalRefund);

        return report;
    }
}