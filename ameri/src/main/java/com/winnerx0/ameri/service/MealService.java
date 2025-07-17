package com.winnerx0.ameri.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.winnerx0.ameri.dto.request.MealRequest;
import com.winnerx0.ameri.dto.request.NutritionRequest;
import com.winnerx0.ameri.dto.response.MealResponse;
import com.winnerx0.ameri.model.Meal;
import org.springframework.data.domain.Page;

public interface MealService {

    JsonNode getMealMetadata(NutritionRequest request) throws JsonProcessingException;

    JsonNode createRecipe(NutritionRequest request) throws JsonProcessingException;

    String logMeal(MealRequest mealRequest);

    Page<Meal> getMeals(int pageNo, int pageSize);
}
