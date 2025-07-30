package com.winnerx0.ameri.dto.request;

import com.fasterxml.jackson.databind.JsonNode;
import com.winnerx0.ameri.enums.Gender;
import com.winnerx0.ameri.enums.Goal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    private String username;

    private Gender gender;

    private LocalDate dateOfBirth;

    private JsonNode healthConditions;

    private Integer weight;

    private Integer height;

    private Goal goal;
}
