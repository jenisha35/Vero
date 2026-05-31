package com.trustguard.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "scans")
@Data
@NoArgsConstructor
public class Scan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "code_id")
    @JsonIgnore
    private Code code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    @JsonIgnore
    private Batch batch;

    @Column(name = "scanned_serial")
    private String scannedSerial;

    @Column(name = "location_approx")
    private String locationApprox;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "ip_address")
    private String ipAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScanStatus status;

    @Column(name = "fingerprint_match_score")
    private Integer fingerprintMatchScore;

    @CreationTimestamp
    private LocalDateTime timestamp;

    @Column(name = "distance_from_previous_scan")
    private Double distanceFromPreviousScan;

    public enum ScanStatus {
        VALID,
        DUPLICATE_LOCAL,
        DUPLICATE_SPOOFED,
        FAKE
    }
}
