package com.etip.SkyExch.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchBetBean {
	
	private String id;
	private Integer sportId;
	private String matchName;
	private String sourceId;
	private String sourceBetType;
	private String userid;
	private String userWebsite;
	private String mainWebiste;
	private String selectionName;
	private Double odds;
	private Double price;
	private Long stake;
	private Double pnl;
	private Double liability;
	private String ip;
	private String placeTime;
	private Long placeTimeLong;
	private Integer status;
	private String betId;

}
