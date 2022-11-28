import React, { useState, useEffect, useContext } from "react";
import CommentCard from "./CommentCard";
import "./Home.css";
import { Context } from "./App";
import Box from "@mui/material/Box";
import Replay from "@mui/icons-material/Replay";
import IconButton from "@mui/material/IconButton";

function Home() {
  const [
    right,
    setRight,
    showL,
    setShowL,
    showS,
    setShowS,
    displayId,
    setDisplayId,
  ] = useContext(Context);
  const [cards, setCards] = useState<JSX.Element[]>([<></>]);
  const getter = async () => {
    const promise = await fetch("/api/share/get/comments");
    const json = await promise.json();

    for (let a = json.length - 1; a >= 0; a--) {
      setCards((previous: JSX.Element[] | undefined) => {
        let tmp: JSX.Element[] = [...(previous as JSX.Element[])];
        tmp.push(
          <CommentCard
            key={json[a]["commentInfo"]["commentid"]}
            user={json[a]["username"]}
            json={json[a]}
          />
        );
        return tmp;
      });
    }
  };
  useEffect(() => {
    getter();
  }, []);

  return (
    <>
      <Box sx={{ pt: "1vh" }} className="left">
        <div style={{ display: "block", textAlign: "center" }}>
          <IconButton onClick={() => getter()}>
            <Replay color="secondary" style={{ fontSize: "30" }} />
          </IconButton>
        </div>
        {cards}
      </Box>
      <Box sx={{ pt: "1vh" }} className="left">
        {right}
      </Box>
    </>
  );
}
export default Home;
