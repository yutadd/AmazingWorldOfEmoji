package com.yutadd.model.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
	@Entity
	@Table(name="comments")
	@RequiredArgsConstructor
	@Getter
	@Setter
public class Comment implements Comparable<Comment>{
	@NotBlank
	private String userID;
	@Id
	@Column(unique=true)
	private String commentID;
	private String file1;
	private String file2;
	private String file3;
	private String file4;
	
	@NotBlank
	private String text;
	private Date time;
	private long likes;
	@Override
	public int compareTo(Comment c) {
		return c.time.compareTo(time);
	}
}
