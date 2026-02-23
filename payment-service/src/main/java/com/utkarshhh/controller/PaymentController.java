package com.utkarshhh.controller;

import com.utkarshhh.client.BookingClient;
import com.utkarshhh.client.UserClient;
import com.utkarshhh.dto.BookingDTO;
import com.utkarshhh.dto.UserDTO;
import com.utkarshhh.model.PaymentOrder;
import com.utkarshhh.payload.response.PaymentLinkResponse;
import com.utkarshhh.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    private BookingClient bookingClient;

    @Autowired
    private UserClient userClient;

    @PostMapping("/create")
    public ResponseEntity<?> createPaymentLink(
            @RequestBody BookingDTO booking,
            @RequestHeader("User-Id") String userId,
            @RequestHeader("User-Name") String userName,
            @RequestHeader("User-Email") String userEmail) {

        try {
            UserDTO user = new UserDTO();
            user.setFullName(userName);
            user.setEmail(userEmail);

            PaymentLinkResponse response = paymentService.createOrder(user, booking);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{paymentOrderId}")
    public ResponseEntity<?> getPaymentOrderById(@PathVariable String paymentOrderId) {
        try {
            PaymentOrder paymentOrder = paymentService.getPaymentOrderById(new ObjectId(paymentOrderId));
            return ResponseEntity.ok(paymentOrder);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PatchMapping("/proceed")
    public ResponseEntity<?> proceedPayment(
            @RequestParam String paymentId,
            @RequestParam String paymentLinkId) {

        try {
            Boolean result = paymentService.proceedPayment(paymentId, paymentLinkId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        try {
            paymentService.handleWebhook(payload, sigHeader);
            return ResponseEntity.ok("Webhook handled successfully");
        } catch (Exception e) {
            System.out.println("Webhook error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook error: " + e.getMessage());
        }
    }
//for testing purpose of feign inter-service communication
    @GetMapping("/test-feign/booking/{bookingId}")
    public ResponseEntity<?> testBookingFeign(@PathVariable String bookingId) {
        try {
            BookingDTO booking = bookingClient.getBooking(bookingId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error calling Booking Service: " + e.getMessage());
        }
    }

    @GetMapping("/test-feign/user/{userId}")
    public ResponseEntity<?> testUserFeign(@PathVariable String userId) {
        try {
            UserDTO user = userClient.getUser(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error calling User Service: " + e.getMessage());
        }
    }
}