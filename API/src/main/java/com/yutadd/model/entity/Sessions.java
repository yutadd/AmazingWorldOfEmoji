package com.yutadd.model.entity;


import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
public class Sessions {
@ManyToOne
@JoinColumn(name="userid",referencedColumnName = "userid")
private User user;
@Id
private String sessionID;
}
