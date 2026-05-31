package com.trustguard.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "batches")
@Data
@NoArgsConstructor
public class Batch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product;

    @Column(name = "batch_number", nullable = false, unique = true)
    private String batchNumber;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "qr_code_data", columnDefinition = "TEXT")
    private String qrCodeData;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
