package com.winnerx0.ameri.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.winnerx0.ameri.enums.MealType;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;
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

    private LocalDate loggedAt = LocalDate.now();

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

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

