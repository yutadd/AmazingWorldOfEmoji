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
    fetch(
      "/api/share/get/comment?cid=" + json["commentInfo"]["commentID"]
    ).then((e) => {
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
  function ImageComponent(pro: any) {
    return (
      <>
        <Grid
          style={{
            width: "50%",
            height: "50%",
            display: "inline-block",
            overflow: "hidden",
          }}
        >
          <img
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              overflow: "hidden",
            }}
            src={
              "/api/share/get/image?uid=" +
              json["commentInfo"]["userID"] +
              "&imageName=" +
              pro.link
            }
          />
        </Grid>
      </>
    );
  }
  return (
    <Card sx={{ mt: "1vh" }}>
      <CardHeader
        sx={{ pb: "0px" }}
        avatar={<Avatar aria-label="recipe">{name.charAt(0)}</Avatar>}
        title={name}
        subheader={json["commentInfo"]["uid"]}
      />
      <CardContent sx={{ pb: "0px" }}>
        <Grid width={"90%"} sx={{ my: "0", mx: "1vw" }}>
          <Typography style={{ wordBreak: "break-word" }} className="message">
            {detailYml}
          </Typography>
        </Grid>
      </CardContent>
      <Grid>
        {json["files"]["file1"] !== undefined && (
          <ImageComponent link={json["files"]["file1"]} />
        )}
        {json["files"]["file2"] !== undefined && (
          <ImageComponent link={json["files"]["file2"]} />
        )}
        {json["files"]["file3"] !== undefined && (
          <ImageComponent link={json["files"]["file3"]} />
        )}
        {json["files"]["file4"] !== undefined && (
          <ImageComponent link={json["files"]["file4"]} />
        )}
      </Grid>
      <CardActions disableSpacing></CardActions>
    </Card>
  );
}
