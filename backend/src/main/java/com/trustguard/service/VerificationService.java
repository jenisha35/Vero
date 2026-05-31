package com.trustguard.service;

import com.trustguard.dto.VerifyReq;
import com.trustguard.dto.VerifyRes;
import com.trustguard.model.*;
import com.trustguard.repository.AlertRepository;
import com.trustguard.repository.CodeRepository;
import com.trustguard.repository.ScanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Random;

@Service
public class VerificationService {

    @Autowired
    private CodeRepository codeRepository;

    @Autowired
    private ScanRepository scanRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private com.trustguard.repository.BatchRepository batchRepository;

    @Transactional
    public boolean validateQr(com.trustguard.dto.QrPayload payload) {
        if (!"TRUSTGUARD".equals(payload.getApp())) return false;
        
        String secretKey = "TRUSTGUARD_SECRET_KEY_2026";
        String rawData = payload.getBatchId() + payload.getProductId() + secretKey;
        
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawData.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            String expectedSignature = hexString.toString().substring(0, 10).toUpperCase();
            return expectedSignature.equals(payload.getSignature());
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public VerifyRes verifyCode(String batchNumber, VerifyReq req) {
        Optional<Batch> batchOpt = batchRepository.findByBatchNumber(batchNumber);
        if (batchOpt.isEmpty()) {
            return VerifyRes.builder()
                    .status(Scan.ScanStatus.FAKE)
                    .message("Invalid QR code. Product batch does not exist.")
                    .build();
        }
        Batch batch = batchOpt.get();

        Optional<Code> codeOpt = codeRepository.findBySerialCode(req.getSerialCode());

        Scan scan = new Scan();
        scan.setBatch(batch);
        scan.setScannedSerial(req.getSerialCode());
        scan.setIpAddress(req.getIpAddress());
        scan.setLocationApprox(req.getLocationApprox());
        scan.setLatitude(req.getLatitude());
        scan.setLongitude(req.getLongitude());
        scan.setFingerprintMatchScore(80 + new Random().nextInt(21));

        if (codeOpt.isEmpty() || !codeOpt.get().getBatch().getBatchNumber().equals(batchNumber)) {
            scan.setStatus(Scan.ScanStatus.FAKE);
            scanRepository.save(scan);

            return VerifyRes.builder()
                    .status(Scan.ScanStatus.FAKE)
                    .message(codeOpt.isEmpty() ? "Code does not exist. Potential counterfeit." : "Code does not belong to this batch. Potential counterfeit.")
                    .build();
        }

        Code code = codeOpt.get();
        scan.setCode(code);

        if (code.getStatus() == Code.CodeStatus.UNUSED) {
            code.setStatus(Code.CodeStatus.USED);
            code.setIsUsed(true);
            code.setScanCount(1);
            code.setFirstScanLatitude(req.getLatitude());
            code.setFirstScanLongitude(req.getLongitude());
            code.setFirstScanTime(java.time.LocalDateTime.now());
            codeRepository.save(code);
            
            scan.setStatus(Scan.ScanStatus.VALID);
            scanRepository.save(scan);

            return VerifyRes.builder()
                    .status(Scan.ScanStatus.VALID)
                    .message("Product is authentic.")
                    .productName(batch.getProduct().getName())
                    .manufacturer(batch.getProduct().getManufacturerDetails())
                    .fingerprintMatchScore(scan.getFingerprintMatchScore())
                    .build();
        } else {
            // DUPLICATE FLOW START
            double newLat = req.getLatitude() != null ? req.getLatitude() : 0.0;
            double newLon = req.getLongitude() != null ? req.getLongitude() : 0.0;
            
            boolean isSpoofed = false;
            java.util.List<Scan> previousScans = scanRepository.findByCodeIdOrderByTimestampDesc(code.getId());
            
            if (!previousScans.isEmpty()) {
                // Get oldest scan to find original location
                Scan originalScan = previousScans.get(previousScans.size() - 1);
                double originalLat = originalScan.getLatitude() != null ? originalScan.getLatitude() : 0.0;
                double originalLon = originalScan.getLongitude() != null ? originalScan.getLongitude() : 0.0;
                
                // If original had valid coordinates and new has valid coordinates
                if (originalLat != 0.0 && originalLon != 0.0 && newLat != 0.0 && newLon != 0.0) {
                    double distance = calculateHaversineDistance(originalLat, originalLon, newLat, newLon);
                    scan.setDistanceFromPreviousScan(distance);
                    if (distance > 100) {
                        isSpoofed = true; // Over 100 meters
                    }
                } else if (newLat != 0.0 || originalLat != 0.0) {
                    // One has location and other doesn't, assuming spoofed for security
                    isSpoofed = true;
                }
            }

            code.setScanCount(code.getScanCount() + 1);
            codeRepository.save(code);

            Scan.ScanStatus dupStatus = isSpoofed ? Scan.ScanStatus.DUPLICATE_SPOOFED : Scan.ScanStatus.DUPLICATE_LOCAL;
            scan.setStatus(dupStatus);
            scan = scanRepository.save(scan);

            boolean isLocationAnomaly = isSpoofed;

            // Create alert for company
            Alert alert = new Alert();
            alert.setCompany(batch.getProduct().getCompany());
            alert.setScan(scan);
            alert.setType(isLocationAnomaly ? Alert.AlertType.HIGH_RISK_LOCATION : Alert.AlertType.DUPLICATE_USAGE);
            alertRepository.save(alert);

            return VerifyRes.builder()
                    .status(dupStatus)
                    .message(isLocationAnomaly 
                        ? "Fake Product - Code reused in different location." 
                        : "Product already verified (same location).")
                    .productName(batch.getProduct().getName())
                    .manufacturer(batch.getProduct().getManufacturerDetails())
                    .fingerprintMatchScore(scan.getFingerprintMatchScore())
                    .distance(scan.getDistanceFromPreviousScan())
                    .build();
        }
    }

    // Haversine formula to calculate distance in meters
    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Radius of the earth in meters
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
