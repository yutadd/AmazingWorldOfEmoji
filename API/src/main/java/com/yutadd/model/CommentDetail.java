package com.yutadd.model;

import com.yutadd.model.entity.Comment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentDetail {
	private Comment comment;
	private long likeAmount;
	private String userName;
}
