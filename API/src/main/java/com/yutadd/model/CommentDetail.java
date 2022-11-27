package com.yutadd.model;



import com.yutadd.model.entity.Comment;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CommentDetail {
	Comment commentInfo;
	private String username;
	private String userid;
	private FileDetail files;
	private long likes;
	private String liked;
}
