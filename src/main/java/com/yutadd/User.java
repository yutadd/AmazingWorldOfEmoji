package com.yutadd;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import  javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
@Entity
@Table(name="UserTable")
@RequiredArgsConstructor
@Getter

@Setter
public class User {
	@NotBlank
	private String name;
	@Id
	@Column(unique=true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long UserID;
	@NotBlank
	private String password;
	private String birth;
	@NotBlank
	@Column(unique=true)
	private String email;
}
