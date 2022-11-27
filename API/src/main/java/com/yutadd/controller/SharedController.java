package com.yutadd.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Random;
import java.util.regex.Pattern;

import javax.servlet.http.HttpSession;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.google.gson.Gson;
import com.yutadd.model.CommentDetail;
import com.yutadd.model.EmojiDetail;
import com.yutadd.model.FileDetail;
import com.yutadd.model.entity.Comment;
import com.yutadd.model.entity.Emoji;
import com.yutadd.model.entity.FileContainer;
import com.yutadd.model.entity.History;
import com.yutadd.model.entity.Like;
import com.yutadd.model.entity.Sessions;
import com.yutadd.model.entity.User;
import com.yutadd.repository.CommentRepository;
import com.yutadd.repository.EmojiRepository;
import com.yutadd.repository.FileContainerRepository;
import com.yutadd.repository.HistoryRepository;
import com.yutadd.repository.LikeRepository;
import com.yutadd.repository.SessionRepository;
import com.yutadd.repository.UserRepository;
import com.yutadd.service.postCommentService;

import ch.qos.logback.core.encoder.ByteArrayUtil;

@Controller
@RequestMapping(value = "/api/share/")
public class SharedController extends ResponseEntityExceptionHandler {
	@Autowired
	private EmojiRepository erepository;
	@Autowired
	private UserRepository urepository;
	@Autowired
	private FileContainerRepository frepository;
	@Autowired
	private SessionRepository srepository;
	@Autowired
	private HistoryRepository hrepository;
	@Autowired
	private CommentRepository crepository;
	@Autowired
	private LikeRepository lrepository;

