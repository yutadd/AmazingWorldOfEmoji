package com.yutadd.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.yutadd.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String>{
	@Query(value = "select c from Comment c where c.time > ?1")
	public List<Comment> findComment(@Param("time")Date time);
}
