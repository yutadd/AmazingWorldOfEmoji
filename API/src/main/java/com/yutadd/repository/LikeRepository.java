package com.yutadd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.yutadd.model.entity.Emoji;
import com.yutadd.model.entity.Like;
import com.yutadd.model.entity.LikeKey;
@Repository
public interface LikeRepository extends JpaRepository<Like, LikeKey> {
	@Query("select count(l) from Like l where l.commentID = ?1")
	 public int countByCID(String cid);
	@Query("select l from Like l where l.commentID= ?1")
	public List<Like> findAllByCID(String cid);
}
