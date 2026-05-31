package com.trustguard.repository;

import com.trustguard.model.Scan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanRepository extends JpaRepository<Scan, Long> {
    List<Scan> findByCodeIdOrderByTimestampDesc(Long codeId);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM Scan s WHERE s.code.batch.product.company.id = :companyId")
    List<Scan> findAllByCompanyId(@org.springframework.data.repository.query.Param("companyId") Long companyId);
}
