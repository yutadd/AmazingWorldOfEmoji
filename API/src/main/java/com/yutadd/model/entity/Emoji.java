package com.yutadd.model.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import com.google.gson.annotations.Expose;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="emojis")
@RequiredArgsConstructor
@Getter
@Setter
public class Emoji {
	@ManyToOne
	@JoinColumn(name="userid",referencedColumnName = "userid")
	@Expose
	private User user;
	@NotBlank
	@Expose
	private String title;
	@NotBlank
	@Expose
	private String type;
	@Id
	@NotBlank
	@Expose
	private String path;
}
