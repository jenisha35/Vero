package com.trustguard.controller;

import com.trustguard.dto.BatchReq;
import com.trustguard.model.Batch;
import com.trustguard.model.Product;
import com.trustguard.repository.ProductRepository;
import com.trustguard.security.CustomUserDetails;
import com.trustguard.service.BatchService;
import com.trustguard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/company")
public class CompanyController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BatchService batchService;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private com.trustguard.repository.AlertRepository alertRepository;

    @Autowired
    private com.trustguard.repository.CodeRepository codeRepository;

    @Autowired
    private com.trustguard.repository.BatchRepository batchRepository;

    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody Product product) {
        product.setCompany(userDetails.getCompany());
        return ResponseEntity.ok(productRepository.save(product));
    }

    @GetMapping("/products")
    public ResponseEntity<?> getProducts(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Product> products = productRepository.findByCompanyId(userDetails.getCompany().getId());
        return ResponseEntity.ok(products);
    }

    @PostMapping("/batch")
    public ResponseEntity<?> createBatch(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody BatchReq req) {
        Product p = productRepository.findById(req.getProductId()).orElseThrow();
        if(!p.getCompany().getId().equals(userDetails.getCompany().getId())) {
             return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(batchService.createBatchAndCodes(req));
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(dashboardService.getStats(userDetails.getCompany().getId()));
    }

    @GetMapping("/alerts")
    public ResponseEntity<?> getAlerts(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<com.trustguard.model.Alert> alerts = alertRepository.findByCompanyId(userDetails.getCompany().getId());
        List<com.trustguard.dto.AlertDTO> dtos = alerts.stream().map(a -> {
            String prodName = "Unknown";
            String codeSerial = "Unknown";
            String loc = "Unknown";
            if (a.getScan() != null) {
                codeSerial = a.getScan().getScannedSerial();
                if (a.getScan().getBatch() != null && a.getScan().getBatch().getProduct() != null) {
                    prodName = a.getScan().getBatch().getProduct().getName();
                }
                if (a.getScan().getLocationApprox() != null) {
                    loc = a.getScan().getLocationApprox();
                }
            }
            
            String risk = "LOW";
            if (a.getType() == com.trustguard.model.Alert.AlertType.HIGH_RISK_LOCATION) risk = "HIGH";
            else if (a.getType() == com.trustguard.model.Alert.AlertType.DUPLICATE_USAGE) risk = "MEDIUM";
            else if (a.getType() == com.trustguard.model.Alert.AlertType.RAPID_SCANS) risk = "HIGH";
            
            return com.trustguard.dto.AlertDTO.builder()
                .id(a.getId())
                .type(a.getType().name())
                .productName(prodName)
                .serialCode(codeSerial)
                .location(loc)
                .riskLevel(risk)
                .resolved(a.getResolved())
                .createdAt(a.getCreatedAt())
                .build();
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/codes/{identifier}")
    public ResponseEntity<?> getCodesByBatch(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable String identifier) {
        Long id = null;
        try {
            id = Long.parseLong(identifier);
        } catch (NumberFormatException e) {
            // Not a numeric ID, we'll try searching by batch number
        }

        if (id != null) {
            List<com.trustguard.model.Code> codes = codeRepository.findByBatchId(id);
            if (!codes.isEmpty()) {
                return ResponseEntity.ok(codes);
            }
        }

        // Try searching by Batch Number string
        return batchRepository.findByBatchNumber(identifier)
                .map(batch -> ResponseEntity.ok(codeRepository.findByBatchId(batch.getId())))
                .orElse(ResponseEntity.ok(java.util.Collections.emptyList()));
    }
}
