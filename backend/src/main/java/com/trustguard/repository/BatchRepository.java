package com.trustguard.repository;

import com.trustguard.model.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import java.util.Optional;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findByProductId(Long productId);
    boolean existsByBatchNumber(String batchNumber);
    Optional<Batch> findByBatchNumber(String batchNumber);
}
