package com.WTFCapestone.Capestone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class CapestoneApplication {

	public static void main(String[] args) {
		SpringApplication.run(CapestoneApplication.class, args);
	}

}
