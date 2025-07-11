package com.winnerx0.ameri.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
@ConfigurationProperties("cloudinary")
@Getter
@Setter
public class CloudinaryConfig {

    private String apiKey;
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary(){
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dngdooamm",
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
    }
}
