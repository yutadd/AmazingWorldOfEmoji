package com.yutadd.model.entity;


import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="sessions")
@RequiredArgsConstructor
@Getter
@Setter
public class SessionID {
@NotBlank
private String userID;
@Id
private String sessionID;
}
