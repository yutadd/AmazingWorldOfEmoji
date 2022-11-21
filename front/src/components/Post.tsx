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
  const analyze = async (originaltxt: string, index: number): Promise<any> => {
    if (
      originaltxt.charAt(index) === " " ||
      originaltxt.charAt(index) === "&nbsp;"
    ) {
      if (originaltxt.charAt(index + 1) === ":") {
        let name = "";
        for (let f = index + 2; f < originaltxt.length; f++) {
          if (originaltxt.charAt(f) === ":") {
            const promise = await fetch(
              "/api/share/get/getEmojiDetail?path=" + name
            );
            const emojijson = await promise.json();
            console.log(name);
            return (
              '<img width="25"src="/api/share/get/emoji?emoji=' +
              name +
              "&type=" +
              emojijson["type"] +
              '" />' +
              (f !== originaltxt.length - 1
                ? await analyze(originaltxt, name.length + 2)
                : "")
            );
          } else {
            name = name + originaltxt.charAt(f);
          }
        }
      }
    }
    return (
      originaltxt.charAt(index) +
      (index !== originaltxt.length - 1
        ? await analyze(originaltxt, index + 1)
        : "")
    );
  };
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
              id="inputting"
              onInput={(e) => {
                const dou = async (current: EventTarget & HTMLDivElement) => {
                  const cursor = document.getSelection()?.focusOffset as number; //入力後のカーソル位置
                  const previousAnchorObj = document.getSelection()
                    ?.anchorNode as Node; //inputElementから見た入力後カーソルがあるオブジェクト
                  let previousIndex = 0;
                  const parentObj =
                    document.getSelection()?.focusNode?.parentNode;
                  for (
                    let i = 0;
                    i <
                    (parentObj?.childNodes.length
                      ? parentObj?.childNodes.length
                      : 0);
                    i++
                  ) {
                    if (
                      parentObj?.childNodes
                        .item(i)
                        .isEqualNode(previousAnchorObj)
                    ) {
                      previousIndex = i;
                    }
                  }
                  current.innerHTML = await analyze(current.innerHTML, 0); //絵文字挿入を行う
                  const currentAnchorNode = document.getSelection()?.anchorNode
                    ?.childNodes[previousIndex] as Node;
                  const range = document.createRange();
                  range.setStart(currentAnchorNode, cursor);
                  document.getSelection()?.removeAllRanges();
                  document.getSelection()?.addRange(range);
                  //const focusNode = document.getSelection()?.focusOffset as Node;
                  //const range = document.createRange();
                  // range.setStart(focusNode); //setstart(node,range index)
                  //document.getSelection()?.removeAllRanges();
                  //document.getSelection()?.addRange(range);
                };
                if (e.currentTarget.innerHTML !== "") {
                  dou(e.currentTarget);
                }
              }}
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
            ></div>
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
