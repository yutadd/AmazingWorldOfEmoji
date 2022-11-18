import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import { grey } from "@mui/material/colors";
import Card from "@mui/material/Card";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CloseIcon from "@mui/icons-material/Close";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import SendIcon from "@mui/icons-material/Send";
import { fileURLToPath } from "url";
export default function Post(props: any) {
  function reducer(
    state: { index: number; file: File }[],
    action: any
  ): { index: number; file: File }[] {
    if (action.action === "add") {
      const newarray = [...state];
      newarray.push(action.index, action.file);
      return newarray;
    } else if (action.action === "remove") {
      const newarray = [...state];
      newarray.splice(action.index, 1);
      return newarray;
    } else {
      return state;
    }
  }
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState(<></>);
  const initial: { index: number; file: File }[] = [];
  const [images, setImages] = useReducer(reducer, initial); //これ絶対usereducerの方がいい
  return (
    <Modal
      onDrop={(event) => {
        console.log("drop");
        console.log(event.dataTransfer.items);
        event.preventDefault();
      }}
      onDragOver={(event) => {
        console.log("dragOver");
        console.log(event.dataTransfer.items);
        event.preventDefault();
      }}
      open={props.show}
      style={{ display: "inline" }}
      onClose={() => props.setShow(false)}
      aria-labelledby=""
      aria-describedby="modal-modal-description"
    >
      <Card style={{ textAlign: "left" }} sx={{ p: "50px" }}>
        <CloseIcon
          sx={{ pl: "71vw" }}
          style={{
            textAlign: "right",
            fontSize: "42px",
            position: "absolute",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            placeholder="text here..."
            role="textbox"
            color={grey[500]}
            contentEditable="true"
            spellCheck="true"
            style={{
              outline: "none",
              overflowY: "scroll",
              fontSize: "25px",
              marginLeft: "30vw",
              paddingTop: "10px",
              fontFamily: "メイリオ",
              resize: "none",
              width: "40vw",
              borderRadius: "16px",
              borderColor: "gray",
              borderWidth: "3px",
              height: "160px",
            }}
          />

          <SendIcon color="action" style={{ fontSize: "80px" }} />
          <br />
          <InsertPhotoIcon
            color="action"
            sx={{ mr: "20px" }}
            style={{ fontSize: "80px", marginLeft: "30vw" }}
          />
          <AddReactionIcon
            color="action"
            sx={{ mr: "20px" }}
            style={{ fontSize: "80px" }}
          />
        </div>
      </Card>
    </Modal>
  );
}
