package com.winnerx0.ameri.enums;

import lombok.Getter;

@Getter
public enum Goal {
    LOSE_WEIGHT("Lose weight"),
    GAIN_WEIGHT("Gain weight"),
    GAIN_MUSCLE("Gain muscle"),
    STAY_HEALTHY("Stay Healthy");

    private final String goal;

    Goal(String goal){
        this.goal = goal;
    }
}
