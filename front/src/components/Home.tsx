import React, { useState, useEffect, useContext } from "react";
import CommentCard from "./CommentCard";
import "./Home.css";
import { Context } from "./App";

import Box from "@mui/material/Box";
import { CommentSharp } from "@material-ui/icons";
function Home() {
  const [right, setRight] = useContext(Context);
  const [left, setLeft] = useState<JSX.Element[]>([]);

  useEffect(() => {
    setInterval(() => {
      fetch("/api/share/get/comments").then((promise) => {
        promise.json().then((json) => {
          console.log(json);
          for (let a = 0; a < json.length; a++) {
            let uid = json[a]["userID"];
            fetch("/api/share/get/getuser?uid=" + uid, { mode: "cors" }).then(
              (prename) => {
                prename.json().then((user) => {
                  setLeft([
                    ...(left as JSX.Element[]),
                    <CommentCard
                      key={json[a]["commentID"]}
                      user={user["name"]}
                      json={json[a]}
                    />,
                  ]);
                });
              }
            );
          }
        });
      });
    }, 5000);
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
