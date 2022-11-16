package com.yutadd.model.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="emojis")
@RequiredArgsConstructor
@Getter
@Setter
public class Emoji {
	@NotBlank
	private String userID;
	@NotBlank
	private String title;
	@NotBlank
	private String type;
	@Id
	@NotBlank
	private String path;
	private long popularity;
}
