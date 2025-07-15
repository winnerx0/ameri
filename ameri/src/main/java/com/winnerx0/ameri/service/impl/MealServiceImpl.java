package com.winnerx0.ameri.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.winnerx0.ameri.dto.ImageDTO;
import com.winnerx0.ameri.dto.request.NutritionRequest;
import com.winnerx0.ameri.exception.GeminiException;
import com.winnerx0.ameri.model.User;
import com.winnerx0.ameri.repository.UserRepository;
import com.winnerx0.ameri.service.ImageService;
import com.winnerx0.ameri.service.MealService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
public class MealServiceImpl implements MealService {

    private final RestTemplate restTemplate;

    private final ImageService imageService;

    @Value("${gemini.api-key}")
    private String geminiApiKey;

    public MealServiceImpl(RestTemplate restTemplate, ImageService imageService) {
        this.restTemplate = restTemplate;
        this.imageService = imageService;
    }

    @Override
    public JsonNode getMealMetadata(NutritionRequest request) throws JsonProcessingException {
//
//        if(!Objects.equals(request.getFile().getContentType(), "image/**")){
//            throw new IllegalArgumentException("Only images allowed");
//        }

            ImageDTO imageDTO = imageService.getImageData(request);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-goog-api-key", geminiApiKey);

            log.info("base64 {}", Base64.getEncoder().encodeToString(imageDTO.getImageBytes()));

            Map<String, Object> body = Map.of("contents", List.of(
                    Map.of("parts", List.of(
                            Map.of("inlineData", Map.of(
                                    "mimeType", imageDTO.getContentType(),
                                    "data", Base64.getEncoder().encodeToString(imageDTO.getImageBytes())
                            )),
                            Map.of("text", "You are a professional nutritionist AI. Given an image, do the following:\n" +
                                    "\n" +
                                    "    Classify whether the image is a prepared meal/food or not.\n" +
                                    "\n" +
                                    "        If the image is not a food image, return the following JSON:\n" +
                                    "\n" +
                                    "{\n" +
                                    "  \"status\": \"Rejected\",\n" +
                                    "  \"reason\": \"Not a meal or food image\"\n" +
                                    "}\n" +
                                    "\n" +
                                    "If it is a meal, analyze the image and return a detailed structured JSON with the following fields:\n" +
                                    "\n" +
                                    "    {\n" +
                                    "      \"status\": \"Accepted\",\n" +
                                    "      \"meal_type\": \"Breakfast | Lunch | Dinner | Snack\",\n" +
                                    "      \"cuisine\": \"e.g. Nigerian, Italian, Chinese\",\n" +
                                    "      \"items\": [\"list of identifiable food items\"],\n" +
                                    "      \"portion_size\": \"estimated weight or volume (e.g., 350g, 1 cup)\",\n" +
                                    "      \"calories\": \"estimated kcal\",\n" +
                                    "      \"macronutrients\": {\n" +
                                    "        \"carbohydrates\": \"g\",\n" +
                                    "        \"protein\": \"g\",\n" +
                                    "        \"fat\": \"g\"\n" +
                                    "      },\n" +
                                    "      \"water_content\": \"percentage of water content\",\n" +
                                    "      \"vitamins\": {\n" +
                                    "        \"a\": \"amount or %DV\",\n" +
                                    "        \"b_complex\": \"amount or %DV\",\n" +
                                    "        \"c\": \"amount or %DV\",\n" +
                                    "        \"d\": \"amount or %DV\",\n" +
                                    "        \"e\": \"amount or %DV\",\n" +
                                    "        \"k\": \"amount or %DV\"\n" +
                                    "      },\n" +
                                    "      \"minerals\": {\n" +
                                    "        \"iron\": \"amount or %DV\",\n" +
                                    "        \"calcium\": \"amount or %DV\",\n" +
                                    "        \"magnesium\": \"amount or %DV\",\n" +
                                    "        \"potassium\": \"amount or %DV\",\n" +
                                    "        \"zinc\": \"amount or %DV\"\n" +
                                    "      },\n" +
                                    "      \"confidence\": \"percentage likelihood this prediction is accurate\"\n" +
                                    "    }\n" +
                                    "\n" +
                                    "Be strict in rejecting non-food images. All outputs must be valid JSON.")
                    ))
            ));

            HttpEntity<Object> httpEntity = new HttpEntity<>(body, headers);
            ResponseEntity<JsonNode> response = restTemplate.exchange("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", HttpMethod.POST, httpEntity, JsonNode.class);

            assert response != null;

            if(!response.getStatusCode().is2xxSuccessful()){
                 throw new GeminiException(response.getBody().toString(), response.getStatusCode());
            }

            log.info("response {}", response.getBody().get("candidates").get(0).get("content").get("parts").get(0).get("text").asText().replaceAll("```json", "").replaceAll("```", ""));

            ObjectMapper objectMapper = new ObjectMapper();

            return objectMapper.readValue(response
                    .getBody()
                    .get("candidates")
                    .get(0).get("content")
                    .get("parts")
                    .get(0)
                    .get("text")
                    .asText()
                    .replaceAll("```json", "").replaceAll("```", ""), JsonNode.class);
    }

