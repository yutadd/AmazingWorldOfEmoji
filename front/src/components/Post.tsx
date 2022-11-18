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
import Grid from "@mui/material/Grid";
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
      open={props.show}
      onClose={() => props.setShow(false)}
      aria-labelledby=""
      aria-describedby="modal-modal-description"
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
    >
      <Card
        style={{
          borderRadius: "16px",
          outline: "none",
          textAlign: "left",
          display: "inline-block",
        }}
        sx={{ mt: "4.5vh", ml: "30vw", p: "30px" }}
      >
        <CloseIcon
          color="secondary"
          onClick={() => props.setShow(false)}
          sx={{
            pl: "40vw",
          }}
          style={{
            textAlign: "right",
            fontSize: "42px",
            position: "absolute",
          }}
        />
        <div style={{ position: "relative", display: "inline" }}>
          <div
            style={{
              overflow: "hidden",
              width: "40vw",
              paddingTop: "10px",
              /*marginLeft: "30vw",*/
              border: "2px solid gray",
              borderRadius: "16px",
              display: "inline-block",
            }}
          >
            <div
              placeholder="text here..."
              role="textbox"
              color={grey[500]}
              contentEditable="true"
              spellCheck="true"
              style={{
                padding: "5px",
                overflowY: "scroll",
                fontSize: "25px",
                fontFamily: "メイリオ",
                resize: "none",
                outline: "none",
                height: "160px",
              }}
            />
          </div>
          <SendIcon color="secondary" style={{ fontSize: "80px" }} />
          <br />
          <InsertPhotoIcon
            color="secondary"
            sx={{ mr: "20px" }}
            style={{ fontSize: "80px" }}
          />
          <AddReactionIcon
            color="secondary"
            sx={{ mr: "20px" }}
            style={{ fontSize: "80px" }}
          />
        </div>
      </Card>
    </Modal>
  );
}
