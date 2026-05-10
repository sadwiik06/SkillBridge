package com.saisadwiik.skillbridge_backend.controllers;

import com.saisadwiik.skillbridge_backend.services.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
public class AIController {
    @Autowired
    private GeminiService geminiService;

    @PostMapping("/suggest")
    public ResponseEntity<?> getSuggestions(@RequestBody Map<String,Object> request){
        String description=(String) request.get("description");
        Double budget=Double.valueOf(request.get("budget").toString());
        if(description == null || budget <= 0){
            return ResponseEntity.badRequest().body("Description and budget are required");

        }
        String jsonResponse=geminiService.getMilestoneSuggestions(description,budget);
        if(jsonResponse.startsWith("Error:")){
            return ResponseEntity.internalServerError().body(jsonResponse);
        }
        String cleanedJson=jsonResponse.replace("```json","").replace("```","").trim();
        return ResponseEntity.ok(cleanedJson);
        

    }


}
