package com.winnerx0.ameri.service;

import com.winnerx0.ameri.dto.request.AIRequest;
import com.winnerx0.ameri.dto.response.NutritionResponse;

public interface AIService {

    NutritionResponse getMealMetadata(AIRequest request);
}
