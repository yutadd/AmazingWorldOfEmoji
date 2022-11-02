package com.yutadd;
import java.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import  javax.persistence.Id;
import javax.persistence.SequenceGenerator;
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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "userid_seq")
    @SequenceGenerator(name = "userid_seq", sequenceName = "userid_seq", allocationSize = 1)
	private Long ID;
	@NotBlank
	private String password;
	private String[] sessionIDs;
	@NotBlank
	private LocalDate birth;
	@NotBlank
	private String email;
}
