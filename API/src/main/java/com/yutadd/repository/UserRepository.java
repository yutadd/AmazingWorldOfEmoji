package com.yutadd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.yutadd.model.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String>{
	  @Query("select userid from User u where u.name like %:userid%")
	    public List<String> findUsers(@Param("userid") String userid);
		@Query(value = "select u from User u where u.userid = ?1")
		public User getUser(String uid);
}
