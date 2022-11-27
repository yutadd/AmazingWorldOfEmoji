package com.yutadd.model.entity;


import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="likes")
@RequiredArgsConstructor
@Getter
@Setter
public class Like {
	@ManyToOne
	@JoinColumn(name="userid",referencedColumnName = "userid")
	private User user;
	@ManyToOne
	@JoinColumn(name="commentid",referencedColumnName = "commentid")
	private Comment comment;
	@Id
	private String likeid;
	@Override
	public boolean equals(Object obj) {
		if(obj instanceof Like) {
			Like l=(Like)obj;
			if(l.getComment().equals(comment)&&l.getUser().equals(user)) {
				return true;
			}
		}
		return false;
	}
	
}
