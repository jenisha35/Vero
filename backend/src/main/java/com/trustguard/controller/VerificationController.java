package com.trustguard.controller;

import com.trustguard.dto.VerifyReq;
import com.trustguard.service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/verify")
public class VerificationController {

    @Autowired
    private VerificationService verificationService;

    @PostMapping("/{batchNumber}")
    public ResponseEntity<?> verifyProduct(@PathVariable String batchNumber, @RequestBody VerifyReq req) {
        return ResponseEntity.ok(verificationService.verifyCode(batchNumber, req));
    }

    @PostMapping("/qr")
    public ResponseEntity<?> validateQrPayload(@RequestBody com.trustguard.dto.QrPayload payload) {
        boolean isValid = verificationService.validateQr(payload);
        if (isValid) {
            return ResponseEntity.ok(java.util.Map.of("valid", true));
        } else {
            return ResponseEntity.status(400).body(java.util.Map.of("valid", false, "message", "Invalid TrustGuard QR Signature"));
        }
    }
}
