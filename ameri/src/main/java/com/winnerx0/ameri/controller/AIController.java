package com.winnerx0.ameri.controller;

import com.winnerx0.ameri.dto.request.AIRequest;
import com.winnerx0.ameri.dto.response.NutritionResponse;
import com.winnerx0.ameri.service.AIService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping(value = "/get-meal-metadata", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NutritionResponse> getMealMetadata(@Valid @ModelAttribute AIRequest aiRequest){

        return ResponseEntity.ok(aiService.getMealMetadata(aiRequest));
    }
}
