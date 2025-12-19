package com.utkarshhh.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

       @GetMapping
       public String HomeControllerHandler(){
           return "salon microservice for salon booking";
       }
}
