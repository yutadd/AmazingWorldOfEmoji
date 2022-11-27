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
import com.yutadd.model.entity.Sessions;
import com.yutadd.model.entity.User;
import com.yutadd.repository.SessionRepository;
import com.yutadd.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@RequestMapping(value="/api/user")
public class UserController {

	@Autowired
	private UserRepository urepository;
	@Autowired
	private SessionRepository srepository;

	@RequestMapping(value="/get/logged",method=RequestMethod.GET)
	@ResponseBody
	public String isLogged(HttpSession session) {
		if(srepository.existsById(session.getId())) {
			Sessions s=srepository.findById(session.getId()).get();
			return s.getUser().getUserid()+",true";
		}else {
			return "null,false";
		}
	}
	@RequestMapping(value="/post/login")
	@ResponseBody
	public String login(HttpSession session,@RequestParam("id")String id,@RequestParam("pass")String pass){
		if(urepository.existsById(id)) {
			User u= urepository.findById(id).get();
			if(new BCryptPasswordEncoder().matches(pass,u.getPassword())) {
				Sessions s=new Sessions();
				s.setSessionID(session.getId());
				s.setUser(u);
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
		if(!urepository.existsById(id)) {
			if(pass.length()>=8) {
				if(id.length()>4&&id.matches("[a-zA-Z]*")) {
					if(email.matches("^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\\.)+[a-zA-Z]{2,}$")) {
						if(name.matches("^[0-9a-zA-Z]*")) {
							if(urepository.countByEmail(email)==0) {
								u.setUserid(id);
								u.setName(name);
								u.setPassword(new BCryptPasswordEncoder().encode(pass));
								u.setEmail(email);
								u.setBirth(Date.valueOf(birth));
								urepository.save(u);
								Sessions se=new Sessions();
								se.setUser(u);
								se.setSessionID(sessionID);
								srepository.save(se);
								return ResponseEntity.status(HttpStatus.OK).body("accepted");
							}else {
								return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("EMAIL_ALREADY_EXISTS");
							}
						}else {
							return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("BAD_NAME");
						}
					}else {
						return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_EMAIL");
					}
				}else {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("INVALID_ID");
				}
			}else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("PASSWORD_TOO_SHORT");
			}
		}else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("ID_ALREDY_EXISTS");
		}
	}
}
