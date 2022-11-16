import React, { useState, useEffect, useContext } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
export default function ShowDetailRight(values: any) {
  console.log(values);
  let name = values.name;
  let json = values.json;
  let detailYml = json2yaml(json);
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
  function update() {
    fetch("/api/share/get/comment?cid=" + json["c"]["commentID"]).then((e) => {
      e.json().then((newJson) => {
        json = newJson;
        detailYml = json2yaml(json);
      });
    });
  }
  useEffect(() => {
    setInterval(() => {
      update();
    }, 5000);
  }, []);
  return (
    <Card sx={{ mt: "1vh" }}>
      <CardHeader
        avatar={<Avatar aria-label="recipe">{name.charAt(0)}</Avatar>}
        title={name}
        subheader={json["c"]["uid"]}
      />

      <CardContent>
        <Grid width={"90%"} sx={{ my: "0", mx: "1vw" }}>
          <Typography
            style={{ wordBreak: "break-word" }}
            className="message"
            sx={{ mt: "2vh" }}
          >
            {detailYml}
          </Typography>
        </Grid>
      </CardContent>
      <CardMedia
        component="img"
        height="194"
        image={
          "https://i.pinimg.com/originals/e5/15/ef/e515efa787e87387a6223f103c39913b.jpg"
        } //将来的にはこのコメントに付属された画像を表示する。
        alt="Paella dish"
      />
      <CardActions disableSpacing></CardActions>
    </Card>
  );
}
