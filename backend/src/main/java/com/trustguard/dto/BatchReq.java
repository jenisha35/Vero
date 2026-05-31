package com.trustguard.dto;

import lombok.Data;

@Data
public class BatchReq {
    private Long productId;
    private String batchNumber;
    private Integer quantity;
    private java.util.List<String> customCodes;
}
