package com.etip.SkyExch.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.etip.SkyExch.entity.TokenResponse;

public interface TokenResponseRepo extends MongoRepository<TokenResponse, String> {

	TokenResponse findByipAddress(String remoteAddr);

	void deleteByipAddress(String remoteAddr);

	void deleteByIpAddressAndUserName(String remoteAddr, String userName);

	TokenResponse findByIpAddressAndUserName(String remoteAddr, String userName);


}
