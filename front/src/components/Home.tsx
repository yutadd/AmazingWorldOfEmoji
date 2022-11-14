import React, { useState, useEffect, useContext } from "react";
import CommentCard from "./CommentCard";
import "./Home.css";
import { Context } from "./App";

import Box from "@mui/material/Box";
import { CommentSharp } from "@material-ui/icons";
function Home() {
  const [right, setRight] = useContext(Context);
  let comments: any;
  let userNames: string[] = [];
  const [left, setLeft] = useState([<div id="cards"></div>]);
  let _cards: JSX.Element[] = [];
  useEffect(() => {
    console.log("start effect");
    setInterval(() => {
      fetch("/api/share/get/comments").then((promise) => {
        promise.json().then((json) => {
          comments = json;
          for (let a = 0; a < json.length; a++) {
            let uid = json[a]["userID"];
            fetch("/api/share/get/getuser?uid=" + uid, { mode: "cors" }).then(
              (prename) => {
                prename.json().then((user) => {
                  userNames.push(user["name"]);
                });
              }
            );
          }
        });
      });
    }, 5000);
    setTimeout(() => {
      setInterval(() => {
        console.log(comments);
        for (let i = 0; i < comments.length; i++) {
          let entity = (
            <CommentCard
              key={comments[i]["commentID"]}
              user={userNames[i]}
              json={comments[i]}
            />
          );
          _cards.push(entity);
        }
        setLeft(_cards);
      }, 5000);
    }, 500);
  }, []);
  return (
    <>
      <Box sx={{ pt: "1vh" }} className="left">
        {left}
      </Box>
      <Box className="left">{right}</Box>
    </>
  );
}
export default Home;
