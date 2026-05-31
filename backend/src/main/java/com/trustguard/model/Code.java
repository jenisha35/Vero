package com.trustguard.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "codes")
@Data
@NoArgsConstructor
public class Code {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    @JsonIgnore
    private Batch batch;

    @Column(name = "serial_code", nullable = false, unique = true)
    private String serialCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CodeStatus status;

    @Column(name = "is_used")
    private Boolean isUsed = false;

    @Column(name = "first_scan_latitude")
    private Double firstScanLatitude;

    @Column(name = "first_scan_longitude")
    private Double firstScanLongitude;

    @Column(name = "first_scan_time")
    private LocalDateTime firstScanTime;

    @Column(name = "scan_count")
    private Integer scanCount = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;
    
    public enum CodeStatus {
        UNUSED,
        USED
    }
}
