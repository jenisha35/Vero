package com.trustguard.dto;

import lombok.Data;

@Data
public class QrPayload {
    private String app;
    private String version;
    private String batchId;
    private String productId;
    private String companyId;
    private String signature;
}
