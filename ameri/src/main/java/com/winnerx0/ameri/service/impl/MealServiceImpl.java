package com.winnerx0.ameri.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.winnerx0.ameri.dto.ImageDTO;
import com.winnerx0.ameri.dto.request.MealRequest;
import com.winnerx0.ameri.dto.request.NutritionRequest;
import com.winnerx0.ameri.dto.response.MealResponse;
import com.winnerx0.ameri.exception.GeminiException;
import com.winnerx0.ameri.model.Meal;
import com.winnerx0.ameri.model.User;
import com.winnerx0.ameri.repository.MealRepository;
import com.winnerx0.ameri.repository.UserRepository;
import com.winnerx0.ameri.service.ImageService;
import com.winnerx0.ameri.service.MealService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MealServiceImpl implements MealService {

    private final RestTemplate restTemplate;

    private final ImageService imageService;

    private final MealRepository mealRepository;

    @Value("${gemini.api-key}")
    private String geminiApiKey;

    public MealServiceImpl(RestTemplate restTemplate, ImageService imageService, MealRepository mealRepository) {
        this.restTemplate = restTemplate;
        this.imageService = imageService;
        this.mealRepository = mealRepository;
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

            Map<String, Object> body = Map.of("contents", List.of(
                    Map.of("parts", List.of(
                            Map.of("inlineData", Map.of(
                                    "mimeType", imageDTO.getContentType(),
                                    "data", Base64.getEncoder().encodeToString(imageDTO.getImageBytes())
                            )),
                            Map.of("text", "You are a registered-dietitian AI.  \n" +
                                    "Your only task is to examine the image and return exactly one JSON object—no extra text.\n" +
                                    "\n" +
                                    "1. Determine if the image shows a prepared, edible meal or food item.  \n" +
                                    "   - If NO → return  \n" +
                                    "     {\"status\":\"Rejected\",\"reason\":\"Not a meal or food image\"}  \n" +
                                    "\n" +
                                    "2. If YES → return  \n" +
                                    "{\n" +
                                    "  \"status\":\"Accepted\",\n" +
                                    "  \"meal_type\":\"Breakfast|Lunch|Dinner|Snack\",\n" +
                                    "  \"cuisine\":\"<single cuisine name, e.g. Nigerian>\",\n" +
                                    "  \"items\":[\"<food item 1>\",\"<food item 2>\",...],\n" +
                                    "  \"portion_size\":\"<weight or volume>\",\n" +
                                    "  \"calories\":\"<estimated kcal>\",\n" +
                                    "  \"macronutrients\":{\"carbohydrates\":\"g\",\"protein\":\"g\",\"fat\":\"g\"},\n" +
                                    "  \"water_content\":\"%\",\n" +
                                    "  \"vitamins\":{\"a\":\"%\",\"b_complex\":\"%\",\"c\":\"%\",\"d\":\"%\",\"e\":\"%\",\"k\":\"%\"},\n" +
                                    "  \"minerals\":{\"iron\":\"%\",\"calcium\":\"%\",\"magnesium\":\"%\",\"potassium\":\"%\",\"zinc\":\"%\"},\n" +
                                    "  \"confidence\":\"<0-100%>\"\n" +
                                    "}\n" +
                                    "\n" +
                                    "Guidelines  \n" +
                                    "- Reject non-food, raw ingredients only, or unclear images.  \n" +
                                    "- Provide best-effort estimates; do not guess cuisine or items you cannot identify.  \n" +
                                    "- Output must be valid JSON with no trailing commas or comments.")
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

        Map<String, Object> body = Map.of("contents", List.of(
                Map.of("parts", List.of(
                        Map.of("inlineData", Map.of(
                                "mimeType", imageDTO.getContentType(),
                                "data", Base64.getEncoder().encodeToString(imageDTO.getImageBytes())
                        )),
                        Map.of("text", String.format("\n" +
                                "You are a certified clinical nutritionist AI.\n" +
                                "Your task is to examine an image and decide, in two clearly-separated steps, whether it shows raw or semi-prepared food ingredients and, if so, to generate safe, health-aware recipe ideas that use only what is in the picture (or kitchen staples such as water, salt, pepper, oil and basic spices).\n" +
                                "STEP 1 – Image Classification\n" +
                                "• If the image does not contain recognisable raw/semi-prepared food ingredients (e.g. a person, pet, car, landscape, packaged ready-meal, restaurant dish, etc.), return exactly:\n" +
                                "{\n" +
                                "\"status\": \"Rejected\",\n" +
                                "\"reason\": \"Not an image of food ingredients\"\n" +
                                "}\n" +
                                "No extra fields, no explanations.\n" +
                                "STEP 2 – Ingredient Recognition & Recipe Generation (only when Step 1 passes)\n" +
                                "Return strictly valid JSON that follows the schema below.\n" +
                                "All numeric values must be realistic estimates; do not invent ingredients that are not visible.\n" +
                                "{\n" +
                                "\"status\": \"Accepted\",\n" +
                                "\"detected_ingredients\": [\n" +
                                "{\n" +
                                "\"name\": \"ingredient name (singular, title-case)\",\n" +
                                "\"confidence\": <0-100 percent>,\n" +
                                "\"portion_size\": \"approximate raw weight in g or ml\",\n" +
                                "\"macros_per_portion\": {\n" +
                                "\"calories\": \"kcal\",\n" +
                                "\"protein\": \"g\",\n" +
                                "\"carbohydrates\": \"g\",\n" +
                                "\"fat\": \"g\"\n" +
                                "}\n" +
                                "}\n" +
                                "],\n" +
                                "\"recipes\": [\n" +
                                "{\n" +
                                "\"type\": \"Meal | Snack | Drink | Salad | Soup\",\n" +
                                "\"name\": \"Recipe name\",\n" +
                                "\"description\": \"One-sentence summary of the dish and its health benefit\",\n" +
                                "\"ingredients_used\": [\"list only items visible in the image\"],\n" +
                                "\"instructions\": \"3–5 concise steps\",\n" +
                                "\"macros_per_serving\": {\n" +
                                "\"calories\": \"kcal\",\n" +
                                "\"protein\": \"g\",\n" +
                                "\"carbohydrates\": \"g\",\n" +
                                "\"fat\": \"g\"\n" +
                                "},\n" +
                                "\"suitable_for\": [\"e.g. low-sodium\", \"diabetic\", \"high-protein\"],\n" +
                                "\"recipe_id\": \"camelCaseUniqueId\"\n" +
                                "}\n" +
                                "]\n" +
                                "}\n" +
                                "Additional Rules\n" +
                                "\n" +
                                "    Provide 1–3 recipes that are practical in a home kitchen.\n" +
                                "    Explicitly consider the user’s stated health conditions (%s) and flag any recipe that may be unsuitable.\n" +
                                "    Use metric units only.\n" +
                                "    Keep description ≤ 120 characters and instructions ≤ 200 characters.\n" +
                                "\n", user.getHealthConditions().toString()))
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

    @Override
    public String logMeal(MealRequest mealRequest) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Meal meal = new Meal();

        log.info("request {}", mealRequest.toString());
        meal.setMealType(mealRequest.getMealType());
        meal.setLoggedAt(mealRequest.getLoggedAt());
        meal.setUser(user);
        meal.setItems(mealRequest.getItems().stream().map(item -> {
           Meal.MealItem mealItem = new Meal.MealItem();
           mealItem.setFoodName(item.getFoodName());
           mealItem.setQuantityInGrams(item.getQuantityInGrams());
           Meal.Macros macros = new Meal.Macros();

           macros.setCalories(item.getMacros().getCalories());
           macros.setProtein(item.getMacros().getProtein());
           macros.setFat(item.getMacros().getFat());
           macros.setCarbs(item.getMacros().getCarbs());
           mealItem.setMacros(macros);
           return mealItem;
        }).collect(Collectors.toList()));

        mealRepository.save(meal);

        return "Meal logged successfully";
    }

    public Page<Meal> getMeals(int pageNo, int pageSize){

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Pageable pageable = PageRequest.of(pageNo, pageSize);

        return mealRepository.findByUser(user.getId(), pageable);
    }
}
