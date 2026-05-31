package com.trustguard.repository;

import com.trustguard.model.Code;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CodeRepository extends JpaRepository<Code, Long> {
    List<Code> findByBatchId(Long batchId);
    Optional<Code> findBySerialCode(String serialCode);
    boolean existsBySerialCode(String serialCode);
    long countByBatchId(Long batchId);
}
