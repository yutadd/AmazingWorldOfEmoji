package com.yutadd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yutadd.model.SessionID;

public interface SessionIDRepository extends JpaRepository<SessionID, String> {

}
