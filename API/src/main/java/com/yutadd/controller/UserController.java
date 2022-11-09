package com.yutadd.controller;

import java.sql.Date;
import java.time.LocalDate;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.yutadd.model.entity.SessionID;
import com.yutadd.model.entity.User;
import com.yutadd.repository.SessionIDRepository;
import com.yutadd.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@RequestMapping(value="/api/user")
public class UserController {

	@Autowired
	private UserRepository repository;
	@Autowired
	private SessionIDRepository srepository;

@RequestMapping(value="/get/logged",method=RequestMethod.GET)
@ResponseBody
public String isLogged(HttpSession session) {
	return (srepository.existsById(session.getId()))?"true":"false";
}
	@RequestMapping(value="/post/registration", method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String> registration(HttpSession session,@RequestParam("name") String name,@RequestParam("UserID") String uID,@RequestParam("password") String password,@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)@RequestParam("birth") LocalDate birth,@RequestParam("email") String email) {
		String sessionID=session.getId();
		User u=new User();
		if(password.length()>=8) {
			if(uID.matches("@[a-z]*[A-Z]*")) {
				u.setUserid(uID);
				u.setName(name);
				u.setPassword(new BCryptPasswordEncoder().encode(password));
				u.setEmail(email);
				u.setBirth(Date.valueOf(birth));
				repository.save(u);
				SessionID se=new SessionID();
				se.setUserID(uID);
				se.setSessionID(sessionID);
				srepository.save(se);
				return new ResponseEntity<>(HttpStatus.OK);
			}else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid ID");
			}
		}else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password length liquire 8 or longer.");
		}
	}
}
