package com.etip.SkyExch.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.etip.SkyExch.entity.Website;

public interface WebsiteRepo extends MongoRepository<Website, String> {

	Website findByname(String name);

	List<Website> findByStatus(boolean status);

	Website findByurl(String url);


}
