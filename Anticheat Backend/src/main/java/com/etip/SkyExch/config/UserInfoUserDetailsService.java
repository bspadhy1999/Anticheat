package com.etip.SkyExch.config;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.etip.SkyExch.entity.Admin;
import com.etip.SkyExch.repository.AdminRepo;

@Component
public class UserInfoUserDetailsService implements UserDetailsService {
	
	@Autowired
	private AdminRepo adminRepo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<Admin> adminInfo = adminRepo.findByuserName(username);
		return adminInfo.map(UserInfoUserDetails::new).orElseThrow(() -> new UsernameNotFoundException("user not found "+username));
		
	}
	
	
}
