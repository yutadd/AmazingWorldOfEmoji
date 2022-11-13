package com.yutadd.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.yutadd.model.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String>{
	@Query(value = "select commentid from comments left outer join (select cid from history where uid= :id ) as h on (commentid=cid) where cid is null AND time> :date ;",nativeQuery = true)
	public List<String> findNewComment(@Param("id")String uid,@Param("date")Date d);
}
