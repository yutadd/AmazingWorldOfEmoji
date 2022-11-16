package com.yutadd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.yutadd.model.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String>{
	  @Query(value="select userid from User u where u.name like ?1")
	    public List<String> findUsers(String userid);
	  @Query(value="select count(u) from User u where u.email=?1")
	  public int countByEmail(String email);
}
