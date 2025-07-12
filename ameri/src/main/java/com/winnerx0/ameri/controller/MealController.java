package com.winnerx0.ameri.controller;

import com.winnerx0.ameri.dto.request.MealImageRequest;
import com.winnerx0.ameri.service.MealService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/v1/meal")
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadMealImage(@Valid @ModelAttribute MealImageRequest mealImageRequest){
        mealService.uploadPhoto(mealImageRequest.getFile());
        return ResponseEntity.ok("Meal Saved Successfully");
    }
    
}
