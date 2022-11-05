package com.yutadd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.yutadd.model.entity.Emoji;
import com.yutadd.model.entity.Like;
@Repository
public interface LikeRepository extends JpaRepository<Like, String> {
	@Query("select count(l) from Like l where l.commentID = ?1")
	 public int countById(@Param("cid")String cid);
}
