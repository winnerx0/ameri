package com.winnerx0.ameri.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NutritionResponse {

    private String status;
    private String meal_type;
    private String cuisine;
    private List<String> items;
    private String portion_size;
    private String calories;
    private Macronutrients macronutrients;
    private String water_content;
    private Vitamins vitamins;
    private Minerals minerals;
    private String confidence;

    @Data
    public static class Macronutrients {
        private String carbohydrates;
        private String protein;
        private String fat;

    }

    @Data
    public static class Vitamins {
        private String a;
        private String b_complex;
        private String c;
        private String d;
        private String e;
        private String k;

    }

    @Data
    public static class Minerals {
        private String iron;
        private String calcium;
        private String magnesium;
        private String potassium;
        private String zinc;

    }
}
