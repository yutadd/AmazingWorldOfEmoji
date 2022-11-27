package com.yutadd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yutadd.model.entity.Sessions;

public interface SessionRepository extends JpaRepository<Sessions, String> {

}
