package com.yutadd.model.entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
@Entity
@Table(name="filecontainer")
@RequiredArgsConstructor
@Getter
@Setter
public class FileContainer implements Serializable {
	@Id
	@NotBlank
	String commentID;
	String file1;
	String file2;
	String file3;
	String file4;
}
