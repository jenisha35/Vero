package com.trustguard.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AlertDTO {
    private Long id;
    private String type;
    private String productName;
    private String serialCode;
    private String location;
    private String riskLevel;
    private Boolean resolved;
    private LocalDateTime createdAt;
}
