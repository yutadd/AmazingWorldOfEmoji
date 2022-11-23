import React, { useState, useContext } from "react";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import "../Header.css";
import { Context } from "../App";

import { Autocomplete } from "@mui/material";

export default function Header2() {
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
  const [text, setText] = useState("");
  const [assist, setAssist] = useState([""]);
  function json2yaml(detail: JSON): JSX.Element[] {
    const YAML = require("yaml");
    const doc = new YAML.Document();
    doc.contents = detail;
    let ret: JSX.Element[] = [];
    let spl: string[] = doc.toString().split("\n");
    spl.map((e) => {
      ret.push(
        <React.Fragment key={e}>
          {e.replace(" ", "　")}
          <br />
        </React.Fragment>
      );
    });
    return ret;
  }
  function showResultRight(path: string) {
    console.log(path);
    fetch("/api/share/get/getEmojiDetail?path=" + path).then((e) => {
      e.json().then((detail) => {
        setRight(
          <Card sx={{ mt: "1vh" }}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe">
                  {detail["userName"].charAt(0)}
                </Avatar>
              }
              title={detail["title"]}
              subheader={detail["userID"] + "(" + detail["userName"] + ")"}
            />
            <CardMedia
              component="img"
              height="194"
              image={
                "/api/share/get/emoji?emoji=" +
                detail["path"] +
                "&type=" +
                detail["type"]
              }
              alt="Paella dish"
            />
            <CardContent>
              <Grid width={"90%"} sx={{ my: "0", mx: "1vw" }}>
                <Typography
                  style={{ wordBreak: "break-word" }}
                  className="message"
                  sx={{ mt: "2vh" }}
                >
                  {json2yaml(detail)}
                </Typography>
              </Grid>
            </CardContent>
            <CardActions disableSpacing></CardActions>
          </Card>
        );
      });
    });
  }
  return (
    <>
      <Toolbar sx={{ height: "6vh", borderBottom: 1, borderColor: "divider" }}>
        <Autocomplete
          autoComplete={false}
          color="secondary"
          style={{ width: "17vw" }}
          options={assist}
          renderInput={(params) => (
            <TextField
              {...params}
              color="secondary"
              label="search"
              autoComplete="new-password"
              placeholder="userid.title"
              variant="standard"
            />
          )}
          renderOption={(props, option: string) => {
            return (
              <li {...props} style={{ borderBottom: "1px solid grey" }}>
                <div
                  style={{ color: "#9C27B0" }}
                  onClick={() => {
                    showResultRight(option);
                  }}
                >
                  {option}
                </div>
              </li>
            );
          }}
          onInputChange={(e, value) => {
            setText(value);
            var ar = [""];
            if (value !== "") {
              fetch("/api/share/get/searchemoji?path=" + value, {
                mode: "cors",
              }).then((result) => {
                result.json().then((json) => {
                  for (var i = 0; i < json.length; i++) {
                    console.log("path↓");
                    console.log(json[i]);
                    ar.push(json[i]);
                  }
                  setAssist([""]);
                  setAssist(ar);
                });
              });
            }
          }}
        />
        <IconButton
          color="secondary"
          onClick={() => {
            console.log("");
          }}
        >
          <SearchIcon color="secondary"></SearchIcon>
        </IconButton>
        <Typography
          className="title"
          component="h2"
          variant="h5"
          fontWeight={600}
          color="secondary"
          align="center"
          noWrap
          fontSize={"2vw"}
          sx={{ flex: 1, ml: "-13.5vw" }}
        >
          TheAmazingWorldOfEmoji
        </Typography>
        <img style={{ marginLeft: "auto" }} src="icon.png" height={30} />
        <Button color="secondary" sx={{ ml: "auto" }}>
          {displayId}
        </Button>
      </Toolbar>
    </>
  ); // TODO:ユーザーの名前のボタンを押したら右画面にユーザーの情報が表示されるようにする。
}
