package com.yutadd.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.yutadd.model.entity.Comment;
import com.yutadd.model.entity.FileContainer;
import com.yutadd.model.entity.User;
import com.yutadd.repository.CommentRepository;
import com.yutadd.repository.FileContainerRepository;

public class postCommentService {
	public static String validation(String original) {
		return original.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("&", "&amp;");
	}
	private static FileContainer registFile(MultipartFile files[],String uid)throws IOException {
		FileContainer fc=new FileContainer();
		int i=0;
		for (MultipartFile file : files) {
			if(!file.isEmpty()) {
				String directory="user"+File.separator+uid+File.separator+"img"+File.separator;
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
		return fc;
	}
	private static boolean filecheck(MultipartFile[] files) {
		boolean filecheck=true;
		if(files.length<5) {
			List<String> List=new ArrayList<String>();
			List<String> directoryList=new ArrayList<String>();

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
		}else filecheck=false;
		return filecheck;
	}
	static public ResponseEntity<String> postCommentWithFile(String message,MultipartFile[] files,User user,FileContainerRepository frepository,CommentRepository crepository) {
		Comment c=new Comment();
		long timestamp=(System.currentTimeMillis());
		FileContainer fc=null;
		Random rn = new Random();
		BigInteger cID= new BigInteger(255,rn);
		
			c.setUser(user);
			c.setCommentid(cID.toString(16));
			c.setText(validation(message));
			c.setTime(Timestamp.valueOf(LocalDateTime.now()));
			crepository.save(c);
			if(filecheck(files)) {
			try {
				fc=registFile(files,user.getUserid());
				fc.setComment(c);
				fc.setFileid(new BigInteger(256,new Random()).toString(16));
			}catch(Exception e) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("faild to create file or directory");
			}
			frepository.save(fc);
			return ResponseEntity.status(HttpStatus.OK).body("OK");
		}else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_FILET");
		}
	}
	static public ResponseEntity<String> postComment(String message,User user,CommentRepository crepository) {
		Comment c=new Comment();
		Random rn = new Random();
		BigInteger cID= new BigInteger(255,rn);
			c.setUser(user);
			c.setCommentid(cID.toString(16));
			c.setText(validation(message));
			c.setTime(Timestamp.valueOf(LocalDateTime.now()));
			crepository.save(c);
			return ResponseEntity.status(HttpStatus.OK).body("OK");
		
	}
}
