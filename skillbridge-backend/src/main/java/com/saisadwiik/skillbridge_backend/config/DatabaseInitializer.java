package com.saisadwiik.skillbridge_backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            String sql = "CREATE TABLE IF NOT EXISTS user_skills (" +
                         "user_id BIGINT NOT NULL, " +
                         "skill_name VARCHAR(255) NOT NULL, " +
                         "PRIMARY KEY (user_id, skill_name), " +
                         "CONSTRAINT fk_user_skills_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE" +
                         ")";
            jdbcTemplate.execute(sql);
            System.out.println("✅ DatabaseInitializer: Successfully verified/created user_skills table.");
        } catch (Exception e) {
            System.err.println("❌ DatabaseInitializer failed to create user_skills table: " + e.getMessage());
        }
    }
}
