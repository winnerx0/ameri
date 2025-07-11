package com.winnerx0.ameri.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface MealService {


    void uploadPhoto(MultipartFile file);
}
