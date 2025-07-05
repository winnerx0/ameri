package com.winnerx0.ameri.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class MealController {

    @GetMapping("/meal")
    public String hello() {
        return new String("Hello");
    }
    
    
}
