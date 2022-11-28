package com.yutadd.model;

import com.google.gson.annotations.Expose;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class EmojiDetail {
	@Expose
	String path;
	@Expose
	String title;
	@Expose
	String userID;
	@Expose
	String userName;
	@Expose
	String type;
}
