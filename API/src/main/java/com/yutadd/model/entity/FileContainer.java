package com.yutadd.model.entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
class FileContainerPK implements Serializable{
	String fileid;
}
@Entity
@Table(name="filecontainer")
@RequiredArgsConstructor
@Getter
@Setter
@IdClass(FileContainerPK.class)
public class FileContainer implements Serializable  {
	@OneToOne(targetEntity=Comment.class)
    @JoinColumn(name="commentid",referencedColumnName = "commentid")
    private Comment comment;
	@Id
	String fileid;
	String file1;
	String file2;
	String file3;
	String file4;
}
