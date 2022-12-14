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
import IconButton from "@mui/material/IconButton";
import { Avatar } from "@mui/material";
/*予約された文字:§*/
export default function Post(props: any) {
  const [manuscript, setManuscript] = useState("");
  const inputTextObj = useRef<HTMLDivElement>();
  const ignoreOnce = useRef<boolean>(false);
  const changedText = useRef<boolean>(false);
  function copyState(state: { indexes: number[]; files: File[] }) {
    const ret: { indexes: number[]; files: File[] } = {
      indexes: [],
      files: [],
    };
    for (let i = 0; i < state.files.length; i++) {
      ret.files = [...state.files];
      ret.indexes = [...state.indexes];
    }
    return ret;
  }
  function reducer(
    state: { indexes: number[]; files: File[] },
    action: { index: number; action: string; file: File }
  ): { indexes: number[]; files: File[] } {
    if (action.action === "add") {
      let newState = copyState(state);
      newState.files.push(action.file);
      newState.indexes.push(action.index);
      return newState;
    } else if (action.action === "remove") {
      return state;
    } else {
      return state;
    }
  }
  const initial: { indexes: number[]; files: File[] } = {
    indexes: [],
    files: [],
  };

  const [images, setImages] = useReducer(reducer, initial);

  const post = (validatedText: string) => {
    let files: File[] = [];
    let form = new FormData();
    for (let i = 0; i < images.files.length; i++) {
      form.append("files", images.files[i]);
      files.push(images.files[i]);
    }
    form.append("message", validatedText);
    if (images.files.length == 0) {
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
        console.log("there is" + index);
        if (!ignoreOnce.current) {
          let name = "";
          for (let f = index + 1; f < originaltxt.length; f++) {
            if (originaltxt.charAt(f) === ":") {
              const promise = await fetch(
                "/api/share/get/getEmojiDetail?path=" + name
              );
              const emojijson = await promise.json();
              changedText.current = true;
              return (
                '<img width="25"src="/api/share/get/emoji?emoji=' +
                name +
                "&type=" +
                emojijson["type"] +
                '" />' +
                (f < originaltxt.length
                  ? await analyze(originaltxt, f + 1)
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
          (index < originaltxt.length
            ? await analyze(originaltxt, index + 1)
            : "")
        );
      }
    }
    return (
      originaltxt.charAt(index) +
      (index < originaltxt.length ? await analyze(originaltxt, index + 1) : "")
    );
  };

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
        sx={{ mt: "4.5vh", ml: "30vw", pt: "30px", pl: "30px" }}
      >
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
                //console.log(previousAnchorObj);
                let previousIndex = 0;
                const parentObj = document.getElementById("inputting");
                for (
                  let i = 0;
                  i < (current.childNodes?.length as number);
                  i++
                ) {
                  if (
                    current.childNodes.item(i).textContent ===
                    previousAnchorObj.textContent
                  ) {
                    //console.log("found was :" + i);
                    /*console.log(
                      current.childNodes.item(i).textContent +
                        "\r\nVS\r\n" +
                        previousAnchorObj.textContent
                    );*/
                    previousIndex = i;
                  }
                }
                console.log(current.innerHTML);
                const newtext = await analyze(current.innerHTML, 0);
                if (changedText.current) {
                  current.innerHTML = newtext; //絵文字挿入を行う
                  changedText.current = false;
                }

                //console.log(previousIndex);
                /*const range = document.createRange();
                range.setStart(
                  previousIndex == 0
                    ? current.childNodes[0]
                    : current.childNodes[previousIndex].childNodes[0],
                  cursor
                );
                document.getSelection()?.removeAllRanges();
                document.getSelection()?.addRange(range);*/
              };
              if (e.currentTarget.innerHTML !== "") {
                dou(e.currentTarget);
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
        <IconButton onClick={() => props.setShow(false)}>
          <CloseIcon
            color="secondary"
            style={{
              fontSize: "42px",
            }}
          />
        </IconButton>
        <br />
        <IconButton>
          <InsertPhotoIcon color="secondary" style={{ fontSize: "46px" }} />
        </IconButton>
        <IconButton>
          <AddReactionIcon color="secondary" style={{ fontSize: "46px" }} />
        </IconButton>
        <IconButton
          onClick={(e) => {
            post(
              commentToOriginal(
                inputTextObj.current?.innerHTML
                  .replaceAll("<div>", "")
                  .replaceAll("</div>", "")
                  .replaceAll("&nbsp;", " ") as string
              )
            );
            props.setShow(false);
          }}
        >
          <SendIcon color="secondary" style={{ fontSize: "46px" }} />
        </IconButton>
        {images.files.map((element) => (
          <img
            key={element.name}
            width="50px"
            src={URL.createObjectURL(element)}
            alt={URL.createObjectURL(element)}
          ></img>
        ))}
      </Card>
    </Modal>
  );
}
