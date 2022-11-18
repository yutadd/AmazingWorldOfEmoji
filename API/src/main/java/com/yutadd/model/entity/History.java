package com.yutadd.model.entity;

import java.io.Serializable;
import java.sql.Time;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="history")
@RequiredArgsConstructor
@Getter
@Setter
@IdClass(HistoryKey.class)
public class History implements Serializable {
	
	private String cid;
	@Id
	private String uid;
	@Id
	private Time date;
}
