package com.yutadd.model;



import com.google.gson.annotations.Expose;
import com.yutadd.model.entity.Comment;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CommentDetail {
	@Expose
	Comment commentInfo;
	@Expose
	private String username;
	@Expose
	private String userid;
	@Expose
	private FileDetail files;
	@Expose
	private long likes;
	@Expose
	private String liked;
}
