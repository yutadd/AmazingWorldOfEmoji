package com.yutadd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.yutadd.model.entity.Emoji;

@Repository
public interface EmojiRepository extends JpaRepository<Emoji,String> {
	 @Query(value="select e.path from Emoji e where e.path like ?1")
	 public List<String> findEmoji(String path);
	 @Query(value = "select e from Emoji e where e.path = ?1")
	 public Emoji getEmoji(String path);
	 
}
