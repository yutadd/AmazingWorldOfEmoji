package com.yutadd;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
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
	@ResponseBody
	public String registration(@RequestParam("name") String name,@RequestParam("password") String password,@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)@RequestParam("birth") LocalDate birth,@RequestParam("email") String email) {
		Random rn = new Random();
		BigInteger uID= new BigInteger(255,rn);
		User u=new User();
		u.setUserID(uID.toString(16));
		u.setName(name);
		u.setPassword(password);
		u.setEmail(email);
		u.setBirth(birth.toString());
		repository.save(u);
		BigInteger   sID = new BigInteger(255,rn);
		Session se=new Session();
		se.setUserID(uID.toString(16));
		se.setSessionID(sID.toString(16));
		srepository.save(se);
		return sID.toString(16);
	}
}
