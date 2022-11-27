package com.yutadd.model.entity;

import java.io.Serializable;

import javax.persistence.Id;

import lombok.Data;

@Data
public class LikeKey  implements Serializable{
	private String likeid;
}
