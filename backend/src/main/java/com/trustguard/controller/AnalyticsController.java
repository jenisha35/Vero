package com.trustguard.controller;

import com.trustguard.repository.AlertRepository;
import com.trustguard.repository.ScanRepository;
import com.trustguard.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/company/analytics")
public class AnalyticsController {

    @Autowired
    private AlertRepository alertRepository;
    
    @Autowired
    private ScanRepository scanRepository;

    @GetMapping
    public ResponseEntity<?> getAnalytics(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long companyId = userDetails.getCompany().getId();
        
        long totalAlerts = alertRepository.countByCompanyIdAndResolvedFalse(companyId);
        long totalScans = scanRepository.count(); // Simplified for MVP (in reality, joined via company->product->batch->code)
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAlerts", totalAlerts);
        stats.put("totalScans", totalScans);
        stats.put("alerts", alertRepository.findByCompanyId(companyId));
        
        return ResponseEntity.ok(stats);
    }
}
