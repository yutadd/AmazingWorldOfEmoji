package com.yutadd.model;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
	@Entity
	@Table(name="Comment")
	@RequiredArgsConstructor
	@Getter
	@Setter
public class Comment {
	@NotBlank
	private String userID;
	@NotBlank
	private String userName;
	@Id
	@Column(unique=true)
	private String commentID;
	@NotBlank
	private String text;
	private Date time;
	
}
