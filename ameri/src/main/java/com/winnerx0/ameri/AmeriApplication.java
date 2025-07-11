package com.winnerx0.ameri;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AmeriApplication {

	public static void main(String[] args) {
		SpringApplication.run(AmeriApplication.class, args);
	}

}
