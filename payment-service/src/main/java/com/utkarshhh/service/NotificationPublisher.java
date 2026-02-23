package com.utkarshhh.service;

import com.utkarshhh.config.RabbitMQConfig;
import com.utkarshhh.dto.PaymentNotificationDTO;
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

    public void sendPaymentNotification(PaymentNotificationDTO notification) {
        System.out.println("   Sending payment notification to RabbitMQ...");
        System.out.println("   Payment ID: " + notification.getPaymentId());
        System.out.println("   Customer: " + notification.getCustomerName());
        System.out.println("   Amount: ₹" + notification.getAmount());

        rabbitTemplate.convertAndSend(
            RabbitMQConfig.EXCHANGE,
            RabbitMQConfig.PAYMENT_ROUTING_KEY,
            notification
        );

        System.out.println("Payment notification sent to queue!");
    }
}