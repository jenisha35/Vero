package com.trustguard.dto;

import com.trustguard.model.Scan.ScanStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VerifyRes {
    private ScanStatus status;
    private String message;
    private String productName;
    private String manufacturer;
    private Integer fingerprintMatchScore;
    private Double distance;
}
