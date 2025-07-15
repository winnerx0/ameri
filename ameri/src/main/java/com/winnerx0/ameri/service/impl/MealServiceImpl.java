package com.winnerx0.ameri.service.impl;

import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.winnerx0.ameri.config.CloudinaryConfig;
import com.winnerx0.ameri.dto.request.AIRequest;
import com.winnerx0.ameri.service.MealService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Slf4j
@Service
public class MealServiceImpl implements MealService {

    private final RestTemplate restTemplate;

    private final CloudinaryConfig cloudinaryConfig;

    @Value("${gemini.api-key}")
    private String geminiApiKey;

    public MealServiceImpl(RestTemplate restTemplate, CloudinaryConfig cloudinaryConfig) {
        this.restTemplate = restTemplate;
        this.cloudinaryConfig = cloudinaryConfig;
    }

    @Override
    public JsonNode getMealMetadata(AIRequest request) {
//
//        if(!Objects.equals(request.getFile().getContentType(), "image/**")){
//            throw new IllegalArgumentException("Only images allowed");
//        }

        try {

            File file = File.createTempFile("meal-", request.getFile().getOriginalFilename());

            byte[] imageBytes = request.getFile().getBytes();

            String contentType = request.getFile().getContentType();

            request.getFile().transferTo(file);

            log.info("image {}", file.getAbsoluteFile());

            Map map = cloudinaryConfig.cloudinary()
                    .uploader()
                    .upload(file, ObjectUtils.asMap(
                            "overwrite", false,
                            "use_filename", true)
                    );

            log.info("map {}", map);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-goog-api-key", geminiApiKey);

            log.info("base64 {}", Base64.getEncoder().encodeToString(imageBytes));

            assert contentType != null;
            Map<String, Object> body = Map.of("contents", List.of(
                    Map.of("parts", List.of(
                            Map.of("inlineData", Map.of(
                                    "mimeType", contentType,
                                    "data", Base64.getEncoder().encodeToString(imageBytes)
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
                                    "      \"meal_type\": \"breakfast | lunch | dinner | snack\",\n" +
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
            JsonNode response = restTemplate.postForObject("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", httpEntity, JsonNode.class);


            assert response != null;
            log.info("response {}", response.get("candidates").get(0).get("content").get("parts").get(0).get("text").asText().replaceAll("```json", "").replaceAll("```", ""));

            ObjectMapper objectMapper = new ObjectMapper();

            return objectMapper.readValue(response.get("candidates").get(0).get("content").get("parts").get(0).get("text").asText().replaceAll("```json", "").replaceAll("```", ""), JsonNode.class);
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }

    @Override
    public JsonNode createRecipe() {
        return null;
    }
}
