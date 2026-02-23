package com.utkarshhh.service;

import com.utkarshhh.config.RabbitMQConfig;
import com.utkarshhh.dto.BookingNotificationDTO;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public NotificationPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendBookingNotification(BookingNotificationDTO notification) {
        System.out.println("   Sending booking notification to RabbitMQ...");
        System.out.println("   Booking ID: " + notification.getBookingId());
        System.out.println("   Customer: " + notification.getCustomerName());

        rabbitTemplate.convertAndSend(
            RabbitMQConfig.EXCHANGE,
            RabbitMQConfig.BOOKING_ROUTING_KEY,
            notification
        );

        System.out.println(" Booking notification sent to queue!");
    }
}