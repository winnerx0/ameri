package com.winnerx0.ameri.service;

import com.winnerx0.ameri.dto.request.NutritionRequest;
import com.winnerx0.ameri.dto.response.NutritionResponse;

import java.time.LocalDate;

public interface NutritionService {

    NutritionResponse getNutritionSummary(LocalDate date);
}
