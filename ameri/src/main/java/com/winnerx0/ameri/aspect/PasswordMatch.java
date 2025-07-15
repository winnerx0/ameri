package com.winnerx0.ameri.aspect;

import com.winnerx0.ameri.dto.request.LoginRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatch implements ConstraintValidator<com.winnerx0.ameri.annotation.PasswordMatch, LoginRequest> {

    @Override
    public void initialize(com.winnerx0.ameri.annotation.PasswordMatch constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(LoginRequest loginRequest, ConstraintValidatorContext constraintValidatorContext) {
        return loginRequest.getPassword().equals(loginRequest.getConfirmPassword());
    }
}
