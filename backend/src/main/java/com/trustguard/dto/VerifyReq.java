package com.trustguard.dto;

import lombok.Data;

@Data
public class VerifyReq {
    private String serialCode;
    private String locationApprox;
    private String ipAddress;
    private Double latitude;
    private Double longitude;
}
