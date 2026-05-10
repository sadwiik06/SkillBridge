package com.saisadwiik.skillbridge_backend.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saisadwiik.skillbridge_backend.models.Transaction;
import com.saisadwiik.skillbridge_backend.models.User;
import com.saisadwiik.skillbridge_backend.repositories.TransactionRepository;
import com.saisadwiik.skillbridge_backend.repositories.UserRepository;

@RestController
@org.springframework.web.bind.annotation.RequestMapping("/api/transactions")
public class TransactionController {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private UserRepository userRepository;
    @GetMapping("/my-transactions")
    public ResponseEntity<List<Transaction>> getMyHistory(Principal principal){
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(transactionRepository.findByUserIdOrderByTimestampDesc(user.getId()));
    }

}
