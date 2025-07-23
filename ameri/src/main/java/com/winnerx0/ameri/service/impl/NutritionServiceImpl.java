package com.winnerx0.ameri.service.impl;

import com.winnerx0.ameri.dto.request.NutritionRequest;
import com.winnerx0.ameri.dto.response.NutritionResponse;
import com.winnerx0.ameri.model.Meal;
import com.winnerx0.ameri.model.User;
import com.winnerx0.ameri.repository.MealRepository;
import com.winnerx0.ameri.service.NutritionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class NutritionServiceImpl implements NutritionService {

    private final MealRepository mealRepository;

    public NutritionServiceImpl(MealRepository mealRepository){
        this.mealRepository = mealRepository;
    }

    @Override
    public NutritionResponse getNutritionSummary(LocalDate date) {

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Meal> meals = mealRepository.findAllByUserAndDate(user, date);

        if(meals.isEmpty()){
            throw new EntityNotFoundException("No meal logged");
        }

        NutritionResponse nutritionResponse = new NutritionResponse();
        nutritionResponse.setDate(date);
        meals.forEach(meal -> {
            meal.getItems().forEach(mealItem -> {
                nutritionResponse.setTotalCalories(nutritionResponse.getTotalCalories() + mealItem.getMacros().getCalories());
                nutritionResponse.setTotalProtein(nutritionResponse.getTotalProtein() + mealItem.getMacros().getProtein());
                nutritionResponse.setTotalFat(nutritionResponse.getTotalFat() + mealItem.getMacros().getFat());
                nutritionResponse.setTotalCarbs(nutritionResponse.getTotalCarbs() + mealItem.getMacros().getCarbs());

                // TODO: Add macro goals
            });
        });

        return nutritionResponse;
    }

    @Override
    public List<NutritionResponse> getNutritionHistory(LocalDate startDate, LocalDate endDate) {

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        log.info("start date {}, end date {}", startDate, endDate);

        List<Meal> meals = mealRepository.findAllByUserAndStartDateAndEndDate(user, startDate, endDate);

        if(meals.isEmpty()){
            throw new EntityNotFoundException("No meal logged");
        }

        List<NutritionResponse> nutritionResponses = new ArrayList<>();

        meals.forEach(meal -> {
            NutritionResponse nutritionResponse = new NutritionResponse();
            meal.getItems().forEach(mealItem -> {
                nutritionResponse.setTotalCalories(nutritionResponse.getTotalCalories() + mealItem.getMacros().getCalories());
                nutritionResponse.setTotalProtein(nutritionResponse.getTotalProtein() + mealItem.getMacros().getProtein());
                nutritionResponse.setTotalFat(nutritionResponse.getTotalFat() + mealItem.getMacros().getFat());
                nutritionResponse.setTotalCarbs(nutritionResponse.getTotalCarbs() + mealItem.getMacros().getCarbs());
                // TODO: Add macro goals
            });
            nutritionResponse.setDate(meal.getLoggedAt());
            nutritionResponses.add(nutritionResponse);
        });

        return nutritionResponses;
    }
}
