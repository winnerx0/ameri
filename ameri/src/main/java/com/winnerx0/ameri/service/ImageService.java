package com.winnerx0.ameri.service;

import com.winnerx0.ameri.dto.ImageDTO;
import com.winnerx0.ameri.dto.request.NutrientRequest;

public interface ImageService {

    ImageDTO getImageData(NutrientRequest nutritionRequest);
}
