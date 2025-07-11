package com.winnerx0.ameri.controller;

import com.winnerx0.ameri.dto.request.MealImageRequest;
import com.winnerx0.ameri.service.MealService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/meal")
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @PostMapping("/")
    public ResponseEntity<String> uploadMealImage(@ModelAttribute MealImageRequest mealImageRequest){
        mealService.uploadPhoto(mealImageRequest.getFile());
        return ResponseEntity.ok("Meal Saved Successfully");
    }
    
}
