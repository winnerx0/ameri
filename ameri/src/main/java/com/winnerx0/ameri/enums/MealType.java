package com.winnerx0.ameri.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

public enum MealType {

    BREAKFAST("Breakfast"),
    LUNCH("Lunch"),
    DINNER("Dinner"),
    SNACK("Snack");

    @Getter
    private final String name;

    MealType(String name){
        this.name = name;
    }

    @JsonValue
    public String getName() {
        return name;
    }

    @JsonCreator
    public static MealType fromValue(String value) {
        for (MealType type : MealType.values()) {
            if (type.name.equalsIgnoreCase(value) || type.name().equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException(
                "Invalid meal type: " + value + ". Allowed values: Breakfast, Lunch, Dinner, Snack"
        );
    }
}
