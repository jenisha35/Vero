package com.trustguard.service;

import com.trustguard.dto.BatchReq;
import com.trustguard.model.Batch;
import com.trustguard.model.Code;
import com.trustguard.model.Product;
import com.trustguard.repository.BatchRepository;
import com.trustguard.repository.CodeRepository;
import com.trustguard.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class BatchService {

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CodeRepository codeRepository;

    @Transactional
    public java.util.Map<String, Object> createBatchAndCodes(BatchReq req) {
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (batchRepository.existsByBatchNumber(req.getBatchNumber())) {
            throw new RuntimeException("Batch number already exists");
        }

        Batch batch = new Batch();
        batch.setProduct(product);
        batch.setBatchNumber(req.getBatchNumber());
        batch.setQuantity(req.getQuantity());
        String qrPayload = "TRUSTGUARD|" + req.getBatchNumber();
        batch.setQrCodeData(qrPayload);
        
        batch = batchRepository.save(batch);

        List<Code> codesToSave = new ArrayList<>();
        for (int i = 0; i < req.getQuantity(); i++) {
            Code code = new Code();
            code.setBatch(batch);
            code.setStatus(Code.CodeStatus.UNUSED);
            if (req.getCustomCodes() != null && req.getCustomCodes().size() == req.getQuantity()) {
                code.setSerialCode(req.getCustomCodes().get(i));
            } else {
                String serialCode = "TG-" + product.getId() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                code.setSerialCode(serialCode);
            }
            codesToSave.add(code);
        }

        codeRepository.saveAll(codesToSave);
        
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("batch", batch);
        response.put("codes", codesToSave);
        return response;
    }
}
