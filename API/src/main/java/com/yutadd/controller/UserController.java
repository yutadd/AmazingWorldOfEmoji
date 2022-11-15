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
	private UserRepository urepository;
	@Autowired
	private SessionIDRepository srepository;

	@RequestMapping(value="/get/logged",method=RequestMethod.GET)
	@ResponseBody
	public String isLogged(HttpSession session) {
		SessionID s=null;
		try {
		s=srepository.findById(session.getId()).get();
		}catch(Exception e) {
			return "null,false";
		}
		return s.getUserID()+",true";
	}
	@RequestMapping(value="/post/login")
	@ResponseBody
	public String login(HttpSession session,@RequestParam("id")String id,@RequestParam("pass")String pass){
		if(urepository.existsById(id)) {
			User u= urepository.findById(id).get();
			if(new BCryptPasswordEncoder().matches(pass,u.getPassword())) {
				SessionID s=new SessionID();
				s.setSessionID(session.getId());
				s.setUserID(id);
				srepository.save(s);
				return "accepted";
			}
		}
		return "denied";
	}
	@RequestMapping(value="/post/registration", method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String> registration(HttpSession session,@RequestParam("name") String name,@RequestParam("id") String id,@RequestParam("pass") String pass,@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)@RequestParam("birth") LocalDate birth,@RequestParam("email") String email) {
		String sessionID=session.getId();
		User u=new User();
		if(pass.length()>=8) {
			if(id.length()>4&&id.matches("[a-z]*[A-Z]*")) {
				u.setUserid(id);
				u.setName(name);
				u.setPassword(new BCryptPasswordEncoder().encode(pass));
				u.setEmail(email);
				u.setBirth(Date.valueOf(birth));
				urepository.save(u);
				SessionID se=new SessionID();
				se.setUserID(id);
				se.setSessionID(sessionID);
				srepository.save(se);
				return ResponseEntity.status(HttpStatus.OK).body("accepted");
			}else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid ID");
			}
		}else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password length liquire 8 or longer.");
		}
	}
}
