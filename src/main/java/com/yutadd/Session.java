package com.yutadd;


import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="Session")
@RequiredArgsConstructor
@Getter
@Setter
public class Session {
@NotBlank
private String UserID;
@Id
private String sessionID;
}
