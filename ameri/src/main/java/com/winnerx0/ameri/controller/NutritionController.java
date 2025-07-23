package com.winnerx0.ameri.controller;

import com.winnerx0.ameri.dto.response.NutritionResponse;
import com.winnerx0.ameri.repository.MealRepository;
import com.winnerx0.ameri.service.NutritionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/nutrition")
public class NutritionController {

    private final NutritionService nutritionService;

    public NutritionController(NutritionService nutritionService) {
        this.nutritionService = nutritionService;
    }

    @GetMapping("/summary")
    public ResponseEntity<NutritionResponse> summary(@RequestParam("date") LocalDate date){
        return ResponseEntity.ok(nutritionService.getNutritionSummary(date));
    }

    @GetMapping("/history")
    public ResponseEntity<List<NutritionResponse>> history(@RequestParam(value = "startdate", required = false) LocalDate startDate, @RequestParam(value = "enddate", required = false) LocalDate endDate){
        return ResponseEntity.ok(nutritionService.getNutritionHistory(startDate, endDate));
    }
}
