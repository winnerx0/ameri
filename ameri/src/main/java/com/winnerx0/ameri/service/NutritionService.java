package com.winnerx0.ameri.service;

import com.winnerx0.ameri.dto.request.NutritionRequest;
import com.winnerx0.ameri.dto.response.NutritionResponse;

import java.time.LocalDate;
import java.util.List;

public interface NutritionService {

    NutritionResponse getNutritionSummary(LocalDate date);

    List<NutritionResponse> getNutritionHistory(LocalDate startDate, LocalDate endDate);
}
