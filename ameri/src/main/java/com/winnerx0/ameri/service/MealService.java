package com.winnerx0.ameri.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.winnerx0.ameri.dto.request.MealRequest;
import com.winnerx0.ameri.dto.request.NutritionRequest;
import com.winnerx0.ameri.dto.response.MealResponse;

public interface MealService {

    JsonNode getMealMetadata(NutritionRequest request) throws JsonProcessingException;

    JsonNode createRecipe(NutritionRequest request) throws JsonProcessingException;

    String logMeal(MealRequest mealRequest);
}
