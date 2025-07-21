package com.winnerx0.ameri.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.winnerx0.ameri.dto.request.MealRequest;
import com.winnerx0.ameri.dto.request.NutrientRequest;
import com.winnerx0.ameri.dto.response.MealResponse;
import com.winnerx0.ameri.model.Meal;
import com.winnerx0.ameri.service.MealService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<JsonNode> getMealMetadata(@Valid @ModelAttribute NutrientRequest nutritionRequest) throws JsonProcessingException {

        return ResponseEntity.ok(mealService.getMealMetadata(nutritionRequest));
    }

    @PostMapping(value = "/create-meal-recipes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<JsonNode> createRecipe(@Valid @ModelAttribute NutrientRequest nutritionRequest) throws JsonProcessingException {

        return ResponseEntity.ok(mealService.createRecipe(nutritionRequest));
    }

    @PostMapping(value = "/log-meal")
    public ResponseEntity<MealResponse> createRecipe(@Valid @RequestBody MealRequest mealRequest) {

        return ResponseEntity.status(HttpStatus.CREATED).body(new MealResponse(mealService.logMeal(mealRequest)));
    }

    @GetMapping("/get-meal-logs")
    public ResponseEntity<Page<Meal>> getMeals(@RequestParam(value = "page", required = false, defaultValue = "0") int page, @RequestParam(value = "size", required = false, defaultValue = "10") int size){
        return ResponseEntity.ok(mealService.getMeals(page, size));
    }

    @DeleteMapping("/log-meal/{id}")
    public ResponseEntity<MealResponse> deleteMeal(@PathVariable("id") String id){
        return ResponseEntity.ok(new MealResponse(mealService.deleteMeal(id)));
    }

}
