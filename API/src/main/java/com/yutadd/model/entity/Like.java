package com.yutadd.model.entity;


import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="likes")
@RequiredArgsConstructor
@Getter
@Setter
@IdClass(value=Like.class)
public class Like  implements Serializable{
@Id
private String userID;
@Id
private String commentID;
}
