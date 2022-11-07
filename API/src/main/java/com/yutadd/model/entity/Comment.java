package com.yutadd.model.entity;

import java.sql.Date;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
	@Entity
	@Table(name="comments")
	@RequiredArgsConstructor
	@Getter
	@Setter
public class Comment implements Comparable<Comment>{
		
	@NotBlank
	private String userID;
	@Id
	@Column(unique=true)
	private String commentID;
	@NotBlank
	private String text;
	private Date time;
	@Override
	public int compareTo(Comment c) {
		return c.time.compareTo(time);
	}
}
