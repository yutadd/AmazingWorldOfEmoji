package com.yutadd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.yutadd.model.Emoji;

@Repository
public interface EmojiRepository extends JpaRepository<Emoji,String> {
	 @Query("select e from Emoji e where e.path like %:path%")
	 public List<Emoji> findEmoji(@Param("path")String path);
}
