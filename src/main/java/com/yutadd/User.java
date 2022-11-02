package com.yutadd;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import  javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
@Entity
@Table(name="UserTable")
@AllArgsConstructor
public class User {
	@NotBlank
	private String name;
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long ID;
	@NotBlank
	private String password;
	private String sessions;
	@NotBlank
	private Date birth; 
}
