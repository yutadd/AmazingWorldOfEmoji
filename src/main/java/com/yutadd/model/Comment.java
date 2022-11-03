package com.yutadd.model;

import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
	@Entity
	@Table(name="Comment")
	@AllArgsConstructor
	@Getter
	@Setter
public class Comment {
	@NotBlank
	private String UserID;
	@Id
	private String commentID;
	@NotBlank
	private String text;
	@NotBlank
	private LocalDate time;
	
}
