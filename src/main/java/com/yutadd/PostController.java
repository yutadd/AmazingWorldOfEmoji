package com.yutadd;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yutadd.repository.SessionRepository;
import com.yutadd.repository.UserRepository;

@RestController
public class PostController {
	
	@Autowired
	private UserRepository repository;
	@Autowired
	SessionRepository srepository;
	/**
	 * @apiNote 
	 * Post message.<br />
	 * Text=base64,emoji=ID(integer)
	 * 44GT44KT44Gr44Gh44Gv:501920:SGVsbG9Xb3JsZA==
	 * emoji-ID:integer
	 */
	@RequestMapping(value="/api/post", method=RequestMethod.POST)
	public void post(@RequestParam("message") String message) {
		System.out.println(message);
	}
	@RequestMapping(value="/api/registration", method=RequestMethod.POST)
	public void registration(@RequestParam("name") String name,@RequestParam("session") String sessionID,@RequestParam("password") String password,@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)@RequestParam("birth") LocalDate birth,@RequestParam("email") String email) {
		User u=new User();
		u.setName(name);
		u.setPassword(password);
		u.setEmail(email);
		u.setBirth(birth.toString());
		repository.save(u);
		Session se=new Session();
		se.getUserID();
		se.setSessionID(sessionID);
	}
}
