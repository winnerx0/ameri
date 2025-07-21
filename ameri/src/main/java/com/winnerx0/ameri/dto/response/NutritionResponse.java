package com.winnerx0.ameri.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NutritionResponse {

    private LocalDate date;

    private int totalCalories;

    private int totalProtein;

    private int totalCarbs;

    private int totalFat;

    private int caloricGoal;

    private int proteinGoal;

    private int carbsGoals;

    private int fatGoal;


}
