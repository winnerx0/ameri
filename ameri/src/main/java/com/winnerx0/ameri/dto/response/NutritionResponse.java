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

    private double totalCalories;

    private double totalProtein;

    private double totalCarbs;

    private double totalFat;

    private double caloricGoal;

    private double proteinGoal;

    private double carbsGoals;

    private double fatGoal;


}
