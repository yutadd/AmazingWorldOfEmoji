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
import { textAlign } from "@mui/system";
export default function (props: any) {
  const json = props.json;
  const [length, setlength] = useState(0);
  useEffect(() => {
    if (json["files"]["file1"] !== undefined) {
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
    <>
      <Grid
        style={{
          marginTop: "1vh",
          maxHeight: "100%",
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        {length > 0 && <ImageComponent link={json["files"]["file1"]} />}
        {length > 1 && <ImageComponent link={json["files"]["file2"]} />}
        {length > 2 && <ImageComponent link={json["files"]["file3"]} />}
        {length > 3 && <ImageComponent link={json["files"]["file4"]} />}
      </Grid>
    </>
  );
}
