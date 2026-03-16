package com.WTFCapestone.Capestone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableAsync
@EnableScheduling
@SpringBootApplication(scanBasePackages = "com.WTFCapestone")
public class CapestoneApplication {

	public static void main(String[] args) {
		SpringApplication.run(CapestoneApplication.class, args);
	}

}
