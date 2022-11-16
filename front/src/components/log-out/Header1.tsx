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
import { Context } from "../App";

import { Autocomplete } from "@mui/material";

export default function Header1() {
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
          {e}
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
          style={{ width: "17vw" }}
          options={assist}
          renderInput={(params) => (
            //下            params
            <TextField
              {...params}
              label="search"
              autoComplete="off"
              placeholder="userid.title"
              variant="standard"
            />
          )}
          renderOption={(props, option: string) => {
            return (
              <li {...props} style={{ borderBottom: "1px solid grey" }}>
                <div
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
          onClick={() => {
            console.log("");
          }}
        >
          <SearchIcon>search</SearchIcon>
        </IconButton>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          TheAmazingWorldOfEmoji
        </Typography>
        <img src="icon.png" height={30} />
        <Button
          onClick={() => {
            if (!showL) {
              setShowL(true);
            } else {
              setShowL(false);
            }
          }}
          size="large"
        >
          log-in
        </Button>
        <Button
          onClick={() => {
            if (!showS) {
              setShowS(true);
            } else {
              setShowS(false);
            }
          }}
          variant="outlined"
          size="large"
        >
          Sign up
        </Button>
      </Toolbar>
    </>
  );
}
