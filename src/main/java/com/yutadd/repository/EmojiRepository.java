package com.yutadd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yutadd.model.Emoji;

public interface EmojiRepository extends JpaRepository<Emoji,String> {

}
