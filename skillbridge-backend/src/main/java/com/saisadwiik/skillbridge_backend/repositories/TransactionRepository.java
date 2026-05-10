package com.saisadwiik.skillbridge_backend.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.saisadwiik.skillbridge_backend.models.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction,Long>{
    List<Transaction> findByUserIdOrderByTimestampDesc(Long userId);

}
