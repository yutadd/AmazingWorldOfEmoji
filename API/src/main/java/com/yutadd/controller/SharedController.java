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
import java.time.LocalDate;
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
import com.yutadd.model.UserDetail;
import com.yutadd.model.entity.Comment;
import com.yutadd.model.entity.Emoji;
import com.yutadd.model.entity.FileContainer;
import com.yutadd.model.entity.History;
import com.yutadd.model.entity.Like;
import com.yutadd.model.entity.SessionID;
import com.yutadd.model.entity.User;
import com.yutadd.repository.CommentRepository;
import com.yutadd.repository.EmojiRepository;
import com.yutadd.repository.FileContainerRepository;
import com.yutadd.repository.HistoryRepository;
import com.yutadd.repository.LikeRepository;
import com.yutadd.repository.SessionIDRepository;
import com.yutadd.repository.UserRepository;

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
	private SessionIDRepository srepository;
	@Autowired
	private HistoryRepository hrepository;
	@Autowired
	private CommentRepository crepository;
	@Autowired
	private LikeRepository lrepository;

	@PostMapping(value="/post/message")
	public ResponseEntity<String> addComment(@RequestParam("message")String message,@RequestParam("files") MultipartFile[] files,HttpSession session) {
		if(srepository.existsById(session.getId())) {
			if(files.length<5) {
				List<String> List=new ArrayList<String>();
				List<String> directoryList=new ArrayList<String>();
				boolean filecheck=true;

				System.out.println(files);
				for (MultipartFile file : files) {
					if(!file.isEmpty()) {
						if(!file.getContentType().split("/")[0].equals("image")) {
							filecheck=false;
							break;
						}
					}else {
						break;
					}
				}
				if(filecheck) {
					message=message.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("&", "&amp;");
					long timestamp=(System.currentTimeMillis());
					String uid=srepository.findById(session.getId()).get().getUserID();
					Random rn = new Random();
					BigInteger cID= new BigInteger(255,rn);
					Comment c=new Comment();
					FileContainer fc=new FileContainer();
					fc.setCommentID(cID.toString(16));
					try {
						int i=0;
						for (MultipartFile file : files) {
							if(!file.isEmpty()) {
								String directory="user"+File.separator+srepository.findById(session.getId()).get().getUserID()+File.separator+"img"+File.separator;

								String fName=(System.currentTimeMillis()+i)+"."+file.getContentType().split("/")[1];
								Files.createDirectories(Paths.get(directory));
								switch(i) {
								case 0:fc.setFile1(fName);break;
								case 1:fc.setFile2(fName);break;
								case 2:fc.setFile3(fName);break;
								case 3:fc.setFile4(fName);break;
								}
								File f=new File(directory+fName);
								FileOutputStream fos=new FileOutputStream(f);
								fos.write(file.getBytes());
								fos.flush();
								fos.close();
								i++;
							}
						}
					}catch(Exception e) {e.printStackTrace();return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("faild to create file or directory");}
					c.setUserID(uid);
					c.setCommentID(cID.toString(16));
					c.setText(message);
					frepository.save(fc);
					c.setTime(Date.valueOf(LocalDate.now()));
					crepository.save(c);
					return ResponseEntity.status(HttpStatus.OK).body("OK");

				}else {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_FILEID");
				}
			}else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_FILE_AMOUNT");
			}
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
			Like l = new Like();
			l.setCommentID(cid);
			if (srepository.existsById(session.getId())) {
				l.setUserID(srepository.findById(session.getId()).get().getUserID());
				Comment c = crepository.findById(cid).get();
				c.setLikes((c.getLikes() + 1));
				crepository.save(c);
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
		String uid = "";
		if (srepository.existsById(session.getId())) {
			uid = srepository.findById(session.getId()).get().getUserID();
		}
		CommentDetail cd = new CommentDetail();
		if (crepository.existsById(cid)) {
			c = crepository.findById(cid).get();
			if (urepository.existsById(c.getUserID())) {
				List<Like> likes = lrepository.findAllByCID(cid);
				if (!uid.equals("") && !likes.isEmpty()) {
					for (Like l : likes) {
						if (l.getUserID().equals(uid)) {
							cd.setLiked("true");
							break;
						} else {
							cd.setLiked("false");
						}
					}
				} else {
					cd.setLiked("false");
				}
				FileContainer fc=frepository.findById(cid).get();
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
				cd.setUsername(urepository.findById(c.getUserID()).get().getName());
				cd.setCommentInfo(c);
				return ResponseEntity.status(HttpStatus.OK).body(new Gson().toJson(cd));
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_AUTH");
			}
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("NO_SUCH_COMMENT");
		}
	}

	@RequestMapping(value = "/get/comments", method = RequestMethod.GET)
	@ResponseBody
	public String getNewComments(HttpSession session) {
		String id;
		if (srepository.existsById(session.getId())) {
			SessionID s = srepository.findById(session.getId()).get();
			id = s.getUserID();
		} else {
			id = session.getId();
		}
		List<Comment> ret = new ArrayList<Comment>();
		List<String> newComments = crepository.findNewComment(id, Date.valueOf(LocalDate.now().minusDays(1)));
		List<CommentDetail> cd = new ArrayList<CommentDetail>();
		for (String c : newComments) {
			Comment cobj = crepository.findById(c).get();
			History h = new History();
			h.setCid(c);
			h.setUid(id);
			h.setDate(new Time(System.currentTimeMillis()));
			ret.add(cobj);
			hrepository.save(h);
			CommentDetail tmpCd = new CommentDetail();
			tmpCd.setCommentInfo(cobj);
			List<Like> likes = lrepository.findAllByCID(c);
			if (!likes.isEmpty()) {
				for (Like l : likes) {
					if (l.getUserID().equals(id)) {
						tmpCd.setLiked("true");
						break;
					} else {
						tmpCd.setLiked("false");
					}
				}
			} else {
				tmpCd.setLiked("false");
			}
			FileContainer fc=frepository.findById(c).get();
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
			tmpCd.setUsername(urepository.findById(cobj.getUserID()).get().getName());
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
			User u = urepository.findById(e.getUserID()).get();
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
			UserDetail ud = new UserDetail();
			ud.setName(user.getName());
			ud.setUid(uid);
			return ResponseEntity.status(HttpStatus.OK).body(new Gson().toJson(ud));
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("NOT_FOUND");
		}
	}

	@RequestMapping(value = "/get/likes")
	public ResponseEntity<String> getLikes(@RequestParam("cid") String cid) {
		List<Like> likelist = lrepository.findAllByCID(cid);
		return ResponseEntity.status(HttpStatus.OK).body(new Gson().toJson(likelist));
	}

	@RequestMapping(value = "/post/emoji", method = RequestMethod.POST)
	public ResponseEntity<String> addEmoji(@RequestParam("image") MultipartFile imageFile,
			@RequestParam("title") String title, HttpSession session) {
		if (srepository.existsById(session.getId())) {
			String uid = srepository.findById(session.getId()).get().getUserID();
			String replacesuid = uid.replace("@", "");
			if (title.matches("[a-zA-Z]*")) {
				String contentType = imageFile.getContentType().split("/")[0];
				String fileType = imageFile.getContentType().split("/")[1];
				if (contentType.equals("image")) {
					try {
						Path path = Paths.get(replacesuid);
						File file = new File("user" + File.separator + replacesuid + File.separator + "emoji"
								+ File.separator + title + "." + fileType);
						Files.createDirectories(path);
						//f.createNewFile();
						OutputStream output = new FileOutputStream(file);
						output.write(imageFile.getBytes());
						output.flush();
						output.close();
						Emoji emoji = new Emoji();
						emoji.setPopularity(0);
						emoji.setType(fileType);
						emoji.setTitle(title);
						emoji.setUserID(uid);
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
