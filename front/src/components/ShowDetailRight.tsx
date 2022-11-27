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
  const [length, setlength] = useState(0);
  console.log(values);
  let name = values.name;
  let json = values.json;
  function update() {
    fetch(
      "/api/share/get/comment?cid=" + json["commentInfo"]["commentid"]
    ).then((e) => {
      e.json().then((newJson) => {
        json = newJson;

        if ("files" in json) {
          if ("file1" in json["files"]) {
            setlength(1);
            console.log("length:" + 1);
            if (json["files"]["file2"] !== undefined) {
              setlength(2);
              console.log("length:" + 2);
              if (json["files"]["file3"] !== undefined) {
                setlength(3);
                console.log("length:" + 3);
                if (json["files"]["file4"] !== undefined) {
                  setlength(4);
                  console.log("length:" + 4);
                }
              }
            }
          }
        }
      });
    });
  }
  useEffect(() => {
    update();
    setInterval(() => {
      update();
    }, 5000);
  }, []);
  function ImageComponent(pro: any) {
    return (
      <>
        <Grid
          style={{
            width: "100%",
            height: "100%",
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
              json["userid"] +
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
            {json["commentInfo"]["text"]}
          </Typography>
        </Grid>
      </CardContent>
      <Grid style={{ textAlign: "center" }}>
        {length > 0 && <ImageComponent link={json["files"]["file1"]} />}
        {length > 1 && <ImageComponent link={json["files"]["file2"]} />}
        {length > 2 && <ImageComponent link={json["files"]["file3"]} />}
        {length > 3 && <ImageComponent link={json["files"]["file4"]} />}
      </Grid>
      <CardActions disableSpacing></CardActions>
    </Card>
  );
}
