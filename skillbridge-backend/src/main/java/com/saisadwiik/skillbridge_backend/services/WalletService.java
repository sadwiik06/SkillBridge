package com.saisadwiik.skillbridge_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.saisadwiik.skillbridge_backend.models.User;
import com.saisadwiik.skillbridge_backend.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class WalletService {
    @Autowired
    private UserRepository userRepository;
    @Transactional
    public void allocateFunds(String email, Double amount) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (amount <= 0) throw new RuntimeException("Invalid amount");

        Double currentBalance = user.getTotalBalance();
        if (currentBalance == null) currentBalance = 0.0;
        
        user.setTotalBalance(currentBalance + amount);
        
        if (user.getLockedBalance() == null) {
            user.setLockedBalance(0.0);
        }
        
        userRepository.save(user);
    }

}
