package com.yutadd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yutadd.Session;

public interface SessionRepository extends JpaRepository<Session, String> {

}
