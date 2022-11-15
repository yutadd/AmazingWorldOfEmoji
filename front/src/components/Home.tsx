import React, { useState, useEffect, useContext, useReducer } from "react";
import CommentCard from "./CommentCard";
import "./Home.css";
import { Context } from "./App";
import Box from "@mui/material/Box";

function Home() {
  const [right, setRight] = useContext(Context);
  const [cards, setCards] = useState<JSX.Element[]>([<></>]);

  useEffect(() => {
    setInterval(() => {
      const getter = async () => {
        const promise = await fetch("/api/share/get/comments");
        const json = await promise.json();
        console.log(json.length);
        for (let a = 0; a < json.length; a++) {
          setCards((previous: JSX.Element[] | undefined) => {
            let tmp: JSX.Element[] = [...(previous as JSX.Element[])];
            console.log(json[a]);
            tmp.push(
              <CommentCard
                key={json[a]["c"]["commentID"]}
                user={json[a]["username"]}
                json={json[a]}
              />
            );
            return tmp;
          });
        }
      };
      getter();
    }, 5000);
  }, []);

  return (
    <>
      <Box sx={{ pt: "1vh" }} className="left">
        {cards}
      </Box>

      <Box className="left">{right}</Box>
    </>
  );
}
export default Home;
