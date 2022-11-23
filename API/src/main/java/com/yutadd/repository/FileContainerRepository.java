package com.yutadd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yutadd.model.entity.FileContainer;

public interface FileContainerRepository extends JpaRepository<FileContainer, String>{
	
}