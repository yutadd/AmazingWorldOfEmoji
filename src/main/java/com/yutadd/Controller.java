package com.yutadd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.yutadd.repository.Repository;

@RestController
public class Controller {
	@Autowired
	private Repository repository;
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
	public void registration(@Validated User user) {
		repository.save(user);
	}

}
