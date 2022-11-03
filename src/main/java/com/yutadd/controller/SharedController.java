package com.yutadd.controller;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Random;
import java.util.Set;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.yutadd.model.Comment;
import com.yutadd.repository.CommentRepository;
import com.yutadd.repository.LikeRepository;
import com.yutadd.repository.SessionIDRepository;
import com.google.gson.Gson;
import com.yutadd.repository.UserRepository;

@Controller
@RequestMapping(value="/api/share/")
public class SharedController {
	@Autowired
	private UserRepository urepository;
	@Autowired
	private SessionIDRepository srepository;
	@Autowired
	private CommentRepository crepository;
	@Autowired
	private LikeRepository lrepository;
	@RequestMapping(value="/post/message", method=RequestMethod.POST)
	public ResponseEntity<String> addComment(@RequestParam("message") String message,HttpSession session) {
		String uid=srepository.findById(session.getId()).get().getUserID();
		Random rn = new Random();
		BigInteger cID= new BigInteger(255,rn);
		Comment c=new Comment();
		c.setUserID(uid);
		c.setCommentID(cID.toString(16));
		c.setText(message);
		c.setUserName(urepository.findById(uid).get().getName());
		c.setTime(Date.valueOf(LocalDate.now()));
		crepository.save(c);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	@RequestMapping(value="/get/posts",method=RequestMethod.GET)
	@ResponseBody
	public String getNewPosts(HttpSession session) {
		Set<Comment> newComments=crepository.findRecently(Date.valueOf(LocalDate.now().minusDays(1)));
		Gson gson = new Gson();
		String json = gson.toJson(newComments);
		System.out.println(json);
		return json;
	}
	
	@RequestMapping(value="/post/emoji", method=RequestMethod.POST)
	public ResponseEntity<String> addEmoji(@RequestParam("image") MultipartFile imageFile,@RequestParam("title") String title,HttpSession session) {
		if(srepository.existsById(session.getId())) {
			if(title.matches("[a-z]*[A-Z]*")) {
				Path filePath=Paths.get(srepository.findById(session.getId())+File.separator+title);
				try {
					OutputStream output=Files.newOutputStream(filePath);
					output.write(imageFile.getBytes());
					output.flush();
					return new ResponseEntity<>(HttpStatus.ACCEPTED);
				} catch (IOException e) {
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getLocalizedMessage());
				}
			}else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("タイトルに不正な値が入っています。");
			}
		}else {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("ログインして実行してください");
		}
	}
}
