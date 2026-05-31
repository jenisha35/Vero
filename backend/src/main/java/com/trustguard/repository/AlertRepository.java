package com.trustguard.repository;

import com.trustguard.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByCompanyId(Long companyId);
    long countByCompanyIdAndResolvedFalse(Long companyId);
}
