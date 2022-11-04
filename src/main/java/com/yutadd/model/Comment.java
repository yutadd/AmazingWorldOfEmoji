package com.yutadd.model;

import java.sql.Date;

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
