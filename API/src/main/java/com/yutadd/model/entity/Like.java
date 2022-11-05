package com.yutadd.model.entity;


import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="likes")
@RequiredArgsConstructor
@Getter
@Setter
public class Like {

private String userID;
@Id
private String commentID;
}
