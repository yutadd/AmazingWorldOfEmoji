import React, { useState, useContext, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { orange, purple } from "@mui/material/colors";
import ShowDetailRight from "./ShowDetailRight";
import { Context } from "./App";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
export default function CommentCard(property: any) {
  let name = property.user;
  console.log("commentcard : " + property.user);
  let json = property.json;
  console.log("json:↓");
  console.log(json);
  const [showMe, setShowMe] = useState(true);
  const [right, setRight] = useContext(Context);
  const [liked, setLiked] = useState(false);
  const [likes, setlikes] = useState(parseInt(json["commentInfo"]["likes"]));
  function postLike(cid: string) {
    console.log(cid);
    fetch("/api/share/post/like?cid=" + cid, { method: "POST" }).then((e) =>
      e.text().then((t) => {
        if (t == "OK") {
          setlikes(likes + 1);
          setLiked(true);
        } else {
          alert("ログインして実行してください。");
        }
      })
    );
  }
  function update() {
    fetch(
      "/api/share/get/comment?cid=" + json["commentInfo"]["commentID"]
    ).then((e) => {
      e.json().then((newJson) => {
        if (newJson.length == 0) {
          setShowMe(false);
        } else {
          json = newJson;
          if (newJson["liked"] === "true") {
            setLiked(true);
          } else {
            setLiked(false);
          }
          setlikes(parseInt(json["commentInfo"]["likes"]));
        }
      });
    });
  }
  useEffect(() => {
    if (json["liked"] === "true") {
      setLiked(true);
    } else {
      setLiked(false);
    }
    setInterval(() => {
      update();
    }, 5000);
  }, []);
  return (
    <Paper
      key={json["commentInfo"]["commentID"]}
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

          {liked ? (
            <IconButton sx={{ color: purple[500], mt: "1vh" }} disabled>
              <FavoriteIcon sx={{ color: purple[500], mt: "1vh" }} />
            </IconButton>
          ) : (
            <IconButton
              onClick={(e) => {
                postLike(json["commentInfo"]["commentID"]);
              }}
              sx={{ color: purple[500], mt: "1vh" }}
            >
              <FavoriteBorderIcon sx={{ color: purple[500], mt: "1vh" }} />
            </IconButton>
          )}
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
          <p className="user-id">{json["commentInfo"]["userID"]}</p>
          <Typography
            onClick={() => {
              setRight(<ShowDetailRight name={name} json={json} />);
              console.log("clicked :" + json["commentInfo"]["text"]);
            }}
            className="message"
            style={{ wordBreak: "break-word" }}
            sx={{ mt: "1vh" }}
          >
            {json["commentInfo"]["text"]}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
