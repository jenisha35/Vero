package com.trustguard.security;

import com.trustguard.model.Company;
import com.trustguard.repository.CompanyRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CompanyRepository companyRepository;

    public CustomUserDetailsService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Company company = companyRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Company not found with email: " + email));
        return new CustomUserDetails(company);
    }
}
