package com.yutadd;
import java.util.Date;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.validation.constraints.NotBlank;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
@Data
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
