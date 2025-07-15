package com.winnerx0.ameri.service;

import com.winnerx0.ameri.dto.ImageDTO;
import com.winnerx0.ameri.dto.request.NutritionRequest;

public interface ImageService {

    ImageDTO getImageData(NutritionRequest nutritionRequest);
}
