package com.yutadd.repository;

import com.yutadd.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Repository extends JpaRepository<User, Long>{
}
