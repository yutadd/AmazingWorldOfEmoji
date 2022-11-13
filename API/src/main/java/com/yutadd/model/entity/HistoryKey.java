package com.yutadd.model.entity;

import java.io.Serializable;

import javax.persistence.Id;

import lombok.Data;

@Data
public class HistoryKey implements Serializable{
	private String cid;
	private String uid;
}
