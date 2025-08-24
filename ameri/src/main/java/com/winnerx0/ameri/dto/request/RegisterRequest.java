package com.winnerx0.ameri.dto.request;

import com.fasterxml.jackson.databind.JsonNode;
import com.winnerx0.ameri.enums.Gender;
import com.winnerx0.ameri.enums.Goal;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Username required")
    private String username;

    @NotBlank(message = "Email required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password required")
    @Size(min = 8, message = "Password must have at least 8 characters")
    private String password;

    @NotNull(message = "Gender required")
    private Gender gender;

    @NotNull(message = "Date of birth required")
    @Past(message = "Date of birth should be in the past")
    private LocalDate dateOfBirth;

    private List<String> healthConditions;

    @NotNull(message = "Weight required")
    @Min(value = 1, message = "Invalid weight")
    private int weight;

    @NotNull(message = "Height required")
    @Min(value = 1, message = "Invalid height")
    private int height;

    @NotNull(message = "Goal required")
    private Goal goal;
}
