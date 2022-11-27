package com.yutadd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.yutadd.model.entity.Comment;
import com.yutadd.model.entity.FileContainer;

public interface FileContainerRepository extends JpaRepository<FileContainer, String>{
	@Query("select f from FileContainer f where f.comment.commentid=?1")
	FileContainer findByCommentId(String commentId);
}