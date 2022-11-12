package com.yutadd.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.regex.Pattern;

import javax.servlet.http.HttpSession;

import org.apache.commons.io.IOUtils;
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
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.google.gson.Gson;
import com.yutadd.model.EmojiDetail;
import com.yutadd.model.UserDetail;
import com.yutadd.model.entity.Comment;
import com.yutadd.model.entity.Emoji;
import com.yutadd.model.entity.Like;
import com.yutadd.model.entity.User;
import com.yutadd.repository.CommentRepository;
import com.yutadd.repository.EmojiRepository;
import com.yutadd.repository.LikeRepository;
import com.yutadd.repository.SessionIDRepository;
import com.yutadd.repository.UserRepository;

@Controller
@RequestMapping(value="/api/share/")
public class SharedController extends ResponseEntityExceptionHandler {
	@Autowired
	private EmojiRepository erepository;
	@Autowired
	private UserRepository urepository;
	@Autowired
	private SessionIDRepository srepository;
	@Autowired
	private CommentRepository crepository;
	@Autowired
	private LikeRepository lrepository;
	@RequestMapping(value="/post/message", method=RequestMethod.POST)
	public ResponseEntity<String> addComment(@RequestParam("message")String message,@RequestParam("files")String files,HttpSession session) {
		try {
			String[] fileargs=files.split(Pattern.quote(";"));
			String uid=srepository.findById(session.getId()).get().getUserID();
			Random rn = new Random();
			BigInteger cID= new BigInteger(255,rn);
			Comment c=new Comment();
			c.setUserID(uid);
			c.setCommentID(cID.toString(16));
			c.setText(message);
			c.setFile1(fileargs[0]);
			c.setFile1(fileargs[1]);
			c.setFile1(fileargs[2]);
			c.setFile1(fileargs[3]);
			c.setTime(Date.valueOf(LocalDate.now()));
			crepository.save(c);
			return new ResponseEntity<>(HttpStatus.OK);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("ログインして実行してください");
		}
	}
	@RequestMapping(value="/post/like",method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String>  getNewPosts(HttpSession session,@RequestParam("cid")String cid) {
		Like l=new Like();
		l.setCommentID(cid);
		try {
			l.setUserID(srepository.findById(session.getId()).get().getUserID());
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("ログインして実行してください。");
		}
		Comment c=null;
		try {
			c=crepository.findById(cid).get();
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("一致するコメントが見つかりません。");
		}
		c.setLikes((c.getLikes()+1));
		crepository.save(c);
		lrepository.save(l);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	@RequestMapping(value="/get/comments",method=RequestMethod.GET)
	@ResponseBody
	public String getNewComments(HttpSession session) {
		List<Comment> newComments=crepository.findComment(Date.valueOf(LocalDate.now().minusDays(1)));
		Gson gson = new Gson();
		String json = gson.toJson(newComments);
		return json;
	}
	/*yutadd.yeah*/
	@RequestMapping(value="/get/emoji",method=RequestMethod.GET)
	@ResponseBody
	public byte[] emojiImage(@RequestParam("emoji")String emojiPath,@RequestParam("type")String type) {
		try {
			String[] str1=emojiPath.split(Pattern.quote("."));
			FileInputStream fis=new FileInputStream(new File("user"+File.separator+str1[0]+File.separator+str1[1]+"."+type));
			return IOUtils.toByteArray(fis);
		}catch(Exception e) {
			e.printStackTrace();
			return "404".getBytes();
		}
	}
	/*
	 * yutadd.yeah
	 * 絵文字の検索はユーザーの検索とユーザーから絵文字を絞り込む検索をすれば取得できる。
	 * */
	@RequestMapping(value="/get/searchuser",method=RequestMethod.GET)
	@ResponseBody
	public String searchUser(@RequestParam("name")String name) {
		List<User> users=urepository.findUsers(name+"%");
		return new Gson().toJson(users);
	}
	@RequestMapping(value="/get/searchemoji",method=RequestMethod.GET)
	@ResponseBody
	public String searchEmoji(@RequestParam("path")String path) {
		List<String> emojis=erepository.findEmoji(path+"%");
		return new Gson().toJson(emojis);
	}
	@RequestMapping(value="/get/getEmojiDetail",method=RequestMethod.GET)
	@ResponseBody
	public String getEmojiDetail(@RequestParam("path")String path) {
		Emoji e=erepository.getEmoji(path);
		User u=urepository.getUser(e.getUserID());
		EmojiDetail ud=new EmojiDetail();
		ud.setUserName(u.getName());
		ud.setUserID(u.getUserid());
		ud.setPath(path);
		ud.setTitle(e.getTitle());
		ud.setType(e.getType());
		return new Gson().toJson(ud);
	}
	@RequestMapping(value="/get/getuser",method=RequestMethod.GET)
	@ResponseBody
	public String getUser(@RequestParam("uid")String uid) {
		User user=urepository.getUser(uid);
		UserDetail ud=new UserDetail();
		ud.setName(user.getName());
		ud.setUid(uid);
		return new Gson().toJson(ud);
	}

	@RequestMapping(value="/post/emoji", method=RequestMethod.POST)
	public ResponseEntity<String> addEmoji(@RequestParam("image") MultipartFile imageFile,@RequestParam("title") String title,HttpSession session,@RequestParam("type") String type) {
		if(srepository.existsById(session.getId())) {
			if(title.matches("[a-z]*[A-Z]*")) {
				try {
					String uid=srepository.findById(session.getId()).get().getUserID();
					String replacesuid=uid.replace("@","");
					Path path=Paths.get(replacesuid);
					File file=new File("user"+File.separator+replacesuid+File.separator+title+"."+type);
					Files.createDirectories(path);
					//f.createNewFile();
					OutputStream output=new FileOutputStream(file);
					output.write(imageFile.getBytes());
					output.flush();
					output.close();
					Emoji emoji=new Emoji();
					emoji.setPopularity(0);
					emoji.setType(type);
					emoji.setTitle(title);
					emoji.setUserID(uid);
					emoji.setPath(replacesuid+"."+title);
					erepository.save(emoji);
					return new ResponseEntity<>(HttpStatus.ACCEPTED);
				} catch (IOException e) {
					e.printStackTrace();
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("ERROR on doing"+e.getLocalizedMessage());
				}
			}else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("タイトルに不正な値が入っています。");
			}
		}else {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("ログインして実行してください");
		}
	}
}
