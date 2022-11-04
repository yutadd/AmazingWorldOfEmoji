package com.yutadd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.yutadd.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String>{
	  @Query("select name from User u where u.name like %:name%")
	    public List<String> findUsers(@Param("name") String name);
}
