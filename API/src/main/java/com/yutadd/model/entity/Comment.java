package com.yutadd.model.entity;

import java.io.File;
import java.io.Serializable;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
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
public class Comment implements Comparable<Comment>,Serializable{
	@ManyToOne
	@JoinColumn(name="userid",referencedColumnName = "userid")
	private User user;
	@Id
	@NotBlank
	@Column(unique=true)
	private String commentid;
	@NotBlank
	private String text;
	private Timestamp time;
	@Override
	public int compareTo(Comment c) {
		return c.time.compareTo(time);
	}
	@Override
	public boolean equals(Object obj) {
		if(obj instanceof Comment) {
			Comment c=(Comment) obj;
			if(c.commentid.equals(commentid)) {
				return true;
			}
		}
		return false;
	}
}