    @Override
    public JsonNode createRecipe(NutritionRequest request) throws JsonProcessingException {

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        log.info("user health conditions {}", user.getHealthConditions().toString());

        ImageDTO imageDTO = imageService.getImageData(request);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-goog-api-key", geminiApiKey);

        log.info("base64 {}", Base64.getEncoder().encodeToString(imageDTO.getImageBytes()));

        Map<String, Object> body = Map.of("contents", List.of(
                Map.of("parts", List.of(
                        Map.of("inlineData", Map.of(
                                "mimeType", imageDTO.getContentType(),
                                "data", Base64.getEncoder().encodeToString(imageDTO.getImageBytes())
                        )),
                        Map.of("text", String.format("You are a professional nutritionist AI. Given an image, perform the following:\n" +
                                "\n" +
                                "1. Classify whether the image contains raw ingredients suitable for meal preparation.\n" +
                                "\n" +
                                "    - If the image **does not** contain identifiable raw or semi-prepared food ingredients (e.g. it's a human, object, or landscape), return:\n" +
                                "\n" +
                                "    {\n" +
                                "      \"status\": \"Rejected\",\n" +
                                "      \"reason\": \"Not an image of food ingredients\"\n" +
                                "    }\n" +
                                "\n" +
                                "2. If it **does** contain ingredients, analyze them and strictly analyze the user health conditions which are %s and take them into consideration when creating the recipes too please and return a structured JSON response that includes recipe suggestions. The response format must be:\n" +
                                "\n" +
                                "{\n" +
                                "  \"status\": \"Accepted\",\n" +
                                "  \"detected_ingredients\": [\n" +
                                "    {\n" +
                                "      \"name\": \"ingredient name\",\n" +
                                "      \"confidence\": \"percentage confidence\",\n" +
                                "      \"macros\": {\n" +
                                "        \"calories\": \"estimated kcal per portion\",\n" +
                                "        \"protein\": \"g\",\n" +
                                "        \"carbohydrates\": \"g\",\n" +
                                "        \"fat\": \"g\"\n" +
                                "      }\n" +
                                "    }\n" +
                                "  ],\n" +
                                "  \"recipes\": [\n" +
                                "    {\n" +
                                "      \"type\": \"Meal | Snack | Drink | Salad | Soup\",\n" +
                                "      \"name\": \"Recipe name\",\n" +
                                "      \"description\": \"Short description of the recipe\",\n" +
                                "      \"macros\": {\n" +
                                "        \"calories\": \"kcal per serving\",\n" +
                                "        \"protein\": \"g\",\n" +
                                "        \"carbohydrates\": \"g\",\n" +
                                "        \"fat\": \"g\"\n" +
                                "      },\n" +
                                "      \"recipeId\": \"optional-unique-recipe-id\"\n" +
                                "    }\n" +
                                "  ]\n" +
                                "}\n" +
                                "\n" +
                                "Guidelines:\n" +
                                "- Return 1–3 realistic recipes.\n" +
                                "- Recipes must use **only the detected ingredients** or items commonly paired with them.\n" +
                                "- Ensure `confidence` values and macro estimates are realistic.\n" +
                                "- Be strict in rejecting images that do not contain food ingredients.\n" +
                                "- All output must be strictly valid JSON.\n", user.getHealthConditions().toString()))
                ))
        ));

        HttpEntity<Object> httpEntity = new HttpEntity<>(body, headers);
        ResponseEntity<JsonNode> response = restTemplate.exchange("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", HttpMethod.POST, httpEntity, JsonNode.class);

        assert response.getBody() != null;

        if(!response.getStatusCode().is2xxSuccessful()){
            throw new GeminiException(response.getBody().toString(), response.getStatusCode());
        }


        log.info("response {}", response.getBody().get("candidates").get(0).get("content").get("parts").get(0).get("text").asText().replaceAll("```json", "").replaceAll("```", ""));

        ObjectMapper objectMapper = new ObjectMapper();

        return objectMapper
                .readValue(response
                        .getBody()
                        .get("candidates")
                        .get(0).get("content")
                        .get("parts")
                        .get(0)
                        .get("text")
                        .asText()
                        .replaceAll("```json", "").replaceAll("```", ""), JsonNode.class);
    }
}
