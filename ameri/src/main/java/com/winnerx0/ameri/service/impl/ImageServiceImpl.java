package com.winnerx0.ameri.service.impl;

import com.cloudinary.utils.ObjectUtils;
import com.winnerx0.ameri.config.CloudinaryConfig;
import com.winnerx0.ameri.dto.ImageDTO;
import com.winnerx0.ameri.dto.request.NutrientRequest;
import com.winnerx0.ameri.service.ImageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
@Slf4j
public class ImageServiceImpl implements ImageService {

    private final CloudinaryConfig cloudinaryConfig;

    public ImageServiceImpl(CloudinaryConfig cloudinaryConfig){
        this.cloudinaryConfig = cloudinaryConfig;
    }

    @Override
    public ImageDTO getImageData(NutrientRequest request) {
      try {
          File file = File.createTempFile("meal-", request.getFile().getOriginalFilename());

          byte[] imageBytes = request.getFile().getBytes();

          String contentType = request.getFile().getContentType();

          request.getFile().transferTo(file);

          log.info("image {}", file.getAbsoluteFile());

          cloudinaryConfig.cloudinary()
                  .uploader()
                  .upload(file, ObjectUtils.asMap(
                          "overwrite", false,
                          "use_filename", true)
                  );
          ImageDTO imageDTO = new ImageDTO();
          imageDTO.setImageBytes(imageBytes);
          imageDTO.setContentType(contentType);
          return imageDTO;
      } catch (IOException e) {
          throw new IllegalStateException(e);
      }
    }
}
