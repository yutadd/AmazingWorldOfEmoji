package com.yutadd.model.entity;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import  javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import com.google.gson.annotations.Expose;

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
	@Expose
	private String name;
	@Id
	@Column(unique=true)
	@NotBlank
	@Expose
	private String userid;
	@Override
	public boolean equals(Object obj) {
		if(obj instanceof User) {
			User u=(User)obj;
			if(u.userid.equals(userid)) {
				return true;
			}
		}
		return false;
	}
	@NotBlank
	private String password;
	private Date birth;

	@Column(unique=true)
	@NotBlank
	private String email;
}
