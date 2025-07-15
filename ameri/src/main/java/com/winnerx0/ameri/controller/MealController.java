package com.winnerx0.ameri.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.winnerx0.ameri.dto.request.AIRequest;
import com.winnerx0.ameri.service.MealService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/meal")
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @PostMapping(value = "/get-meal-metadata", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<JsonNode> getMealMetadata(@Valid @ModelAttribute AIRequest aiRequest){

        return ResponseEntity.ok(mealService.getMealMetadata(aiRequest));
    }
}
