package com.winnerx0.ameri.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.winnerx0.ameri.enums.Gender;
import com.winnerx0.ameri.enums.Goal;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private String username;

    private String email;

    private Gender gender;

    private LocalDate dateOfBirth;

    private JsonNode healthConditions;

    private int weight;

    private int height;

    private Goal goal;

    private long loggedMeals = 0;
}
