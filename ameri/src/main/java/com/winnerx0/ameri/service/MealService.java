package com.winnerx0.ameri.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.winnerx0.ameri.dto.request.AIRequest;

public interface MealService {

    JsonNode getMealMetadata(AIRequest request);

    JsonNode createRecipe();
}
