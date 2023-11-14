package com.etip.SkyExch.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.etip.SkyExch.entity.MatchBetBean;
import com.fasterxml.jackson.databind.JsonNode;

public interface MatchBetBeanRepo extends MongoRepository<MatchBetBean, String> {

	MatchBetBean findBybetId(String betId);

}
