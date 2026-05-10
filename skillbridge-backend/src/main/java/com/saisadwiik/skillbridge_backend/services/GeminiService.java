package com.saisadwiik.skillbridge_backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {
    @Value("${gemini.api.key}")
    private String apiKey;
    private final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    public String getMilestoneSuggestions(String description, Double budget) {
        RestTemplate restTemplate = new RestTemplate();
        String url = GEMINI_URL + apiKey;
        String systemPrompt = String.format("Act as a technical project manager. " +
        "Task: Break down this freelance project into 2 to 4 logical milestones based on the complexity and budget. " +
        "Project : [Description:%s] " +
        "Budget: $%.2f " +
        "Rules: " +
        "1. The number of milestones should scale with the budget (e.g., fewer for small tasks, more for complex tasks). " +
        "2. The sum of all milestone 'amount' should be equal exactly to the budget %.2f. " +
        "3. Output ONLY a raw JSON array : [{\"title\":\"string\",\"description\":\"string\",\"amount\":number}]. " +
        "4. No conversational text or markdown.",
                description, budget, budget
        );

        Map<String, Object> requestBody = Map.of("contents", List.of(
                Map.of("parts", List.of(
                        Map.of("text", systemPrompt)
                ))
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            List candidates = (List) response.getBody().get("candidates");
            Map candidate = (Map) candidates.get(0);
            Map content = (Map) candidate.get("content");
            List parts = (List) content.get("parts");
            Map part = (Map) parts.get(0);
            return (String) part.get("text");

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: Gemini API call failed. Details: " + e.getMessage();
        }
    }
}

