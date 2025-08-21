package com.winnerx0.ameri.dto.request;

import com.winnerx0.ameri.enums.MealType;
import com.winnerx0.ameri.model.Meal;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MealRequest {

    @NotNull(message = "Meal type required")
    private MealType mealType;

    @NotEmpty(message = "Meal items required")
    @Valid
    private List<MealItem> items =  new ArrayList<>();

    private LocalDate loggedAt = LocalDate.now();

    /* TODO
    Add option to put photo of meal
    Add the photo url
    */

    @Data
    public static class MealItem {

        @NotBlank(message = "Name required")
        private String foodName;

        @NotBlank(message = "Quantity required")
        private String quantityInGrams;

        @Valid
        @NotNull(message = "Macros required")
        private Macros macros;
    }

    @Data
    public static class Macros {

        @NotNull(message = "Calories required")
        private Double calories;

        @NotNull(message = "Carbs required")
        private Double carbs;

        @NotNull(message = "Protein required")
        private Double protein;

        @NotNull(message = "Fat required")
        private Double fat;
    }

}
