package com.yutadd.model;


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

private String UserID;
@Id
private String commentID;
}
