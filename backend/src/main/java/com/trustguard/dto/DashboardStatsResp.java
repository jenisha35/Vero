package com.trustguard.dto;

import lombok.Data;

@Data
public class DashboardStatsResp {
    private long totalScans;
    private long validScans;
    private long duplicateScans;
    private long fakeScans;
    private long totalProducts;
}
