package com.yutadd.repository;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.yutadd.model.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String>{
	@Query(value = "select * from comments where time > :time ;",nativeQuery = true)
	public List<Comment> findNewComment(@Param("time")Timestamp time);
}
