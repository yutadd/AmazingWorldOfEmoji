import React, { useState, useContext, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import ShowDetailRight from "./ShowDetailRight";
import { Context } from "./App";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
export default function CommentCard(property: any) {
  let name = property.user;
  console.log("commentcard : " + property.user);
  let json = property.json;
  console.log("json:↓");
  console.log(json);
  const [showMe, setShowMe] = useState(true);
  const [right, setRight] = useContext(Context);
  const [likes, setlikes] = useState(parseInt(json["c"]["likes"]));
  function postLike(cid: string) {
    console.log(cid);
    fetch("/api/share/post/like?cid=" + cid, { method: "POST" }).then((e) =>
      e.text().then((t) => {
        if (t == "OK") {
          setlikes(likes + 1);
        } else {
          alert("ログインして実行してください。");
        }
      })
    );
  }
  function update() {
    fetch("/api/share/get/comment?cid=" + json["c"]["commentID"]).then((e) => {
      e.json().then((newJson) => {
        if (newJson.length == 0) {
          setShowMe(false);
        } else {
          json = newJson;
          setlikes(parseInt(json["c"]["likes"]));
        }
      });
    });
  }
  useEffect(() => {
    setInterval(() => {
      update();
    }, 5000);
  }, []);
  return (
    <Paper
      key={json["c"]["commentID"]}
      style={{ display: showMe ? "block" : "none" }}
      sx={{
        mt: "0.8vh", //margin-y 8px
        mx: 1, //margin-x
        p: 2, //padding 16px
      }}
    >
      <Grid container wrap="nowrap" spacing={2}>
        <Grid sx={{ ml: "1vw", mt: "1vh" }}>
          <Avatar>{name.charAt(0)}</Avatar>
          <IconButton
            onClick={() => postLike(json["c"]["commentID"])}
            sx={{ mt: "1vh" }}
          >
            <FavoriteBorderIcon></FavoriteBorderIcon>
          </IconButton>
          <Typography
            textAlign={"center"}
            sx={{ mt: "-1vh" }}
            color="common.red"
          >
            {likes}
          </Typography>
        </Grid>
        <Grid width={"auto"} sx={{ my: "0", mx: "1vw" }}>
          <p className="name">{name}</p>
          <p className="user-id">{json["c"]["userID"]}</p>
          <Typography
            onClick={() => {
              setRight(<ShowDetailRight name={name} json={json} />);
              console.log("clicked :" + json["c"]["text"]);
            }}
            className="message"
            style={{ wordBreak: "break-word" }}
            sx={{ mt: "1vh" }}
          >
            {json["c"]["text"]}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
