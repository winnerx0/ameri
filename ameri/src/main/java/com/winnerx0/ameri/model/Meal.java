package com.winnerx0.ameri.model;

import com.winnerx0.ameri.enums.MealType;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meals")
@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    private MealType mealType;

    @ElementCollection
    @CollectionTable(name = "meal_items", joinColumns = @JoinColumn(name = "meal_id"))
    private List<MealItem> items =  new ArrayList<>();

    private LocalDateTime loggedAt = LocalDateTime.now();

    @Data
    @Embeddable
    public static class MealItem {

        private String foodName;

        private String quantityInGrams;

        private Macros macros;
    }

    @Data
    @Embeddable
    public static class Macros {

        private int calories;

        private int carbs;

        private int protein;

        private int fat;
    }

}

