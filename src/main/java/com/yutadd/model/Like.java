package com.yutadd.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="Session")
@RequiredArgsConstructor
@Getter
@Setter
public class Like {
@Id
private String UserID;
private String commentID;
}
