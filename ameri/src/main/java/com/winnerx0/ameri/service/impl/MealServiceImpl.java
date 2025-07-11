package com.winnerx0.ameri.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.winnerx0.ameri.repository.MealRepository;
import com.winnerx0.ameri.service.MealService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
public class MealServiceImpl implements MealService {

    private final MealRepository mealRepository;
    private final Cloudinary cloudinary;

    public MealServiceImpl(MealRepository mealRepository, Cloudinary cloudinary) {
        this.mealRepository = mealRepository;
        this.cloudinary = cloudinary;
    }

    @Override
    @Async
    public void uploadPhoto(MultipartFile mealImage) {
        try {
            File file = File.createTempFile("meal-", mealImage.getOriginalFilename());

            mealImage.transferTo(file);

            log.info("image {}", file.getAbsoluteFile());
            file.deleteOnExit();

            Map map = cloudinary
                    .uploader()
                    .upload(file, ObjectUtils.asMap(
                            "overwrite", false,
                            "use_filename", true)
                    );

            log.info("map {}", map);
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
