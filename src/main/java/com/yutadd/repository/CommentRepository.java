package com.yutadd.repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.yutadd.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String>{
	@Query(value = "select * from comment;",nativeQuery = true) 
	Set<Comment> findRecently(Date time);
}
