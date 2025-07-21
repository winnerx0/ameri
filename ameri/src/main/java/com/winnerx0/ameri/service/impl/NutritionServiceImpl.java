package com.winnerx0.ameri.service.impl;

import com.winnerx0.ameri.dto.request.NutritionRequest;
import com.winnerx0.ameri.dto.response.NutritionResponse;
import com.winnerx0.ameri.model.Meal;
import com.winnerx0.ameri.model.User;
import com.winnerx0.ameri.repository.MealRepository;
import com.winnerx0.ameri.service.NutritionService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NutritionServiceImpl implements NutritionService {

    private static final Logger log = LoggerFactory.getLogger(NutritionServiceImpl.class);
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
}
