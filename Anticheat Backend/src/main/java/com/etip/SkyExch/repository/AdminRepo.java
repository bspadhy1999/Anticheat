package com.etip.SkyExch.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.etip.SkyExch.entity.Admin;

public interface AdminRepo extends MongoRepository<Admin, String> {

	Optional<Admin> findByuserName(String userName);

}
