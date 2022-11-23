import React, { useEffect, useReducer, useRef, useState } from "react";
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
import { FormControlUnstyled } from "@mui/base";
import { isEmptyBindingElement } from "typescript";
import { getByText } from "@testing-library/react";
/*予約された文字:§*/
export default function Post(props: any) {
  const [manuscript, setManuscript] = useState("");
  const inputTextObj = useRef<HTMLDivElement>();
  const ignoreOnce = useRef<boolean>(false);
  function reducer(
    state: { index: number; file: File }[],
    action: { index: number; action: string; file: File }
  ): { index: number; file: File }[] {
    if (action.action === "add") {
      const newarray = [...state];
      newarray.push({ index: action.index, file: action.file });
      return newarray;
    } else if (action.action === "remove") {
      const newarray = [...state];
      newarray.splice(action.index, 1);
      return newarray;
    } else {
      return state;
    }
  }
  const post = (validatedText: string) => {
    let files: File[] = [];
    let form = new FormData();
    for (let i = 0; i < images.length; i++) {
      form.append("files", images[i]["file"]);
      files.push(images[i]["file"]);
    }
    form.append("message", validatedText);
    if (images.length == 0) {
      fetch("/api/share/post/message", { method: "POST", body: form });
      alert("posted your perfect comment!");
    } else {
      fetch("/api/share/post/messagef", { method: "POST", body: form });
      alert("posted imaged with your perfect comment!");
    }
  };
  const commentToOriginal = (originaltxt: string) => {
    let replacetarget = originaltxt.replaceAll(
      new RegExp("&amp;type=[a-zA-Z]*.>", "g"),
      "§"
    );
    replacetarget = replacetarget.replaceAll(
      new RegExp('<img width="25" src="/api/share/get/emoji.emoji=', "g"),
      "§"
    );
    return replacetarget;
  };
  const analyze = async (originaltxt: string, index: number): Promise<any> => {
    if (originaltxt.charAt(index) !== "'") {
      if (originaltxt.charAt(index) === ":") {
        if (!ignoreOnce.current) {
          let name = "";
          for (let f = index + 1; f < originaltxt.length; f++) {
            if (originaltxt.charAt(f) === ":") {
              const promise = await fetch(
                "/api/share/get/getEmojiDetail?path=" + name
              );
              const emojijson = await promise.json();
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
        } else {
          ignoreOnce.current = false;
        }
      }
    } else {
      ignoreOnce.current = true;
      if (originaltxt.charAt(index + 1) === ":") {
        index += 1;
        return (
          "':" +
          (index !== originaltxt.length - 1
            ? await analyze(originaltxt, index + 1)
            : "")
        );
      }
    }
    return (
      originaltxt.charAt(index) +
      (index !== originaltxt.length - 1
        ? await analyze(originaltxt, index + 1)
        : "")
    );
  };
  const initial: { index: number; file: File }[] = [];
  const [images, setImages] = useReducer(reducer, initial);
  return (
    <Modal
      open={props.show}
      onClose={() => props.setShow(false)}
      aria-labelledby=""
      aria-describedby="modal-modal-description"
      onDrop={(event) => {
        console.log("drop");
        let allOkay = true;
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
          if (event.dataTransfer.items[i].type.split("/")[0] !== "image") {
            allOkay = false;
          }
        }
        if (allOkay) {
          for (let i = 0; i < event.dataTransfer.items.length; i++) {
            setImages({
              action: "add",
              index: i,
              file: event.dataTransfer.items[i].getAsFile() as File,
            });
          }
        }
        event.preventDefault();
      }}
      onDragOver={(event) => {
        //console.log(event.dataTransfer.items);
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
                };
                if (e.currentTarget.innerHTML !== "") {
                  dou(e.currentTarget);
                  console.log(images);
                }
                inputTextObj.current = e.currentTarget;
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
          <SendIcon
            onClick={(e) => {
              post(
                commentToOriginal(inputTextObj.current?.innerHTML as string)
              );
            }}
            color="secondary"
            style={{ fontSize: "80px" }}
          />
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
