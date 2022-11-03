package com.yutadd.controller;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.Random;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.yutadd.model.SessionID;
import com.yutadd.model.User;
import com.yutadd.repository.SessionIDRepository;
import com.yutadd.repository.UserRepository;

@RestController
@RequestMapping(value="/api/user")
public class UserController {
	
	@Autowired
	private UserRepository repository;
	@Autowired
	private SessionIDRepository srepository;
	
	
	@RequestMapping(value="/post/registration", method=RequestMethod.POST)
	@ResponseBody
	public void registration(HttpSession session,@RequestParam("name") String name,@RequestParam("password") String password,@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)@RequestParam("birth") LocalDate birth,@RequestParam("email") String email) {
		String sessionID=session.getId();
		Random rn = new Random();
		BigInteger uID= new BigInteger(255,rn);
		User u=new User();
		u.setUserID(uID.toString(16));
		u.setName(name);
		u.setPassword(password);
		u.setEmail(email);
		u.setBirth(birth.toString());
		repository.save(u);
		SessionID se=new SessionID();
		se.setUserID(uID.toString(16));
		se.setSessionID(sessionID);
		srepository.save(se);
	}
}
