package com.yutadd.model.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import  javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
@Entity
@Table(name="users")
@RequiredArgsConstructor
@Getter

@Setter
public class User {
	@NotBlank
	private String name;
	@Id
	@Column(unique=true)
	private String userid;
	@NotBlank
	private String password;
	private Date birth;
	@NotBlank
	@Column(unique=true)
	private String email;
}
