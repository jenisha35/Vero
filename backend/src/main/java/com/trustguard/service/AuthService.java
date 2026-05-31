package com.trustguard.service;

import com.trustguard.dto.AuthRequest;
import com.trustguard.dto.AuthResponse;
import com.trustguard.model.Company;
import com.trustguard.repository.CompanyRepository;
import com.trustguard.security.CustomUserDetailsService;
import com.trustguard.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(AuthRequest request) {
        if(companyRepository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("Email already registered!");
        }

        Company company = new Company();
        company.setName(request.getName());
        company.setEmail(request.getEmail());
        company.setPassword(passwordEncoder.encode(request.getPassword()));
        companyRepository.save(company);

        return login(request);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        Company company = companyRepository.findByEmail(request.getEmail()).get();

        return new AuthResponse(jwt, company.getId(), company.getName());
    }
}
