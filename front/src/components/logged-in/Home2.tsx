import React, { useState, useEffect, useContext } from "react";
import CommentCard from "./CommentCard";
import "./Home2.css";
import { Context } from "../App";

import Box from "@mui/material/Box";
function Home2() {
  const [right, setRight] = useContext(Context);
  const [left, setLeft] = useState([<div id="cards"></div>]);
  useEffect(() => {
    let _cards = [<></>];
    fetch("/api/share/get/comments").then((promise) => {
      promise.json().then((json) => {
        console.log(json);
        for (let a = 0; a < json.length; a++) {
          let uid = json[a]["userID"];
          fetch("/api/share/get/getuser?uid=" + uid, { mode: "cors" }).then(
            (prename) => {
              prename.json().then((user) => {
                let entity = <CommentCard user={user["name"]} json={json[a]} />;
                _cards = [..._cards, entity];
                setLeft(_cards); //then以降はおそらく非同期実行だから、ここでないとからの配列でcardsが上書きされてしまう。
              });
            }
          );
        }
      });
    });
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
export default Home2;
