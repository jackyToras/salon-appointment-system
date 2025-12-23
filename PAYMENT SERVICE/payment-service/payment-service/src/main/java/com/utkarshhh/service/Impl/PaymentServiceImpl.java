package com.utkarshhh.service.Impl;
import java.util.Optional;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.ApiResource;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.utkarshhh.domain.PaymentOrderStatus;
import com.utkarshhh.dto.BookingDTO;
import com.utkarshhh.dto.UserDTO;
import com.utkarshhh.model.PaymentOrder;
import com.utkarshhh.payload.response.PaymentLinkResponse;
import com.utkarshhh.repository.PaymentOrderRepository;
import com.utkarshhh.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentOrderRepository paymentOrderRepository;

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Override
    public PaymentLinkResponse createOrder(UserDTO user, BookingDTO booking) throws Exception {
        Long amount = (long) booking.getTotalPrice();

        PaymentOrder order = new PaymentOrder();
        order.setAmount(amount);
        order.setBookingId(booking.getId());
        order.setSalonId(booking.getSalonId());
        order.setUserId(booking.getCustomerId());

        PaymentOrder savedOrder = paymentOrderRepository.save(order);

        String paymentUrl = createStripePaymentLink(user, savedOrder.getAmount(), savedOrder.getId());

        savedOrder.setPaymentLinkId(savedOrder.getId().toHexString());
        paymentOrderRepository.save(savedOrder);

        PaymentLinkResponse response = new PaymentLinkResponse();
        response.setPayment_link_url(paymentUrl);
        response.setPayment_link_id(savedOrder.getId().toHexString());

        return response;
    }

    @Override
    public PaymentOrder getPaymentOrderById(ObjectId id) throws Exception {
        PaymentOrder paymentOrder = paymentOrderRepository.findById(id).orElse(null);
        if (paymentOrder == null) {
            throw new Exception("Payment order not found");
        }
        return paymentOrder;
    }

    @Override
    public PaymentOrder getPaymentOrderByPaymentId(String paymentId) throws Exception {
        PaymentOrder paymentOrder = paymentOrderRepository.findByPaymentLinkId(paymentId);
        if (paymentOrder == null) {
            throw new Exception("Payment order not found with payment link id: " + paymentId);
        }
        return paymentOrder;
    }

    @Override
    public Boolean proceedPayment(String paymentId, String paymentLinkId) throws Exception {
        PaymentOrder paymentOrder = paymentOrderRepository.findByPaymentLinkId(paymentLinkId);

        if (paymentOrder == null) {
            throw new Exception("Payment order not found");
        }

        paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
        paymentOrderRepository.save(paymentOrder);

        return true;
    }

    @Override
    public void handleWebhook(String payload, String sigHeader) throws Exception {
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            System.out.println("Webhook signature verification failed");
            throw new Exception("Invalid signature");
        }

        System.out.println("Webhook received: " + event.getType());

        if ("checkout.session.completed".equals(event.getType())) {
            EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();

            StripeObject stripeObject = null;
            if (deserializer.getObject().isPresent()) {
                stripeObject = deserializer.getObject().get();
            } else {
                Optional<String> rawJson = deserializer.getRawJson().describeConstable();
                if (rawJson.isPresent()) {
                    try {
                        stripeObject = ApiResource.GSON.fromJson(rawJson.get(), Session.class);
                    } catch (Exception e) {
                        System.out.println("Failed to parse raw JSON into Session: " + e.getMessage());
                    }
                }
            }

            if (stripeObject instanceof Session session) {
                if (session.getMetadata() != null) {
                    String orderId = session.getMetadata().get("order_id");

                    System.out.println("Payment completed for order: " + orderId);

                    if (orderId != null && !orderId.isEmpty()) {
                        PaymentOrder paymentOrder = paymentOrderRepository.findById(new ObjectId(orderId)).orElse(null);
                        if (paymentOrder != null) {
                            paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                            paymentOrderRepository.save(paymentOrder);
                            System.out.println("Payment status updated to SUCCESS for order: " + orderId);
                        } else {
                            System.out.println("Payment order not found: " + orderId);
                        }
                    } else {
                        System.out.println("Order ID is null or empty in metadata");
                    }
                } else {
                    System.out.println("Session metadata is null");
                }
            } else {
                System.out.println("Stripe object is not a Session");
            }
        }
    }


    private String createStripePaymentLink(UserDTO user, Long amount, ObjectId orderId) throws Exception {
        try {
            Stripe.apiKey = stripeSecretKey;

            SessionCreateParams params = SessionCreateParams.builder()
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .putMetadata("order_id", orderId.toHexString())
                    .setSuccessUrl("http://localhost:3000/payment/success?order_id=" + orderId.toHexString())
                    .setCancelUrl("http://localhost:3000/payment/cancel")
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("usd")
                                    .setUnitAmount(amount * 100)
                                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName("Salon Booking Payment")
                                            .build())
                                    .build())
                            .build())
                    .build();

            Session session = Session.create(params);
            return session.getUrl();
        } catch (Exception e) {
            throw new Exception("Error creating Stripe payment link: " + e.getMessage());
        }
    }
}
