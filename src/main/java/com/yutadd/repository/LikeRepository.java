package com.yutadd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yutadd.model.Like;
@Repository
public interface LikeRepository extends JpaRepository<Like, String> {

}
