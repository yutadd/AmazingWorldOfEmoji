package com.yutadd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.yutadd.model.Emoji;

@Repository
public interface EmojiRepository extends JpaRepository<Emoji,String> {
	@Query(value = "select * from emojis where title like %:title%;",nativeQuery = true) 
	List<Emoji> findAllByTitle(@Param("title")String title);
}
