package com.trustguard.service;

import com.trustguard.dto.DashboardStatsResp;
import com.trustguard.model.Scan;
import com.trustguard.repository.ScanRepository;
import com.trustguard.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private ScanRepository scanRepository;

    @Autowired
    private ProductRepository productRepository;

    public DashboardStatsResp getStats(Long companyId) {
        List<Scan> scans = scanRepository.findAllByCompanyId(companyId);
        long totalScans = scans.size();
        long validScans = scans.stream().filter(s -> s.getStatus() == Scan.ScanStatus.VALID).count();
        long duplicateScans = scans.stream().filter(s -> s.getStatus() == Scan.ScanStatus.DUPLICATE_LOCAL || s.getStatus() == Scan.ScanStatus.DUPLICATE_SPOOFED).count();
        long fakeScans = scans.stream().filter(s -> s.getStatus() == Scan.ScanStatus.FAKE).count();
        long totalProducts = productRepository.findByCompanyId(companyId).size();

        DashboardStatsResp resp = new DashboardStatsResp();
        resp.setTotalScans(totalScans);
        resp.setValidScans(validScans);
        resp.setDuplicateScans(duplicateScans);
        resp.setFakeScans(fakeScans);
        resp.setTotalProducts(totalProducts);
        return resp;
    }
}
