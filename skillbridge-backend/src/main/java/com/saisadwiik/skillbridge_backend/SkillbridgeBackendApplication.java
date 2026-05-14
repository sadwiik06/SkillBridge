package com.saisadwiik.skillbridge_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource(value = "file:env.properties", ignoreResourceNotFound = true)
public class SkillbridgeBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SkillbridgeBackendApplication.class, args);
	}

}