	@PostMapping(value="/post/messagef")
	public ResponseEntity<String> addComment(@RequestParam("message")String message,@RequestParam("files") MultipartFile[] files,HttpSession session) {
		if(srepository.existsById(session.getId())) {
			User user=srepository.findById(session.getId()).get().getUser();
			return postCommentService.postCommentWithFile(message, files, user, frepository, crepository);
		}else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_AUTH");
		}
	}
	@PostMapping(value="/post/message")
	public ResponseEntity<String> addComment(@RequestParam("message")String message,HttpSession session) {
		if(srepository.existsById(session.getId())) {
			User user=srepository.findById(session.getId()).get().getUser();
			return postCommentService.postComment(message, user, crepository);
		}else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_AUTH");
		}
	}

	@RequestMapping(value = "/get/image")
	@ResponseBody
	public ResponseEntity<byte[]> getImage(@RequestParam("uid") String uid, @RequestParam("imageName") String name) {
		try {
			if (name.matches("^[0-9]*\\.[a-zA-Z]*$")) {
				if (uid.matches("^[0-9a-zA-Z]*$")) {
					InputStream is = new FileInputStream(new File("user"+File.separator+uid+File.separator+"img"+File.separator+name));
					byte[] ret = IOUtils.toByteArray(is);
					is.close();
					return ResponseEntity.status(HttpStatus.OK).body(ret);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseEntity.status(HttpStatus.OK).body("404".getBytes());
	}

	@RequestMapping(value = "/post/like", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String> getNewPosts(HttpSession session, @RequestParam("cid") String cid) {
		if (crepository.existsById(cid)) {
			Comment c=crepository.findById(cid).get();
			if (srepository.existsById(session.getId())) {
				Like l = new Like();
				l.setComment(c);
				l.setUser(c.getUser());
				l.setLikeid(new BigInteger(256,new Random()).toString(16));
				lrepository.save(l);
				return ResponseEntity.status(HttpStatus.OK).body("OK");
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_AUTH");
			}
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("NO_SUCH_COMMENT");
		}
	}

	@RequestMapping(value = "/get/comment")
	@ResponseBody
	public ResponseEntity<String> getComment(HttpSession session, @RequestParam("cid") String cid) {
		Comment c;
		User senderUser = null;
		CommentDetail cd = new CommentDetail();
		if (srepository.existsById(session.getId())) {
			senderUser = srepository.findById(session.getId()).get().getUser();
		}
		if (crepository.existsById(cid)) {
			c = crepository.findById(cid).get();
			if (senderUser!=null) {
				Like l=new Like();
				l.setComment(c);
				l.setUser(senderUser);
				List<Like> likelist=lrepository.findByCID(cid);
				if(likelist.contains(l)) {
					cd.setLiked("true");
				}else {
					cd.setLiked("false");
				}
			} else {
				cd.setLiked("false");
			}
			FileContainer fc=frepository.findByCommentId(cid);
			if(fc!=null) {
				/*ファイルクラスを
				 *コメントとファイル1対多で結びつけるようにすればここのコードはきれいになる
				 * */
				FileDetail files=new FileDetail();
				for(int i=1;i<5;i++) {
					switch(i) {
					case 1:if(fc.getFile1()!=null) {
						files.setFile1(fc.getFile1());
					}break;
					case 2:if(fc.getFile2()!=null) {
						files.setFile2(fc.getFile2());
					}break;
					case 3:if(fc.getFile3()!=null) {
						files.setFile3(fc.getFile3());
					}break;
					case 4:if(fc.getFile4()!=null) {
						files.setFile4(fc.getFile4());
					}break;
					}
				}
				cd.setFiles(files);
			}
			cd.setUsername(urepository.findById(c.getUser().getUserid()).get().getName());
			cd.setCommentInfo(c);
			cd.setUserid(c.getUser().getUserid());
			c.setUser(null);
			return ResponseEntity.status(HttpStatus.OK).body(new Gson().toJson(cd));
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("NO_SUCH_COMMENT");
		}
	}

	@RequestMapping(value = "/get/comments", method = RequestMethod.GET)
	@ResponseBody
	public String getNewComments(HttpSession session) {
		Sessions sessionObj=null;
		Boolean isLogged=false;
		User user = null;
		if (srepository.existsById(session.getId())) {
			sessionObj = srepository.findById(session.getId()).get();
			user= sessionObj.getUser();
			
			isLogged=true;
		} 
		List<Comment> newComments = crepository.findNewComment( Timestamp.valueOf(LocalDateTime.now().minusHours(１)));
		List<CommentDetail> cd = new ArrayList<CommentDetail>();
		for (Comment cobj : newComments) {
			User author=cobj.getUser();
			CommentDetail tmpCd = new CommentDetail();
			if(isLogged) {
				History h = new History();
				h.setComment(cobj);
				h.setUser(user);
				h.setId(new BigInteger(256,new Random()).toString(16));
				h.setTime(new Time(System.currentTimeMillis()));
				hrepository.save(h);
				h.getUser().setPassword(null);
			}
			tmpCd.setCommentInfo(cobj);
			tmpCd.getCommentInfo().setUser(null);
			List<Like> likelist=lrepository.findByCID(cobj.getCommentid());
			tmpCd.setLikes(likelist.size());
			if(isLogged) {
				Like l=new Like();
				l.setComment(cobj);
				l.setUser(user);
				if(likelist.contains(l)) {
					tmpCd.setLiked("true");
				}else {
					tmpCd.setLiked("false");
				}
			}
			FileContainer fc=frepository.findByCommentId(cobj.getCommentid());
			if(fc!=null) {
				FileDetail files=new FileDetail();
				for(int i=1;i<5;i++) {
					switch(i) {
					case 1:if(fc.getFile1()!=null) {
						files.setFile1(fc.getFile1());
					}break;
					case 2:if(fc.getFile2()!=null) {
						files.setFile2(fc.getFile2());
					}break;
					case 3:if(fc.getFile3()!=null) {
						files.setFile3(fc.getFile3());
					}break;
					case 4:if(fc.getFile4()!=null) {
						files.setFile4(fc.getFile4());
					}break;
					}
				}
				tmpCd.setFiles(files);
			}
			tmpCd.setUsername(author.getName());
			tmpCd.setUserid(author.getUserid());
			cd.add(tmpCd);
		}
		Gson gson = new Gson();
		String json = gson.toJson(cd);
		return json;
	}

	/*yutadd.yeah*/
	@RequestMapping(value = "/get/emoji", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<byte[]> emojiImage(@RequestParam("emoji") String emojiPath,
			@RequestParam("type") String type) {
		try {
			String[] str1 = emojiPath.split(Pattern.quote("."));
			if (str1.length == 2) {
				File imageFile = new File("user" + File.separator + str1[0] + File.separator + "emoji" + File.separator
						+ str1[1] + "." + type);
				if (imageFile.exists()) {
					FileInputStream fis = new FileInputStream(imageFile);
					return ResponseEntity.status(HttpStatus.OK).body(IOUtils.toByteArray(fis));
				} else {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("NOT_FOUND".getBytes());
				}
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_PATH_FORMAT".getBytes());
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("UNKNOWN_ERROR".getBytes());
		}
	}

	/*
	 * yutadd.yeah
	 * 絵文字の検索はユーザーの検索とユーザーから絵文字を絞り込む検索をすれば取得できる。
	 * */
	@RequestMapping(value = "/get/searchuser", method = RequestMethod.GET)
	@ResponseBody
	public String searchUser(@RequestParam("name") String name) {
		List<String> users = urepository.findUsers(name + "%");
		return new Gson().toJson(users);
	}

	@RequestMapping(value = "/get/searchemoji", method = RequestMethod.GET)
	@ResponseBody
	public String searchEmoji(@RequestParam("path") String path) {
		List<String> emojis = erepository.findEmoji(path + "%");
		return new Gson().toJson(emojis);
	}

	@RequestMapping(value = "/get/getEmojiDetail", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String> getEmojiDetail(@RequestParam("path") String path) {
		if (erepository.existsById(path)) {
			Emoji e = erepository.findById(path).get();
			User u = e.getUser();
			EmojiDetail ud = new EmojiDetail();
			ud.setUserName(u.getName());
			ud.setUserID(u.getUserid());
			ud.setPath(path);
			ud.setTitle(e.getTitle());
			ud.setType(e.getType());
			return ResponseEntity.status(HttpStatus.OK).body(new Gson().toJson(ud));
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("NOT_FOUND");
		}

	}

	@RequestMapping(value = "/get/getuser", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String> getUser(@RequestParam("uid") String uid) {
		if (urepository.existsById(uid)) {
			User user = urepository.findById(uid).get();
			User ret=new User();
			ret.setName(user.getName());
			ret.setUserid(user.getUserid());
			return ResponseEntity.status(HttpStatus.OK).body(new Gson().toJson(ret));
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("NOT_FOUND");
		}
	}

	@RequestMapping(value = "/get/likes")
	public ResponseEntity<String> getLikes(@RequestParam("cid") String cid) {
		List<Like> likelist = lrepository.findByCID(cid);
		return ResponseEntity.status(HttpStatus.OK).body(new Gson().toJson(likelist));
	}

	@RequestMapping(value = "/post/emoji", method = RequestMethod.POST)
	public ResponseEntity<String> addEmoji(@RequestParam("image") MultipartFile imageFile,
			@RequestParam("title") String title, HttpSession session) {
		if (srepository.existsById(session.getId())) {
			User user = srepository.findById(session.getId()).get().getUser();
			String replacesuid = user.getUserid().replace("@", "");
			if (title.matches("[a-zA-Z]*")) {
				String contentType = imageFile.getContentType().split("/")[0];
				String fileType = imageFile.getContentType().split("/")[1];
				if (contentType.equals("image")) {
					try {
						String path="user" + File.separator + replacesuid + File.separator + "emoji"
								+ File.separator;

						File file = new File(path+ title + "." + fileType);
						Files.createDirectories(Paths.get(path));
						//f.createNewFile();
						OutputStream output = new FileOutputStream(file);
						output.write(imageFile.getBytes());
						output.flush();
						output.close();
						Emoji emoji = new Emoji();

						emoji.setType(fileType);
						emoji.setTitle(title);
						emoji.setUser(user);
						emoji.setPath(replacesuid + "." + title);
						erepository.save(emoji);
						return new ResponseEntity<>(HttpStatus.OK);
					} catch (IOException e) {
						e.printStackTrace();
						return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("UNKNOWN_ERROR");
					}
				} else {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_CONTENT_TYPE");
				}
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_TITLE");
			}
		} else {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("INVALID_AUTH");
		}
	}
}
