package com.yutadd.model.entity;

import java.io.Serializable;
import java.sql.Time;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
	@ManyToOne
	@JoinColumn(name="commentid",referencedColumnName = "commentid")
	private Comment comment;
	@ManyToOne
	@JoinColumn(name="userid",referencedColumnName = "userid")
	private User user;
	private Time time;
	@Id
	private String id;
}
