package com.yutadd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yutadd.model.entity.History;
import com.yutadd.model.entity.HistoryKey;

public interface HistoryRepository extends JpaRepository<History, HistoryKey> {

}
